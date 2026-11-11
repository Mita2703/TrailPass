import crypto from 'node:crypto';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { AppError } from '../../middleware/errors';
import type { JoinQueueInput } from './queue.schema';

/**
 * Masuk ke antrean virtual per jalur per tanggal.
 */
export async function joinQueue(userId: string, trailId: string, input: JoinQueueInput) {
  const trail = await prisma.trail.findUnique({
    where: { id: trailId },
    select: { id: true, queueEnabled: true, queueMaxActive: true, isActive: true },
  });

  if (!trail || !trail.isActive) {
    throw new AppError(404, 'Jalur tidak ditemukan atau tidak aktif', 'NOT_FOUND');
  }

  const dateStr = input.climbDate;
  const accessKey = `access:${trailId}:${dateStr}:${userId}`;
  const queueKey = `queue:${trailId}:${dateStr}`;
  const hbKey = `queue:hb:${trailId}:${dateStr}:${userId}`;

  // 1. Jika antrean dinonaktifkan pada jalur ini, langsung terbitkan access token
  if (!trail.queueEnabled) {
    const token = crypto.randomUUID();
    await redis.set(accessKey, token, 'EX', 600); // 10 menit
    return {
      queueEnabled: false,
      canProceed: true,
      accessToken: token,
      position: 0,
      estimatedWaitSeconds: 0,
    };
  }

  // 2. Jika pengguna sudah memiliki access token yang masih berlaku, gunakan itu
  const existingToken = await redis.get(accessKey);
  if (existingToken) {
    return {
      queueEnabled: true,
      canProceed: true,
      accessToken: existingToken,
      position: 0,
      estimatedWaitSeconds: 0,
    };
  }

  // 3. Cek apakah slot aktif saat ini masih di bawah queueMaxActive
  const queueLength = await redis.zcard(queueKey);
  if (queueLength === 0) {
    // Belum ada yang mengantre, langsung izinkan masuk form booking
    const token = crypto.randomUUID();
    await redis.set(accessKey, token, 'EX', 600);
    return {
      queueEnabled: true,
      canProceed: true,
      accessToken: token,
      position: 0,
      estimatedWaitSeconds: 0,
    };
  }

  // 4. Masukkan ke Sorted Set antrean Redis
  await redis.zadd(queueKey, Date.now(), userId);
  await redis.set(hbKey, '1', 'EX', 35); // Heartbeat 35 detik

  const rank = await redis.zrank(queueKey, userId);
  const position = (rank ?? 0) + 1;
  const estimatedWaitSeconds = position * 10;

  return {
    queueEnabled: true,
    canProceed: false,
    accessToken: null,
    inQueue: true,
    position,
    estimatedWaitSeconds,
  };
}

/**
 * Polling status posisi antrean virtual & refresh heartbeat.
 */
export async function getQueueStatus(userId: string, trailId: string, dateStr: string) {
  const accessKey = `access:${trailId}:${dateStr}:${userId}`;
  const queueKey = `queue:${trailId}:${dateStr}`;
  const hbKey = `queue:hb:${trailId}:${dateStr}:${userId}`;

  // Cek apakah sudah dipanggil & memiliki access token
  const token = await redis.get(accessKey);
  if (token) {
    return {
      canProceed: true,
      accessToken: token,
      inQueue: false,
      position: 0,
      estimatedWaitSeconds: 0,
    };
  }

  // Cek nomor urut di Sorted Set
  const rank = await redis.zrank(queueKey, userId);
  if (rank === null) {
    return {
      canProceed: false,
      accessToken: null,
      inQueue: false,
      position: null,
      message: 'Anda tidak berada dalam antrean',
    };
  }

  // Perpanjang heartbeat browser
  await redis.set(hbKey, '1', 'EX', 35);

  const position = rank + 1;
  return {
    canProceed: false,
    accessToken: null,
    inQueue: true,
    position,
    estimatedWaitSeconds: position * 10,
  };
}

/**
 * Keluar dari antrean virtual secara sukarela.
 */
export async function leaveQueue(userId: string, trailId: string, dateStr: string) {
  const queueKey = `queue:${trailId}:${dateStr}`;
  const hbKey = `queue:hb:${trailId}:${dateStr}:${userId}`;
  const accessKey = `access:${trailId}:${dateStr}:${userId}`;

  await redis.zrem(queueKey, userId);
  await redis.del(hbKey, accessKey);

  return { success: true };
}

/**
 * Verifikasi dan konsumsi access token antrean saat createHold dipanggil.
 */
export async function verifyAndConsumeToken(
  userId: string,
  trailId: string,
  dateStr: string,
  tokenProvided?: string,
): Promise<boolean> {
  const trail = await prisma.trail.findUnique({
    where: { id: trailId },
    select: { queueEnabled: true },
  });

  // Jika antrean tidak aktif di jalur ini, tidak wajib token
  if (!trail?.queueEnabled) return true;

  if (!tokenProvided) return false;

  const accessKey = `access:${trailId}:${dateStr}:${userId}`;
  const stored = await redis.get(accessKey);

  if (stored && stored === tokenProvided) {
    // Hapus token agar tidak dipakai ganda untuk hold lain
    await redis.del(accessKey);
    return true;
  }

  return false;
}
