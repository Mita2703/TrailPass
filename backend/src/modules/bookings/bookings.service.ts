import { randomInt } from 'node:crypto';
import { Prisma } from '@prisma/client';
import type { Booking } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import type { CreateBookingInput } from './bookings.schema';

// Alfabet tanpa O, I, 0, 1 supaya kode mudah dibaca dan tidak tertukar.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeBookingCode() {
  let s = '';
  for (let i = 0; i < 6; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `TP-${s}`;
}

/** Tanggal "hari ini" (YYYY-MM-DD) menurut zona waktu gunung. */
function todayIn(timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
}

function daysBetween(fromDate: string, toDate: string) {
  return Math.round((Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) / 86_400_000);
}

function present(b: Booking) {
  const now = Date.now();
  const expired = b.status === 'pending' && b.expiresAt.getTime() <= now;
  return {
    id: b.id,
    bookingCode: b.bookingCode,
    status: expired ? 'expired' : b.status,
    trailId: b.trailId,
    climbDate: b.climbDate.toISOString().slice(0, 10),
    memberCount: b.memberCount,
    totalAmount: b.totalAmount,
    expiresAt: b.expiresAt,
    secondsLeft: b.status === 'pending' ? Math.max(0, Math.ceil((b.expiresAt.getTime() - now) / 1000)) : 0,
  };
}

export async function createHold(userId: string, input: CreateBookingInput, idempotencyKey: string) {
  // 1. Permintaan yang sama (klik ganda): kembalikan booking yang sudah ada.
  const existing = await prisma.booking.findFirst({ where: { leaderUserId: userId, idempotencyKey } });
  if (existing) return { booking: present(existing), created: false };

  // 2. Ketua rombongan harus berprofil terverifikasi.
  const profile = await prisma.climberProfile.findUnique({ where: { userId } });
  if (!profile || profile.verifiedStatus !== 'verified') {
    throw new AppError(403, 'Profil pendaki belum terverifikasi', 'PROFILE_NOT_VERIFIED');
  }

  // 3. Jalur, gunung, dan aturannya.
  const trail = await prisma.trail.findFirst({
    where: { id: input.trailId, isActive: true, mountain: { isActive: true } },
    include: { mountain: { include: { rules: true } } },
  });
  if (!trail || !trail.mountain.rules) throw new AppError(404, 'Jalur tidak ditemukan', 'NOT_FOUND');
  const rules = trail.mountain.rules;

  // 4. Aturan gunung: ukuran rombongan dan batas waktu pemesanan.
  if (input.memberCount < rules.minGroup || input.memberCount > rules.maxGroup) {
    throw new AppError(422, `Jumlah anggota harus antara ${rules.minGroup} dan ${rules.maxGroup} orang`, 'GROUP_SIZE_INVALID');
  }
  const daysAhead = daysBetween(todayIn(trail.mountain.timezone), input.climbDate);
  if (daysAhead < 0) throw new AppError(422, 'Tanggal pendakian sudah lewat', 'DATE_IN_PAST');
  if (daysAhead < rules.bookingCutoffDays) {
    throw new AppError(422, `Pemesanan ditutup ${rules.bookingCutoffDays} hari sebelum pendakian`, 'CUTOFF_PASSED');
  }

  // 5. Tahan kuota secara atomik.
  const climbDate = new Date(`${input.climbDate}T00:00:00.000Z`);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const booking = await prisma.$transaction(async (tx) => {
        // Kunci baris kuota: permintaan lain ke tanggal yang sama menunggu sampai transaksi ini selesai.
        const rows = await tx.$queryRaw<
          { id: string; total_quota: number; sold: number; is_closed: boolean; booking_opens_at: Date | null; price_override: number | null }[]
        >`
          SELECT id, total_quota, sold, is_closed, booking_opens_at, price_override
          FROM trail_quotas
          WHERE trail_id = ${input.trailId}::uuid AND date = ${input.climbDate}::date
          FOR UPDATE`;
        const quota = rows[0];
        if (!quota) throw new AppError(404, 'Tanggal tidak tersedia untuk jalur ini', 'DATE_NOT_AVAILABLE');
        if (quota.is_closed) throw new AppError(409, 'Tanggal ini ditutup', 'DATE_CLOSED');
        const now = new Date();
        if (quota.booking_opens_at && quota.booking_opens_at > now) {
          throw new AppError(409, 'Pemesanan untuk tanggal ini belum dibuka', 'NOT_OPEN');
        }

        // Yang sedang ditahan = booking pending yang belum kedaluwarsa.
        const held = await tx.booking.aggregate({
          _sum: { memberCount: true },
          where: { trailId: input.trailId, climbDate, status: 'pending', expiresAt: { gt: now } },
        });
        const remaining = quota.total_quota - quota.sold - (held._sum.memberCount ?? 0);
        if (remaining < input.memberCount) {
          throw new AppError(409, remaining > 0 ? `Sisa kuota hanya ${remaining} orang` : 'Kuota habis', 'QUOTA_FULL');
        }

        // Total sementara; perhitungan biaya lengkap (WNA, biaya tambahan) menyusul di langkah data anggota.
        const unitPrice = quota.price_override ?? trail.price;
        return tx.booking.create({
          data: {
            bookingCode: makeBookingCode(),
            leaderUserId: userId,
            trailId: input.trailId,
            climbDate,
            memberCount: input.memberCount,
            totalAmount: unitPrice * input.memberCount,
            status: 'pending',
            expiresAt: new Date(now.getTime() + rules.holdMinutes * 60_000),
            idempotencyKey,
          },
        });
      });
      return { booking: present(booking), created: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        // Bentrok unik: dua klik bersamaan (ambil yang sudah ada) atau kode booking kembar (coba kode baru).
        const again = await prisma.booking.findFirst({ where: { leaderUserId: userId, idempotencyKey } });
        if (again) return { booking: present(again), created: false };
        continue;
      }
      throw e;
    }
  }
  throw new AppError(500, 'Gagal membuat kode booking, coba lagi', 'CODE_GENERATION_FAILED');
}

export async function getBooking(userId: string, id: string) {
  const booking = await prisma.booking.findFirst({ where: { id, leaderUserId: userId } });
  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');
  return present(booking);
}