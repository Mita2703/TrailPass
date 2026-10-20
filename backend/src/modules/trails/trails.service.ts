import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';

export type DayStatus = 'available' | 'low' | 'full' | 'closed' | 'not_open';

export async function getAvailability(trailId: string, month: string) {
  const trail = await prisma.trail.findFirst({
    where: { id: trailId, isActive: true, mountain: { isActive: true } },
    select: { id: true, name: true, price: true },
  });
  if (!trail) throw new AppError(404, 'Jalur tidak ditemukan', 'NOT_FOUND');

  // month berbentuk "2026-11": ambil dari tanggal 1 sampai sebelum tanggal 1 bulan berikutnya
  const [year, mon] = month.split('-').map(Number);
  const start = new Date(Date.UTC(year, mon - 1, 1));
  const end = new Date(Date.UTC(year, mon, 1));

  const rows = await prisma.trailQuota.findMany({
    where: { trailId, date: { gte: start, lt: end } },
    orderBy: { date: 'asc' },
  });

  const now = new Date();
  const days = rows.map((r) => {
    const remaining = Math.max(0, r.totalQuota - r.sold);

    let status: DayStatus = 'available';
    if (r.isClosed) status = 'closed';
    else if (r.bookingOpensAt && r.bookingOpensAt > now) status = 'not_open';
    else if (remaining === 0) status = 'full';
    else if (remaining / r.totalQuota <= 0.2) status = 'low';

    return {
      date: r.date.toISOString().slice(0, 10),
      total: r.totalQuota,
      sold: r.sold,
      remaining,
      status,
      price: r.priceOverride ?? trail.price,
      bookingOpensAt: r.bookingOpensAt,
    };
  });

  return { trailId: trail.id, name: trail.name, month, days };
}