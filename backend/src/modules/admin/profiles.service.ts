import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import type { ListProfilesInput, VerifyProfileInput } from './profiles.schema';

export async function getProfiles(input: ListProfilesInput) {
  const { page, limit, status, search } = input;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) {
    where.verifiedStatus = status;
  }
  if (search) {
    where.OR = [
      { nik: { contains: search, mode: 'insensitive' } },
      { user: { fullName: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [total, profiles] = await Promise.all([
    prisma.climberProfile.count({ where }),
    prisma.climberProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    }),
  ]);

  return {
    items: profiles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProfileById(profileId: string) {
  const profile = await prisma.climberProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      },
      verifiedBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(404, 'Profil pendaki tidak ditemukan', 'NOT_FOUND');
  }

  return profile;
}

export async function verifyProfile(
  adminId: string,
  profileId: string,
  input: VerifyProfileInput,
) {
  const profile = await prisma.climberProfile.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    throw new AppError(404, 'Profil pendaki tidak ditemukan', 'NOT_FOUND');
  }

  const updated = await prisma.climberProfile.update({
    where: { id: profileId },
    data: {
      verifiedStatus: input.decision,
      rejectionReason: input.decision === 'rejected' ? input.rejectionReason : null,
      verifiedById: adminId,
      verifiedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'verify_profile',
      targetType: 'climber_profile',
      targetId: profileId,
      detail: {
        decision: input.decision,
        rejectionReason: input.rejectionReason ?? null,
        targetUserId: profile.userId,
      },
    },
  });

  return updated;
}
