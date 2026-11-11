import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import type { SetAdvisoryInput } from './advisories.schema';

/** Ambil advisory aktif sekarang untuk suatu jalur */
export async function getCurrentAdvisory(trailId: string) {
  const now = new Date();
  const advisory = await prisma.trailAdvisory.findFirst({
    where: {
      trailId,
      validFrom: { lte: now },
      OR: [{ validUntil: null }, { validUntil: { gte: now } }],
    },
    orderBy: { validFrom: 'desc' },
    select: {
      id: true,
      status: true,
      severity: true,
      reason: true,
      message: true,
      validFrom: true,
      validUntil: true,
      sourceUrl: true,
      maxCheckpoint: { select: { id: true, name: true, orderNo: true } },
      setBy: { select: { id: true, fullName: true, role: true } },
    },
  });
  return advisory;
}

/** Preview booking yang terdampak penutupan jalur pada rentang tanggal */
export async function previewAffectedBookings(
  trailId: string,
  dateFrom: string,
  dateTo: string,
) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  const count = await prisma.booking.count({
    where: {
      trailId,
      climbDate: { gte: from, lte: to },
      status: { in: ['pending', 'paid'] },
    },
  });
  return { count };
}

/** Pasang advisory + opsional batalkan booking terdampak */
export async function setTrailAdvisory(
  userId: string,
  trailId: string,
  input: SetAdvisoryInput,
) {
  // Pastikan trail ada
  const trail = await prisma.trail.findUnique({ where: { id: trailId }, select: { id: true } });
  if (!trail) throw new AppError(404, 'Jalur tidak ditemukan', 'NOT_FOUND');

  const advisory = await prisma.trailAdvisory.create({
    data: {
      trailId,
      status: input.status as 'open' | 'limited' | 'closed',
      maxCheckpointId: input.maxCheckpointId,
      reason: input.reason,
      message: input.message,
      severity: (input.severity ?? 'info') as 'info' | 'warning' | 'danger',
      validFrom: new Date(input.validFrom),
      validUntil: input.validUntil ? new Date(input.validUntil) : undefined,
      sourceUrl: input.sourceUrl,
      setById: userId,
    },
    select: {
      id: true,
      status: true,
      severity: true,
      reason: true,
      message: true,
      validFrom: true,
      validUntil: true,
    },
  });

  let cancelledCount = 0;
  if (
    input.status === 'closed' &&
    input.cancelAffected &&
    input.closureDateFrom &&
    input.closureDateTo
  ) {
    const result = await cancelBookingsByClosure(
      trailId,
      input.closureDateFrom,
      input.closureDateTo,
    );
    cancelledCount = result.count;
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: 'set_advisory',
      targetType: 'trail',
      targetId: trailId,
      detail: { advisoryId: advisory.id, status: input.status, cancelledCount },
    },
  });

  return { advisory, cancelledCount };
}

/** Batalkan semua booking pending/paid pada jalur & rentang tanggal (penutupan darurat) */
export async function cancelBookingsByClosure(
  trailId: string,
  dateFrom: string,
  dateTo: string,
) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  const { count } = await prisma.booking.updateMany({
    where: {
      trailId,
      climbDate: { gte: from, lte: to },
      status: { in: ['pending', 'paid'] },
    },
    data: { status: 'cancelled_by_closure' },
  });

  // Placeholder: kirim notifikasi/email ke pemimpin booking (implementasi email di Phase 6)
  if (count > 0) {
    console.info(`[Advisory] ${count} booking dibatalkan karena penutupan jalur ${trailId}`);
  }

  return { count };
}
