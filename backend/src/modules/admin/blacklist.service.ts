import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import type { CreateBlacklistInput, ListBlacklistInput, UpdateBlacklistInput } from './blacklist.schema';

export async function listBlacklists(input: ListBlacklistInput) {
  const { page, limit, search, activeOnly } = input;
  const skip = (page - 1) * limit;

  const now = new Date();
  const where: any = {};

  if (search) {
    where.OR = [
      { nik: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
      { reason: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (activeOnly) {
    where.startDate = { lte: now };
    where.OR = [
      ...(where.OR ? [{ OR: where.OR }] : []),
      { endDate: null },
      { endDate: { gte: now } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.blacklist.count({ where }),
    prisma.blacklist.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
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

export async function addBlacklist(adminId: string, input: CreateBlacklistInput) {
  const created = await prisma.blacklist.create({
    data: {
      nik: input.nik,
      fullName: input.fullName,
      reason: input.reason,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      createdById: adminId,
    },
    include: {
      createdBy: {
        select: { id: true, fullName: true },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'create_blacklist',
      targetType: 'blacklist',
      targetId: created.id,
      detail: { nik: input.nik, fullName: input.fullName, reason: input.reason },
    },
  });

  return created;
}

export async function updateBlacklist(adminId: string, id: string, input: UpdateBlacklistInput) {
  const existing = await prisma.blacklist.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Data blacklist tidak ditemukan', 'NOT_FOUND');
  }

  const updated = await prisma.blacklist.update({
    where: { id },
    data: {
      fullName: input.fullName,
      reason: input.reason,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate !== undefined ? (input.endDate ? new Date(input.endDate) : null) : undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'update_blacklist',
      targetType: 'blacklist',
      targetId: id,
      detail: input,
    },
  });

  return updated;
}

export async function removeBlacklist(adminId: string, id: string) {
  const existing = await prisma.blacklist.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Data blacklist tidak ditemukan', 'NOT_FOUND');
  }

  await prisma.blacklist.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'delete_blacklist',
      targetType: 'blacklist',
      targetId: id,
      detail: { nik: existing.nik, fullName: existing.fullName },
    },
  });

  return { success: true };
}
