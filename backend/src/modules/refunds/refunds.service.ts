import { prisma } from '../../lib/prisma';
import { signQrToken } from '../../lib/qr';
import { AppError } from '../../middleware/errors';
import type { ClosureChoiceInput, RescheduleInput } from './refunds.schema';

function todayIn(timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  }
}

function daysBetween(fromDate: string, toDate: string): number {
  return Math.round((Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) / 86_400_000);
}

/**
 * Reschedule mandiri oleh pendaki:
 * - Batas maksimal 1 kali
 * - Wajib diajukan sebelum batas H-N (reschedule_deadline_days)
 * - Belum ada anggota yang check-in
 * - Tanggal baru berharga sama atau lebih rendah (selisih tidak dikembalikan)
 */
export async function rescheduleBooking(userId: string, bookingId: string, input: RescheduleInput) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, leaderUserId: userId },
    include: {
      trail: {
        include: {
          mountain: { include: { rules: true } },
        },
      },
      members: true,
    },
  });

  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');

  // 1. Validasi status booking
  if (booking.status !== 'paid') {
    throw new AppError(400, `Hanya tiket berstatus lunas yang dapat di-reschedule (status: ${booking.status})`, 'INVALID_STATUS');
  }

  // 2. Batas maksimal 1 kali reschedule
  if (booking.rescheduledCount >= 1) {
    throw new AppError(400, 'Tiket ini sudah pernah di-reschedule sebelumnya (maksimal 1 kali)', 'RESCHEDULE_LIMIT_EXCEEDED');
  }

  // 3. Belum ada anggota yang check-in
  const hasCheckedIn = booking.members.some((m) => m.status !== 'not_entered' || m.checkinAt !== null);
  if (hasCheckedIn) {
    throw new AppError(400, 'Tidak dapat reschedule karena ada anggota yang sudah melakukan check-in', 'ALREADY_CHECKED_IN');
  }

  const mountainTz = booking.trail.mountain.timezone;
  const todayStr = todayIn(mountainTz);
  const oldClimbDateStr = booking.climbDate.toISOString().slice(0, 10);
  const newClimbDateStr = input.newClimbDate;

  if (newClimbDateStr === oldClimbDateStr) {
    throw new AppError(400, 'Tanggal baru harus berbeda dari tanggal awal', 'SAME_DATE');
  }

  const rules = booking.trail.mountain.rules;

  // 4. Batas H-N pengajuan reschedule
  const deadlineDays = rules?.rescheduleDeadlineDays ?? 3;
  const daysBeforeOld = daysBetween(todayStr, oldClimbDateStr);
  if (daysBeforeOld < deadlineDays) {
    throw new AppError(400, `Reschedule harus diajukan minimal H-${deadlineDays} sebelum tanggal pendakian`, 'DEADLINE_PASSED');
  }

  // 5. Validasi tanggal baru (tidak boleh masa lalu & patuhi cutoff)
  const daysAheadNew = daysBetween(todayStr, newClimbDateStr);
  if (daysAheadNew < 0) {
    throw new AppError(422, 'Tanggal baru sudah lewat', 'DATE_IN_PAST');
  }
  const cutoffDays = rules?.bookingCutoffDays ?? 0;
  if (daysAheadNew < cutoffDays) {
    throw new AppError(422, `Pemesanan tanggal baru ditutup ${cutoffDays} hari sebelum pendakian`, 'CUTOFF_PASSED');
  }

  // 6. Cek status jalur pada tanggal baru (tidak boleh closed)
  const targetDate = new Date(`${newClimbDateStr}T00:00:00.000Z`);
  const advisoryNew = await prisma.trailAdvisory.findFirst({
    where: {
      trailId: booking.trailId,
      validFrom: { lte: targetDate },
      OR: [{ validUntil: null }, { validUntil: { gte: targetDate } }],
    },
    orderBy: { validFrom: 'desc' },
  });
  if (advisoryNew?.status === 'closed') {
    throw new AppError(409, 'Jalur ditutup pada tanggal yang dipilih', 'DATE_CLOSED');
  }

  // 7. Eksekusi alokasi kuota & perubahan tanggal dalam satu transaksi atomik
  const result = await prisma.$transaction(async (tx) => {
    // Kunci baris kuota tanggal baru
    const rows = await tx.$queryRaw<
      { id: string; total_quota: number; sold: number; is_closed: boolean; price_override: number | null }[]
    >`
      SELECT id, total_quota, sold, is_closed, price_override
      FROM trail_quotas
      WHERE trail_id = ${booking.trailId}::uuid AND date = ${newClimbDateStr}::date
      FOR UPDATE`;

    const quota = rows[0];
    if (!quota) throw new AppError(404, 'Tanggal baru tidak tersedia pada jalur ini', 'DATE_NOT_AVAILABLE');
    if (quota.is_closed) throw new AppError(409, 'Tanggal baru sedang ditutup', 'DATE_CLOSED');

    const held = await tx.booking.aggregate({
      _sum: { memberCount: true },
      where: { trailId: booking.trailId, climbDate: targetDate, status: 'pending', expiresAt: { gt: new Date() } },
    });
    const remaining = quota.total_quota - quota.sold - (held._sum.memberCount ?? 0);
    if (remaining < booking.memberCount) {
      throw new AppError(409, `Sisa kuota tanggal baru tidak mencukupi (sisa ${remaining} orang)`, 'QUOTA_FULL');
    }

    // 8. Cek harga: tanggal baru harus berharga sama atau lebih rendah dari tiket lama
    const unitPriceOld = Math.floor(booking.totalAmount / booking.memberCount);
    const unitPriceNew = quota.price_override ?? booking.trail.price;
    if (unitPriceNew > unitPriceOld) {
      throw new AppError(400, 'Tarif tanggal baru lebih mahal dari tiket awal. Pilih tanggal lain yang bertarif sama atau lebih rendah', 'PRICE_HIGHER');
    }

    // Kurangi kuota terjual di tanggal lama
    await tx.$executeRaw`
      UPDATE trail_quotas
      SET sold = GREATEST(0, sold - ${booking.memberCount})
      WHERE trail_id = ${booking.trailId}::uuid AND date = ${oldClimbDateStr}::date
    `;

    // Tambah kuota terjual di tanggal baru
    await tx.$executeRaw`
      UPDATE trail_quotas
      SET sold = sold + ${booking.memberCount}
      WHERE trail_id = ${booking.trailId}::uuid AND date = ${newClimbDateStr}::date
    `;

    // Terbitkan QR token baru (QR lama tidak berlaku)
    const newQrToken = signQrToken({
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      trailId: booking.trailId,
      climbDate: newClimbDateStr,
      memberCount: booking.memberCount,
    });

    // Update booking
    const updated = await tx.booking.update({
      where: { id: booking.id },
      data: {
        climbDate: targetDate,
        rescheduledFromDate: booking.climbDate,
        rescheduledCount: booking.rescheduledCount + 1,
        qrToken: newQrToken,
        status: 'paid',
      },
    });

    // Catat ke audit log
    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: 'booking.rescheduled',
        targetType: 'booking',
        targetId: booking.id,
        detail: {
          from: oldClimbDateStr,
          to: newClimbDateStr,
          memberCount: booking.memberCount,
        },
      },
    });

    return updated;
  });

  return {
    success: true,
    message: `Reschedule berhasil ke tanggal ${newClimbDateStr}`,
    bookingCode: result.bookingCode,
    newClimbDate: newClimbDateStr,
    qrToken: result.qrToken,
    rescheduledCount: result.rescheduledCount,
  };
}

/**
 * Pilihan pendaki saat jalur ditutup mendadak oleh pengelola:
 * - Reschedule gratis (bebas batas H-N & 1x)
 * - Refund penuh (pencatatan data rekening & pengembalian kuota)
 */
export async function handleClosureChoice(userId: string, bookingId: string, input: ClosureChoiceInput) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, leaderUserId: userId },
    include: {
      trail: { include: { mountain: { include: { rules: true } } } },
      members: true,
    },
  });

  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');

  // Pastikan jalur memang ditutup atau booking berstatus cancelled_by_closure
  const climbDateStr = booking.climbDate.toISOString().slice(0, 10);
  const now = new Date();
  const advisory = await prisma.trailAdvisory.findFirst({
    where: {
      trailId: booking.trailId,
      validFrom: { lte: booking.climbDate },
      OR: [{ validUntil: null }, { validUntil: { gte: booking.climbDate } }],
    },
    orderBy: { validFrom: 'desc' },
  });

  const isClosed = advisory?.status === 'closed' || booking.status === 'cancelled_by_closure';
  if (!isClosed) {
    throw new AppError(400, 'Jalur pada tanggal tiket tidak sedang dalam status penutupan resmi', 'TRAIL_NOT_CLOSED');
  }

  if (input.choice === 'reschedule') {
    const newClimbDateStr = input.newClimbDate;
    const targetDate = new Date(`${newClimbDateStr}T00:00:00.000Z`);

    // Reschedule gratis akibat penutupan jalur
    const result = await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<
        { id: string; total_quota: number; sold: number; is_closed: boolean; price_override: number | null }[]
      >`
        SELECT id, total_quota, sold, is_closed, price_override
        FROM trail_quotas
        WHERE trail_id = ${booking.trailId}::uuid AND date = ${newClimbDateStr}::date
        FOR UPDATE`;

      const quota = rows[0];
      if (!quota) throw new AppError(404, 'Tanggal baru tidak tersedia pada jalur ini', 'DATE_NOT_AVAILABLE');
      if (quota.is_closed) throw new AppError(409, 'Tanggal baru sedang ditutup', 'DATE_CLOSED');

      const remaining = quota.total_quota - quota.sold;
      if (remaining < booking.memberCount) {
        throw new AppError(409, `Sisa kuota tanggal baru tidak mencukupi (sisa ${remaining} orang)`, 'QUOTA_FULL');
      }

      // Kurangi kuota lama & tambah kuota baru
      await tx.$executeRaw`
        UPDATE trail_quotas
        SET sold = GREATEST(0, sold - ${booking.memberCount})
        WHERE trail_id = ${booking.trailId}::uuid AND date = ${climbDateStr}::date
      `;
      await tx.$executeRaw`
        UPDATE trail_quotas
        SET sold = sold + ${booking.memberCount}
        WHERE trail_id = ${booking.trailId}::uuid AND date = ${newClimbDateStr}::date
      `;

      const newQrToken = signQrToken({
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        trailId: booking.trailId,
        climbDate: newClimbDateStr,
        memberCount: booking.memberCount,
      });

      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          climbDate: targetDate,
          rescheduledFromDate: booking.climbDate,
          qrToken: newQrToken,
          status: 'paid',
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'booking.closure_reschedule',
          targetType: 'booking',
          targetId: booking.id,
          detail: { from: climbDateStr, to: newClimbDateStr },
        },
      });

      return updated;
    });

    return {
      success: true,
      choice: 'reschedule',
      message: `Tiket berhasil dipindahkan ke tanggal ${input.newClimbDate} akibat penutupan jalur`,
      newClimbDate: input.newClimbDate,
      qrToken: result.qrToken,
    };
  }

  // Jika memilih refund
  const refundResult = await prisma.$transaction(async (tx) => {
    // 1. Buat permintaan refund
    const refund = await tx.refundRequest.create({
      data: {
        bookingId: booking.id,
        reason: `Penutupan jalur. Rekening: ${input.bankName} ${input.accountNumber} a.n ${input.accountHolder}`,
        amount: booking.totalAmount,
        status: 'requested',
      },
    });

    // 2. Ubah status booking menjadi refund_requested
    await tx.booking.update({
      where: { id: booking.id },
      data: { status: 'refund_requested' },
    });

    // 3. Kembalikan kuota lama
    await tx.$executeRaw`
      UPDATE trail_quotas
      SET sold = GREATEST(0, sold - ${booking.memberCount})
      WHERE trail_id = ${booking.trailId}::uuid AND date = ${climbDateStr}::date
    `;

    // 4. Catat di audit log
    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: 'booking.closure_refund_requested',
        targetType: 'booking',
        targetId: booking.id,
        detail: {
          amount: booking.totalAmount,
          bank: input.bankName,
          accountNumber: input.accountNumber,
        },
      },
    });

    return refund;
  });

  return {
    success: true,
    choice: 'refund',
    message: 'Permintaan refund telah dicatat dan akan segera diproses oleh admin',
    refundId: refundResult.id,
    amount: refundResult.amount,
  };
}

/**
 * Batalkan booking sebelum bayar (hanya saat status pending).
 */
export async function cancelPendingBooking(userId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, leaderUserId: userId },
  });

  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');
  if (booking.status !== 'pending') {
    throw new AppError(400, 'Hanya booking berstatus pending yang dapat dibatalkan secara langsung', 'INVALID_STATUS');
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'expired' },
  });

  return { success: true, message: 'Booking berhasil dibatalkan dan kuota telah dikembalikan' };
}

/**
 * Mengambil riwayat pesanan milik pendaki yang sedang login.
 */
export async function getMyBookings(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { leaderUserId: userId },
    include: {
      trail: {
        select: {
          name: true,
          mountain: { select: { name: true, slug: true } },
        },
      },
      payments: {
        where: { status: 'settlement' },
        take: 1,
        select: { paidAt: true, method: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    bookings: bookings.map((b) => ({
      id: b.id,
      bookingCode: b.bookingCode,
      mountainName: b.trail.mountain.name,
      trailName: b.trail.name,
      climbDate: b.climbDate.toISOString().slice(0, 10),
      memberCount: b.memberCount,
      totalAmount: b.totalAmount,
      status: b.status,
      rescheduledCount: b.rescheduledCount,
      paidAt: b.payments[0]?.paidAt ?? null,
      createdAt: b.createdAt,
    })),
  };
}
