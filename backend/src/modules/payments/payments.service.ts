import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import { signQrToken } from '../../lib/qr';
import { requestSnapToken, verifyMidtransSignature } from './midtrans.client';
import type { CheckTicketQuery, MidtransNotificationPayload } from './payments.schema';
import type { PaymentStatus } from '@prisma/client';

export async function createPayment(userId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, leaderUserId: userId },
    include: {
      leader: { include: { profile: true } },
      trail: { include: { mountain: true } },
      members: true,
      payments: { where: { status: 'pending' }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');

  const now = new Date();
  if (booking.status !== 'pending' || booking.expiresAt <= now) {
    throw new AppError(409, 'Booking sudah tidak aktif atau kedaluwarsa. Mulai ulang dari kalender', 'BOOKING_EXPIRED');
  }

  // Wajib mengisi data anggota sebelum melakukan pembayaran
  if (booking.members.length !== booking.memberCount) {
    throw new AppError(422, 'Lengkapi data seluruh anggota rombongan sebelum melakukan pembayaran', 'MEMBERS_NOT_SET');
  }

  // Cek sisa waktu hold (dalam detik)
  const secondsLeft = Math.floor((booking.expiresAt.getTime() - now.getTime()) / 1000);
  if (secondsLeft < 120) {
    throw new AppError(409, 'Sisa waktu penahanan kuota kurang dari 2 menit. Silakan booking ulang', 'HOLD_TIME_TOO_LOW');
  }

  const durationMinutes = Math.ceil(secondsLeft / 60);

  // Jika sudah ada payment pending dengan snap token yang masih aktif, gunakan kembali
  const existingPendingPayment = booking.payments[0];
  if (existingPendingPayment && existingPendingPayment.snapToken) {
    return {
      orderId: existingPendingPayment.midtransOrderId,
      snapToken: existingPendingPayment.snapToken,
      grossAmount: booking.totalAmount,
      secondsLeft,
    };
  }

  // Buat order_id Midtrans unik: TP-{bookingCode}-{timestamp}
  const midtransOrderId = `${booking.bookingCode}-${Date.now().toString().slice(-6)}`;

  const snapResponse = await requestSnapToken({
    orderId: midtransOrderId,
    grossAmount: booking.totalAmount,
    expiryDurationMinutes: durationMinutes,
    customerDetails: {
      fullName: booking.leader.fullName,
      email: booking.leader.email,
      phone: booking.leader.phone,
    },
    itemDetails: [
      {
        id: booking.trailId,
        price: booking.totalAmount,
        quantity: 1,
        name: `Tiket ${booking.trail.mountain.name} - Jalur ${booking.trail.name} (${booking.memberCount} orang)`,
      },
    ],
  });

  // Simpan baris payment
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      midtransOrderId,
      snapToken: snapResponse.token,
      grossAmount: booking.totalAmount,
      status: 'pending',
    },
  });

  return {
    orderId: midtransOrderId,
    snapToken: snapResponse.token,
    grossAmount: booking.totalAmount,
    secondsLeft,
  };
}

export async function handleMidtransNotification(payload: MidtransNotificationPayload) {
  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type } = payload;

  // 1. Verifikasi Signature SHA512
  const isValid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key);
  if (!isValid) {
    console.error(`Invalid Midtrans signature for order ${order_id}`);
    throw new AppError(400, 'Signature Midtrans tidak valid', 'INVALID_SIGNATURE');
  }

  // 2. Cari data pembayaran berdasarkan midtransOrderId
  const payment = await prisma.payment.findUnique({
    where: { midtransOrderId: order_id },
    include: { booking: true },
  });

  if (!payment) {
    console.warn(`Payment not found for order_id: ${order_id}`);
    return { received: true, message: 'Payment record not found' };
  }

  const booking = payment.booking;

  // 3. Cek idempotensi: bila booking sudah 'paid', jangan proses ulang
  if (booking.status === 'paid' && payment.status === 'settlement') {
    return { received: true, message: 'Already processed (idempotent)' };
  }

  // 4. Petakan status Midtrans ke sistem TrailPass
  let newPaymentStatus: PaymentStatus = 'pending';
  const isSettlement = transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status === 'accept');
  const isExpire = transaction_status === 'expire';
  const isCancel = transaction_status === 'cancel' || transaction_status === 'deny';

  if (isSettlement) {
    newPaymentStatus = 'settlement';
  } else if (isExpire) {
    newPaymentStatus = 'expire';
  } else if (isCancel) {
    newPaymentStatus = 'cancel';
  }

  // 5. Eksekusi perubahan dalam transaksi database atomik
  await prisma.$transaction(async (tx) => {
    // Update data payment
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: newPaymentStatus,
        method: payment_type ?? null,
        rawNotification: payload as any,
        paidAt: isSettlement ? new Date() : undefined,
      },
    });

    if (isSettlement && booking.status !== 'paid') {
      // Terbitkan QR token bertanda tangan
      const qrToken = signQrToken({
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        trailId: booking.trailId,
        climbDate: booking.climbDate.toISOString().slice(0, 10),
        memberCount: booking.memberCount,
      });

      // Update booking menjadi paid & pasang qr_token
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: 'paid',
          qrToken,
        },
      });

      // Konversi hold menjadi kuota terjual permanen (sold = sold + memberCount)
      await tx.$executeRaw`
        UPDATE trail_quotas
        SET sold = sold + ${booking.memberCount}
        WHERE trail_id = ${booking.trailId}::uuid AND date = ${booking.climbDate}::date
      `;
    } else if ((isExpire || isCancel) && booking.status === 'pending') {
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: isExpire ? 'expired' : 'failed',
        },
      });
      // Kuota tidak perlu dikurangi dari `sold` karena sebelumnya hanya berupa pending hold
    }
  });

  return { received: true, status: newPaymentStatus };
}

export async function getTicket(userId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, leaderUserId: userId },
    select: {
      id: true,
      bookingCode: true,
      qrToken: true,
      status: true,
      climbDate: true,
      memberCount: true,
      totalAmount: true,
      leader: { select: { fullName: true, email: true, phone: true } },
      trail: {
        select: {
          name: true,
          mountain: { select: { name: true, slug: true, province: true, regency: true, timezone: true } },
          checkpoints: { select: { name: true, orderNo: true, isSummit: true }, orderBy: { orderNo: 'asc' } },
        },
      },
      members: {
        select: {
          id: true,
          fullName: true,
          nik: true,
          status: true,
          isForeign: true,
        },
      },
      payments: {
        where: { status: 'settlement' },
        take: 1,
        select: { paidAt: true },
      },
    },
  });

  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');
  if (booking.status !== 'paid' && booking.status !== 'completed') {
    throw new AppError(400, 'Tiket belum terbit karena pembayaran belum selesai', 'PAYMENT_NOT_COMPLETED');
  }

  return {
    bookingCode: booking.bookingCode,
    qrToken: booking.qrToken,
    status: booking.status,
    climbDate: booking.climbDate.toISOString().slice(0, 10),
    mountainName: booking.trail.mountain.name,
    trailName: booking.trail.name,
    memberCount: booking.memberCount,
    totalAmount: booking.totalAmount,
    leader: booking.leader,
    members: booking.members.map((m) => ({
      id: m.id,
      fullName: m.fullName,
      nikMasked: `${m.nik.slice(0, 4)}••••••••${m.nik.slice(-4)}`,
      status: m.status,
      isForeign: m.isForeign,
    })),
    paidAt: booking.payments[0]?.paidAt ?? null,
  };
}

export async function checkBookingPublic(query: CheckTicketQuery) {
  let whereClause: any = {};

  if (query.bookingCode) {
    whereClause.bookingCode = query.bookingCode.trim().toUpperCase();
  } else if (query.nik && query.climbDate) {
    const climbDate = new Date(`${query.climbDate}T00:00:00.000Z`);
    whereClause = {
      climbDate,
      leader: {
        profile: {
          nik: query.nik.trim(),
        },
      },
    };
  }

  const booking = await prisma.booking.findFirst({
    where: whereClause,
    include: {
      leader: { select: { fullName: true } },
      trail: { include: { mountain: { select: { name: true } } } },
    },
  });

  if (!booking) {
    throw new AppError(404, 'Data booking tidak ditemukan', 'NOT_FOUND');
  }

  // Tampilkan data publik yang aman (disamarkan)
  return {
    bookingCode: booking.bookingCode,
    status: booking.status,
    mountainName: booking.trail.mountain.name,
    trailName: booking.trail.name,
    climbDate: booking.climbDate.toISOString().slice(0, 10),
    memberCount: booking.memberCount,
    leaderNameMasked: booking.leader.fullName.replace(/(?<=.{2}).(?=.{2})/g, '*'),
    isTicketReady: booking.status === 'paid' || booking.status === 'completed',
  };
}
