import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import type {
  ApproveOrganizerInput,
  CreateMountainInput,
  ListOrganizersInput,
  SetMountainRulesInput,
  UpdateMountainInput,
} from './organizers.schema';

export async function listOrganizers(input: ListOrganizersInput) {
  const { page, limit, status, search } = input;
  const skip = (page - 1) * limit;

  const where: any = { role: 'organizer' };
  if (status) {
    where.organizerStatus = status;
  }
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { organizationName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        organizationName: true,
        organizerStatus: true,
        isActive: true,
        createdAt: true,
        organizerOf: {
          select: {
            mountain: {
              select: { id: true, name: true, slug: true },
            },
          },
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

export async function approveOrganizer(
  adminId: string,
  organizerId: string,
  input: ApproveOrganizerInput,
) {
  const user = await prisma.user.findUnique({
    where: { id: organizerId },
  });

  if (!user || user.role !== 'organizer') {
    throw new AppError(404, 'Pengelola (organizer) tidak ditemukan', 'NOT_FOUND');
  }

  const newStatus = input.action === 'approve' ? 'approved' : 'blocked';

  const updated = await prisma.user.update({
    where: { id: organizerId },
    data: {
      organizerStatus: newStatus,
      isActive: input.action === 'approve',
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      organizationName: true,
      organizerStatus: true,
      isActive: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: input.action === 'approve' ? 'approve_organizer' : 'block_organizer',
      targetType: 'user',
      targetId: organizerId,
      detail: { status: newStatus },
    },
  });

  return updated;
}

export async function assignOrganizerToMountain(
  adminId: string,
  mountainId: string,
  organizerId: string,
) {
  const [mountain, organizer] = await Promise.all([
    prisma.mountain.findUnique({ where: { id: mountainId } }),
    prisma.user.findUnique({ where: { id: organizerId } }),
  ]);

  if (!mountain) throw new AppError(404, 'Gunung tidak ditemukan', 'NOT_FOUND');
  if (!organizer || organizer.role !== 'organizer') {
    throw new AppError(404, 'Pengelola tidak ditemukan', 'NOT_FOUND');
  }
  if (organizer.organizerStatus !== 'approved') {
    throw new AppError(400, 'Pengelola belum disetujui oleh admin', 'ORGANIZER_NOT_APPROVED');
  }

  const assignment = await prisma.mountainOrganizer.upsert({
    where: {
      mountainId_organizerId: {
        mountainId,
        organizerId,
      },
    },
    update: {
      assignedById: adminId,
    },
    create: {
      mountainId,
      organizerId,
      assignedById: adminId,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'assign_organizer_mountain',
      targetType: 'mountain',
      targetId: mountainId,
      detail: { organizerId },
    },
  });

  return assignment;
}

export async function removeOrganizerFromMountain(
  adminId: string,
  mountainId: string,
  organizerId: string,
) {
  const existing = await prisma.mountainOrganizer.findUnique({
    where: {
      mountainId_organizerId: { mountainId, organizerId },
    },
  });

  if (!existing) {
    throw new AppError(404, 'Pengelola tidak terdaftar pada gunung ini', 'NOT_FOUND');
  }

  await prisma.mountainOrganizer.delete({
    where: {
      mountainId_organizerId: { mountainId, organizerId },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'remove_organizer_mountain',
      targetType: 'mountain',
      targetId: mountainId,
      detail: { organizerId },
    },
  });

  return { success: true };
}

export async function createMountain(adminId: string, input: CreateMountainInput) {
  const existingSlug = await prisma.mountain.findUnique({
    where: { slug: input.slug },
  });
  if (existingSlug) {
    throw new AppError(409, 'Slug gunung sudah digunakan', 'SLUG_EXISTS');
  }

  const mountain = await prisma.mountain.create({
    data: {
      ...input,
      rules: {
        create: {
          minGroup: 1,
          maxGroup: 10,
          holdMinutes: 30,
          maxDurationDays: 3,
        },
      },
    },
    include: {
      rules: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'create_mountain',
      targetType: 'mountain',
      targetId: mountain.id,
      detail: { name: input.name, slug: input.slug },
    },
  });

  return mountain;
}

export async function updateMountain(adminId: string, id: string, input: UpdateMountainInput) {
  const existing = await prisma.mountain.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Gunung tidak ditemukan', 'NOT_FOUND');
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await prisma.mountain.findUnique({ where: { slug: input.slug } });
    if (slugTaken) {
      throw new AppError(409, 'Slug gunung sudah digunakan', 'SLUG_EXISTS');
    }
  }

  const updated = await prisma.mountain.update({
    where: { id },
    data: input,
    include: { rules: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'update_mountain',
      targetType: 'mountain',
      targetId: id,
      detail: input,
    },
  });

  return updated;
}

export async function setMountainRules(
  adminId: string,
  mountainId: string,
  input: SetMountainRulesInput,
) {
  const mountain = await prisma.mountain.findUnique({ where: { id: mountainId } });
  if (!mountain) {
    throw new AppError(404, 'Gunung tidak ditemukan', 'NOT_FOUND');
  }

  const rules = await prisma.mountainRule.upsert({
    where: { mountainId },
    update: input,
    create: {
      mountainId,
      ...input,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'set_mountain_rules',
      targetType: 'mountain',
      targetId: mountainId,
      detail: input,
    },
  });

  return rules;
}
