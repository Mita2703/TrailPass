import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';

export type DayStatus = 'available' | 'low' | 'full' | 'closed' | 'not_open';

export async function getAvailability(trailId: string, month: string) {
  const trail = await prisma.trail.findFirst({
    where: { id: trailId, isActive: true, mountain: { isActive: true } },
    select: { id: true, name: true, price: true },
  });
  if (!trail) throw new AppError(404, 'Jalur tidak ditemukan', 'NOT_FOUND');

  const [year, mon] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, mon - 1, 1));
  const end = new Date(Date.UTC(year, mon, 1));
  const now = new Date();

  const [rows, heldRows] = await Promise.all([
    prisma.trailQuota.findMany({
      where: { trailId, date: { gte: start, lt: end } },
      orderBy: { date: 'asc' },
    }),
    // Jumlah anggota yang sedang ditahan per tanggal (booking pending yang belum kedaluwarsa)
    prisma.booking.groupBy({
      by: ['climbDate'],
      where: { trailId, climbDate: { gte: start, lt: end }, status: 'pending', expiresAt: { gt: now } },
      _sum: { memberCount: true },
    }),
  ]);

  const heldByDate = new Map(heldRows.map((h) => [h.climbDate.toISOString().slice(0, 10), h._sum.memberCount ?? 0]));

  const days = rows.map((r) => {
    const date = r.date.toISOString().slice(0, 10);
    const held = heldByDate.get(date) ?? 0;
    const remaining = Math.max(0, r.totalQuota - r.sold - held);

    let status: DayStatus = 'available';
    if (r.isClosed) status = 'closed';
    else if (r.bookingOpensAt && r.bookingOpensAt > now) status = 'not_open';
    else if (remaining === 0) status = 'full';
    else if (remaining / r.totalQuota <= 0.2) status = 'low';

    return {
      date,
      total: r.totalQuota,
      sold: r.sold,
      held,
      remaining,
      status,
      price: r.priceOverride ?? trail.price,
      bookingOpensAt: r.bookingOpensAt,
    };
  });

  return { trailId: trail.id, name: trail.name, month, days };
}