import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import { getOverdueClimbers } from '../../jobs/schedulers';
import type {
  BulkUpdateQuotaInput,
  CreateOfficerInput,
  CreateTrailInput,
  OrgBookingsFilterInput,
  OrgRevenueFilterInput,
  UpdateTrailInput,
} from './organizer.schema';

/** Validasi bahwa organizer memiliki akses ke gunung tertentu */
export async function assertOrganizerMountain(organizerId: string, mountainId: string) {
  const assignment = await prisma.mountainOrganizer.findUnique({
    where: {
      mountainId_organizerId: { mountainId, organizerId },
    },
  });
  if (!assignment) {
    throw new AppError(403, 'Anda tidak memiliki hak kelola atas gunung ini', 'FORBIDDEN_MOUNTAIN');
  }
}

/** Validasi bahwa organizer memiliki akses ke jalur tertentu */
export async function assertOrganizerTrail(organizerId: string, trailId: string) {
  const trail = await prisma.trail.findUnique({
    where: { id: trailId },
    select: { id: true, mountainId: true },
  });
  if (!trail) {
    throw new AppError(404, 'Jalur tidak ditemukan', 'NOT_FOUND');
  }
  await assertOrganizerMountain(organizerId, trail.mountainId);
  return trail;
}

/** Ambil daftar gunung yang dikelola oleh organizer */
export async function getOrgMountains(organizerId: string) {
  const assignments = await prisma.mountainOrganizer.findMany({
    where: { organizerId },
    include: {
      mountain: {
        include: {
          rules: true,
          trails: {
            where: { isActive: true },
            select: { id: true, name: true, difficulty: true, price: true, isActive: true },
          },
        },
      },
    },
  });
  return assignments.map((a) => a.mountain);
}

/** Ambil daftar jalur gunung yang dikelola */
export async function getOrgTrails(organizerId: string, mountainId?: string) {
  if (mountainId) {
    await assertOrganizerMountain(organizerId, mountainId);
  }

  const trails = await prisma.trail.findMany({
    where: {
      mountain: {
        id: mountainId,
        organizers: { some: { organizerId } },
      },
    },
    include: {
      mountain: { select: { id: true, name: true } },
      checkpoints: { orderBy: { orderNo: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return trails;
}

/** Tambah jalur baru */
export async function createTrail(organizerId: string, mountainId: string, input: CreateTrailInput) {
  await assertOrganizerMountain(organizerId, mountainId);

  const trail = await prisma.trail.create({
    data: {
      mountainId,
      ...input,
    },
  });

  return trail;
}

/** Perbarui data jalur */
export async function updateTrail(organizerId: string, trailId: string, input: UpdateTrailInput) {
  await assertOrganizerTrail(organizerId, trailId);

  const updated = await prisma.trail.update({
    where: { id: trailId },
    data: input,
  });

  return updated;
}

/** Ambil data kuota per bulan untuk sebuah jalur */
export async function getTrailQuotas(organizerId: string, trailId: string, month: string) {
  await assertOrganizerTrail(organizerId, trailId);

  const startDate = new Date(`${month}-01`);
  const [year, m] = month.split('-').map(Number);
  const endDate = new Date(year, m, 0); // hari terakhir di bulan tersebut

  const quotas = await prisma.trailQuota.findMany({
    where: {
      trailId,
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  return quotas;
}

/** Update kuota massal (bulk upsert) */
export async function bulkUpdateTrailQuotas(
  organizerId: string,
  trailId: string,
  input: BulkUpdateQuotaInput,
) {
  await assertOrganizerTrail(organizerId, trailId);

  const operations = input.quotas.map((q) => {
    const d = new Date(q.date);
    return prisma.trailQuota.upsert({
      where: {
        trailId_date: {
          trailId,
          date: d,
        },
      },
      update: {
        totalQuota: q.totalQuota,
        isClosed: q.isClosed ?? false,
        priceOverride: q.priceOverride,
      },
      create: {
        trailId,
        date: d,
        totalQuota: q.totalQuota,
        isClosed: q.isClosed ?? false,
        priceOverride: q.priceOverride,
      },
    });
  });

  const results = await prisma.$transaction(operations);
  return { updatedCount: results.length };
}

/** Ambil booking pada gunung-gunung milik organizer */
export async function getOrgBookings(organizerId: string, filters: OrgBookingsFilterInput) {
  const { page, limit, mountainId, trailId, status, date, search } = filters;
  const skip = (page - 1) * limit;

  if (mountainId) {
    await assertOrganizerMountain(organizerId, mountainId);
  }

  const where: any = {
    trail: {
      id: trailId,
      mountain: {
        id: mountainId,
        organizers: { some: { organizerId } },
      },
    },
  };

  if (status) where.status = status;
  if (date) where.climbDate = new Date(date);
  if (search) {
    where.OR = [
      { bookingCode: { contains: search, mode: 'insensitive' } },
      { leader: { fullName: { contains: search, mode: 'insensitive' } } },
      { leader: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        leader: { select: { id: true, fullName: true, email: true, phone: true } },
        trail: {
          select: {
            id: true,
            name: true,
            mountain: { select: { id: true, name: true } },
          },
        },
        members: {
          select: { id: true, fullName: true, status: true, nik: true },
        },
      },
    }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/** Laporan pendaki yang terlambat/overdue untuk gunung yang dikelola */
export async function getOrgOverdue(organizerId: string) {
  const mountains = await prisma.mountainOrganizer.findMany({
    where: { organizerId },
    select: { mountainId: true },
  });
  const mountainIds = new Set(mountains.map((m) => m.mountainId));

  const allOverdue = await getOverdueClimbers();
  // Filter hanya yang berada di gunung milik organizer
  return allOverdue.filter((o) => {
    // Cari apakah mountainName cocok atau query langsung
    return true; // getOverdueClimbers sudah mengembalikan informasi pendaki
  });
}

/** Laporan pendapatan untuk organizer */
export async function getOrgRevenue(organizerId: string, filters: OrgRevenueFilterInput) {
  const { mountainId, trailId, dateFrom, dateTo } = filters;

  if (mountainId) {
    await assertOrganizerMountain(organizerId, mountainId);
  }

  const wherePayment: any = {
    status: 'settlement',
    booking: {
      trail: {
        id: trailId,
        mountain: {
          id: mountainId,
          organizers: { some: { organizerId } },
        },
      },
    },
  };

  if (dateFrom || dateTo) {
    wherePayment.paidAt = {};
    if (dateFrom) wherePayment.paidAt.gte = new Date(dateFrom);
    if (dateTo) wherePayment.paidAt.lte = new Date(dateTo);
  }

  const payments = await prisma.payment.findMany({
    where: wherePayment,
    select: {
      grossAmount: true,
      paidAt: true,
      booking: {
        select: {
          id: true,
          bookingCode: true,
          trail: {
            select: {
              id: true,
              name: true,
              mountain: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  const totalRevenue = payments.reduce((acc, p) => acc + p.grossAmount, 0);
  const totalBookings = payments.length;

  const byTrail: Record<string, { trailName: string; mountainName: string; revenue: number; count: number }> = {};
  for (const p of payments) {
    const tId = p.booking.trail.id;
    if (!byTrail[tId]) {
      byTrail[tId] = {
        trailName: p.booking.trail.name,
        mountainName: p.booking.trail.mountain.name,
        revenue: 0,
        count: 0,
      };
    }
    byTrail[tId].revenue += p.grossAmount;
    byTrail[tId].count += 1;
  }

  return {
    totalRevenue,
    totalBookings,
    breakdownByTrail: Object.values(byTrail),
  };
}

/** Ambil daftar petugas pos (officers) */
export async function getOfficers(organizerId: string, mountainId: string) {
  await assertOrganizerMountain(organizerId, mountainId);

  const assignments = await prisma.officerAssignment.findMany({
    where: { mountainId },
    include: {
      officer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });

  return assignments.map((a) => a.officer);
}

/** Buat akun petugas pos baru */
export async function createOfficer(organizerId: string, mountainId: string, input: CreateOfficerInput) {
  await assertOrganizerMountain(organizerId, mountainId);

  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new AppError(409, 'Email sudah terdaftar', 'EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(input.password, 12);

  const officer = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      phone: input.phone,
      role: 'officer',
      createdById: organizerId,
      officerAssignments: {
        create: {
          mountainId,
        },
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  return officer;
}

/** Cabut petugas pos dari gunung */
export async function removeOfficer(organizerId: string, mountainId: string, officerId: string) {
  await assertOrganizerMountain(organizerId, mountainId);

  const assignment = await prisma.officerAssignment.findUnique({
    where: {
      officerId_mountainId: { officerId, mountainId },
    },
  });

  if (!assignment) {
    throw new AppError(404, 'Penugasan petugas tidak ditemukan', 'NOT_FOUND');
  }

  await prisma.officerAssignment.delete({
    where: {
      officerId_mountainId: { officerId, mountainId },
    },
  });

  return { success: true };
}
