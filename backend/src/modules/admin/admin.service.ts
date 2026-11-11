import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import type {
  ListAuditLogsInput,
  ListBookingsAdminInput,
  ListUsersInput,
  ProcessRefundInput,
  RevenueReportQueryInput,
} from './admin.schema';

export async function listAllBookings(input: ListBookingsAdminInput) {
  const { page, limit, status, mountainId, trailId, climbDateFrom, climbDateTo, search } = input;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (trailId) where.trailId = trailId;
  if (mountainId) where.trail = { mountainId };

  if (climbDateFrom || climbDateTo) {
    where.climbDate = {};
    if (climbDateFrom) where.climbDate.gte = new Date(climbDateFrom);
    if (climbDateTo) where.climbDate.lte = new Date(climbDateTo);
  }

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
        leader: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        trail: {
          select: {
            id: true,
            name: true,
            mountain: { select: { id: true, name: true } },
          },
        },
        payments: {
          select: { id: true, grossAmount: true, status: true, paidAt: true },
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

export async function listRefundRequests(page = 1, limit = 20, status?: 'requested' | 'refunded' | 'rejected') {
  const skip = (page - 1) * limit;
  const where: any = {};
  if (status) where.status = status;

  const [total, items] = await Promise.all([
    prisma.refundRequest.count({ where }),
    prisma.refundRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          include: {
            leader: { select: { id: true, fullName: true, email: true, phone: true } },
            trail: {
              select: {
                id: true,
                name: true,
                mountain: { select: { id: true, name: true } },
              },
            },
            payments: {
              select: { grossAmount: true, status: true, midtransOrderId: true },
            },
          },
        },
        processedBy: { select: { id: true, fullName: true } },
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

export async function processRefundRequest(
  adminId: string,
  refundId: string,
  input: ProcessRefundInput,
) {
  const refund = await prisma.refundRequest.findUnique({
    where: { id: refundId },
    include: { booking: true },
  });

  if (!refund) {
    throw new AppError(404, 'Pengajuan refund tidak ditemukan', 'NOT_FOUND');
  }

  if (refund.status !== 'requested') {
    throw new AppError(400, 'Pengajuan refund sudah diproses sebelumnya', 'ALREADY_PROCESSED');
  }

  const isApproved = input.action === 'approve';
  const newStatus = isApproved ? 'refunded' : 'rejected';
  const newBookingStatus = isApproved ? 'refunded' : 'paid';

  const [updatedRefund] = await prisma.$transaction([
    prisma.refundRequest.update({
      where: { id: refundId },
      data: {
        status: newStatus,
        processedById: adminId,
        processedAt: new Date(),
      },
    }),
    prisma.booking.update({
      where: { id: refund.bookingId },
      data: {
        status: newBookingStatus,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: isApproved ? 'approve_refund' : 'reject_refund',
        targetType: 'refund_request',
        targetId: refundId,
        detail: {
          bookingId: refund.bookingId,
          amount: refund.amount,
          note: input.note ?? null,
        },
      },
    }),
  ]);

  return updatedRefund;
}

export async function getGlobalRevenueReport(query: RevenueReportQueryInput) {
  const { dateFrom, dateTo, mountainId } = query;

  const wherePayment: any = {
    status: 'settlement',
  };

  if (dateFrom || dateTo) {
    wherePayment.paidAt = {};
    if (dateFrom) wherePayment.paidAt.gte = new Date(dateFrom);
    if (dateTo) wherePayment.paidAt.lte = new Date(dateTo);
  }

  if (mountainId) {
    wherePayment.booking = {
      trail: { mountainId },
    };
  }

  const payments = await prisma.payment.findMany({
    where: wherePayment,
    select: {
      id: true,
      grossAmount: true,
      paidAt: true,
      booking: {
        select: {
          id: true,
          bookingCode: true,
          memberCount: true,
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
  const totalTransactions = payments.length;

  // Breakdown per gunung
  const byMountain: Record<string, { mountainName: string; totalRevenue: number; totalBookings: number }> = {};
  for (const p of payments) {
    const mName = p.booking.trail.mountain.name;
    const mId = p.booking.trail.mountain.id;
    if (!byMountain[mId]) {
      byMountain[mId] = { mountainName: mName, totalRevenue: 0, totalBookings: 0 };
    }
    byMountain[mId].totalRevenue += p.grossAmount;
    byMountain[mId].totalBookings += 1;
  }

  return {
    totalRevenue,
    totalTransactions,
    breakdownByMountain: Object.values(byMountain),
  };
}

export async function listAuditLogs(input: ListAuditLogsInput) {
  const { page, limit, action, targetType, actorId } = input;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (action) where.action = action;
  if (targetType) where.targetType = targetType;
  if (actorId) where.actorId = actorId;

  const [total, items] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, fullName: true, email: true, role: true } },
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

export async function listAllUsers(input: ListUsersInput) {
  const { page, limit, role, search } = input;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
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
        role: true,
        isActive: true,
        organizerStatus: true,
        organizationName: true,
        createdAt: true,
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

export async function toggleUserActive(adminId: string, userId: string, isActive: boolean) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'Pengguna tidak ditemukan', 'NOT_FOUND');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: { id: true, fullName: true, email: true, isActive: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: isActive ? 'activate_user' : 'deactivate_user',
      targetType: 'user',
      targetId: userId,
    },
  });

  return updated;
}
