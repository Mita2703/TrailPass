import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';
import crypto from 'node:crypto';

/**
 * 1. Hold Expirer: Menandai booking pending yang telah melewati batas hold (expiresAt) menjadi expired.
 * Kuota yang tadinya tertahan otomatis kembali bebas.
 */
export async function runHoldExpirer(): Promise<number> {
  const now = new Date();
  const result = await prisma.booking.updateMany({
    where: {
      status: 'pending',
      expiresAt: { lte: now },
    },
    data: {
      status: 'expired',
    },
  });
  return result.count;
}

/**
 * 2. No-Show Marker: Menandai anggota yang tidak pernah datang (not_entered)
 * setelah climb_date + 1 hari berlalu menjadi no_show.
 */
export async function runNoShowMarker(): Promise<number> {
  const now = new Date();
  // 1 hari setelah climb_date
  const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const updated = await prisma.bookingMember.updateMany({
    where: {
      status: 'not_entered',
      booking: {
        climbDate: { lte: cutoffDate },
        status: { in: ['paid', 'completed'] },
      },
    },
    data: {
      status: 'no_show',
    },
  });

  // Periksa booking yang kini semua anggotanya telah berstatus final
  const candidateBookings = await prisma.booking.findMany({
    where: {
      climbDate: { lte: cutoffDate },
      status: 'paid',
    },
    select: {
      id: true,
      members: { select: { status: true } },
    },
  });

  const finalStatuses = new Set(['exited', 'manual_exit', 'cancelled', 'no_show']);
  for (const b of candidateBookings) {
    if (b.members.every((m) => finalStatuses.has(m.status))) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { status: 'completed' },
      });
    }
  }

  return updated.count;
}

/**
 * 3. Overdue Climbers Monitor: Mendeteksi pendaki yang masih berstatus 'climbing'
 * melampaui batas hari pendakian (max_duration_days) aturan gunung.
 */
export async function getOverdueClimbers(mountainId?: string) {
  const now = new Date();

  const members = await prisma.bookingMember.findMany({
    where: {
      status: 'climbing',
      booking: {
        trail: mountainId ? { mountainId } : undefined,
      },
    },
    include: {
      booking: {
        include: {
          leader: {
            select: {
              fullName: true,
              phone: true,
              profile: {
                select: { emergencyContactName: true, emergencyContactPhone: true },
              },
            },
          },
          trail: {
            include: {
              mountain: {
                include: { rules: true },
              },
            },
          },
        },
      },
      checkinBy: { select: { fullName: true } },
    },
  });

  const overdueList = members.filter((m) => {
    const rules = m.booking.trail.mountain.rules;
    const maxDays = rules?.maxDurationDays ?? 2;
    // climbDate + maxDays dalam milidetik
    const deadline = new Date(m.booking.climbDate.getTime() + maxDays * 24 * 60 * 60 * 1000);
    return now > deadline;
  });

  return overdueList.map((m) => {
    const rules = m.booking.trail.mountain.rules;
    const maxDays = rules?.maxDurationDays ?? 2;
    const deadline = new Date(m.booking.climbDate.getTime() + maxDays * 24 * 60 * 60 * 1000);
    const hoursOverdue = Math.max(0, Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60)));

    return {
      memberId: m.id,
      fullName: m.fullName,
      nik: m.nik,
      emergencyContact: m.emergencyContact,
      bookingCode: m.booking.bookingCode,
      climbDate: m.booking.climbDate.toISOString().slice(0, 10),
      mountainName: m.booking.trail.mountain.name,
      trailName: m.booking.trail.name,
      checkinAt: m.checkinAt,
      checkinBy: m.checkinBy?.fullName ?? null,
      leader: {
        fullName: m.booking.leader.fullName,
        phone: m.booking.leader.phone,
        emergencyName: m.booking.leader.profile?.emergencyContactName ?? null,
        emergencyPhone: m.booking.leader.profile?.emergencyContactPhone ?? null,
      },
      hoursOverdue,
      maxDurationDays: maxDays,
    };
  });
}

/**
 * 4. Queue Caller: Memeriksa antrean per jalur per tanggal, membuang anggota yang heartbeat-nya mati,
 * dan memanggil giliran berikutnya dengan menerbitkan access token.
 */
export async function processQueueBatch(trailId: string, dateStr: string, maxActive = 30): Promise<number> {
  const queueKey = `queue:${trailId}:${dateStr}`;

  // Ambil hingga 50 antrean teratas
  const members = await redis.zrange(queueKey, 0, 50);
  if (members.length === 0) return 0;

  let calledCount = 0;
  for (const userId of members) {
    const hbKey = `queue:hb:${trailId}:${dateStr}:${userId}`;
    const isAlive = await redis.exists(hbKey);

    if (!isAlive) {
      // Browser pengguna ditutup atau ditinggalkan: hapus dari antrean
      await redis.zrem(queueKey, userId);
      continue;
    }

    if (calledCount < maxActive) {
      // Terbitkan access token untuk pengguna
      const accessKey = `access:${trailId}:${dateStr}:${userId}`;
      const token = crypto.randomUUID();
      await redis.set(accessKey, token, 'EX', 600); // Berlaku 10 menit
      await redis.zrem(queueKey, userId);
      calledCount++;
    }
  }

  return calledCount;
}

let jobInterval: NodeJS.Timeout | null = null;

/**
 * Memulai scheduler latar belakang berkala (dapat dipanggil saat inisialisasi server).
 */
export function startBackgroundWorkers(intervalMs = 60_000) {
  if (jobInterval) return;

  jobInterval = setInterval(async () => {
    try {
      await runHoldExpirer();
      await runNoShowMarker();
    } catch (e) {
      console.error('Error running background jobs:', e);
    }
  }, intervalMs);
}

export function stopBackgroundWorkers() {
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
  }
}
