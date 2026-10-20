import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';

// Prisma mengirim kolom Decimal sebagai teks. Ubah ke angka supaya enak dipakai frontend.
const num = (v: unknown) => (v == null ? null : Number(String(v)));

export async function listMountains() {
  const mountains = await prisma.mountain.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: { trails: { where: { isActive: true }, select: { price: true } } },
  });

  return mountains.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    province: m.province,
    regency: m.regency,
    elevationM: m.elevationM,
    coverImage: m.coverImage,
    trailCount: m.trails.length,
    priceFrom: m.trails.length ? Math.min(...m.trails.map((t) => t.price)) : null,
  }));
}

export async function getMountainBySlug(slug: string) {
  const m = await prisma.mountain.findFirst({
    where: { slug, isActive: true },
    include: {
      rules: true,
      trails: { where: { isActive: true }, orderBy: { name: 'asc' } },
    },
  });
  if (!m) throw new AppError(404, 'Gunung tidak ditemukan', 'NOT_FOUND');

  return {
    id: m.id,
    slug: m.slug,
    name: m.name,
    province: m.province,
    regency: m.regency,
    elevationM: m.elevationM,
    lat: num(m.lat),
    lng: num(m.lng),
    timezone: m.timezone,
    description: m.description,
    coverImage: m.coverImage,
    managingAgency: m.managingAgency,
    officialUrl: m.officialUrl,
    rules: m.rules
      ? {
          minGroup: m.rules.minGroup,
          maxGroup: m.rules.maxGroup,
          minAge: m.rules.minAge,
          bookingCutoffDays: m.rules.bookingCutoffDays,
          holdMinutes: m.rules.holdMinutes,
          maxDurationDays: m.rules.maxDurationDays,
          rescheduleDeadlineDays: m.rules.rescheduleDeadlineDays,
          requireBriefing: m.rules.requireBriefing,
          extraRules: m.rules.extraRules,
        }
      : null,
    trails: m.trails.map((t) => ({
      id: t.id,
      name: t.name,
      distanceKm: num(t.distanceKm),
      estimatedHours: num(t.estimatedHours),
      difficulty: t.difficulty,
      price: t.price,
      priceForeign: t.priceForeign,
      queueEnabled: t.queueEnabled,
    })),
  };
}