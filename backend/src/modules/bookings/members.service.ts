import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import type { SetMembersInput } from './members.schema';
import { ageOn, calcTotals, maskNik, parseFees } from './members.utils';

export async function setMembers(userId: string, bookingId: string, input: SetMembersInput) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, leaderUserId: userId },
    include: { trail: { include: { mountain: { include: { rules: true } } } } },
  });
  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');

  const now = new Date();
  if (booking.status !== 'pending' || booking.expiresAt.getTime() <= now.getTime()) {
    throw new AppError(409, 'Booking sudah tidak aktif. Mulai ulang dari kalender', 'BOOKING_NOT_ACTIVE');
  }

  const { members } = input;
  if (members.length !== booking.memberCount) {
    throw new AppError(422, `Jumlah anggota harus ${booking.memberCount} orang sesuai booking`, 'MEMBER_COUNT_MISMATCH');
  }

  const climbDateStr = booking.climbDate.toISOString().slice(0, 10);
  const niks = members.map((m) => m.nik);

  // 1. Nomor identitas tidak boleh kembar dalam satu rombongan.
  const seen = new Set<string>();
  members.forEach((m, i) => {
    if (seen.has(m.nik)) throw new AppError(422, `Nomor identitas anggota ke-${i + 1} ganda dalam rombongan`, 'DUPLICATE_NIK');
    seen.add(m.nik);
  });

  // 2. Umur minimum menurut aturan gunung, dihitung pada tanggal pendakian.
  const minAge = booking.trail.mountain.rules?.minAge;
  if (minAge != null) {
    members.forEach((m, i) => {
      if (ageOn(m.birthDate, climbDateStr) < minAge) {
        throw new AppError(422, `Anggota ke-${i + 1} belum mencapai umur minimum ${minAge} tahun`, 'UNDER_MIN_AGE');
      }
    });
  }

  // 3. Daftar hitam (blacklist) yang masih berlaku pada tanggal pendakian.
  const blocked = await prisma.blacklist.findMany({
    where: {
      nik: { in: niks },
      startDate: { lte: booking.climbDate },
      OR: [{ endDate: null }, { endDate: { gte: booking.climbDate } }],
    },
    select: { nik: true },
  });
  if (blocked.length > 0) {
    const bad = new Set(blocked.map((b) => b.nik.toUpperCase()));
    const idx = niks.findIndex((n) => bad.has(n));
    // Alasan penangguhan sengaja tidak ditampilkan.
    throw new AppError(403, `Anggota ke-${idx + 1} tidak dapat mendaftar pada tanggal ini`, 'BLACKLISTED');
  }

  // 4. Nomor identitas yang sama tidak boleh ada di booking lain pada tanggal yang sama.
  const clash = await prisma.bookingMember.findFirst({
    where: {
      nik: { in: niks },
      status: { not: 'cancelled' },
      booking: {
        id: { not: booking.id },
        climbDate: booking.climbDate,
        OR: [{ status: 'paid' }, { status: 'pending', expiresAt: { gt: now } }],
      },
    },
    select: { nik: true },
  });
  if (clash) {
    const idx = niks.indexOf(clash.nik.toUpperCase());
    throw new AppError(409, `Anggota ke-${idx + 1} sudah terdaftar di booking lain pada tanggal ini`, 'NIK_ALREADY_BOOKED');
  }

  // 5. Hitung biaya.
  const quota = await prisma.trailQuota.findUnique({
    where: { trailId_date: { trailId: booking.trailId, date: booking.climbDate } },
    select: { priceOverride: true },
  });
  const base = quota?.priceOverride ?? booking.trail.price;
  const foreign = booking.trail.priceForeign ?? booking.trail.price;
  const totals = calcTotals(members, { base, foreign }, parseFees(booking.trail.extraFees));

  // 6. Simpan: ganti seluruh daftar anggota dan perbarui total (satu transaksi).
  await prisma.$transaction([
    prisma.bookingMember.deleteMany({ where: { bookingId: booking.id } }),
    prisma.bookingMember.createMany({
      data: members.map((m, i) => ({
        bookingId: booking.id,
        fullName: m.fullName,
        nik: m.nik,
        birthDate: new Date(`${m.birthDate}T00:00:00.000Z`),
        gender: m.gender,
        emergencyContact: m.emergencyContact,
        isForeign: m.isForeign,
        priceApplied: totals.perMember[i],
      })),
    }),
    prisma.booking.update({ where: { id: booking.id }, data: { totalAmount: totals.total } }),
  ]);

  return {
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    climbDate: climbDateStr,
    secondsLeft: Math.max(0, Math.ceil((booking.expiresAt.getTime() - now.getTime()) / 1000)),
    members: members.map((m, i) => ({
      no: i + 1,
      fullName: m.fullName,
      nik: maskNik(m.nik),
      isForeign: m.isForeign,
      price: totals.perMember[i],
    })),
    subtotal: totals.subtotal,
    extraFees: totals.extraFees,
    total: totals.total,
  };
}