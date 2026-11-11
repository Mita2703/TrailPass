import type { Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { verifyQrToken } from '../../lib/qr';
import { AppError } from '../../middleware/errors';
import type {
  CheckInInput,
  CheckOutInput,
  MarkMemberInput,
  ResolveQrInput,
  SearchQuery,
} from './scanner.schema';

function todayIn(timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
  } catch {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  }
}

function maskNik(nik: string): string {
  if (nik.length < 8) return nik;
  return `${nik.slice(0, 4)}••••••••${nik.slice(-4)}`;
}

/**
 * Memastikan pengguna memiliki wewenang untuk gunung yang ditentukan.
 * - admin: memiliki akses ke seluruh gunung
 * - organizer: wajib terdaftar di mountain_organizers
 * - officer: wajib terdaftar di officer_assignments
 */
export async function assertMountainAccess(userId: string, role: Role, mountainId: string): Promise<boolean> {
  if (role === 'admin') return true;

  if (role === 'organizer') {
    const isAssigned = await prisma.mountainOrganizer.findUnique({
      where: { mountainId_organizerId: { mountainId, organizerId: userId } },
    });
    if (!isAssigned) {
      throw new AppError(403, 'Anda tidak memiliki hak akses untuk mengelola gunung ini', 'FORBIDDEN');
    }
    return true;
  }

  if (role === 'officer') {
    const isAssigned = await prisma.officerAssignment.findUnique({
      where: { officerId_mountainId: { officerId: userId, mountainId } },
    });
    if (!isAssigned) {
      throw new AppError(403, 'Petugas tidak ditugaskan pada kawasan gunung ini', 'FORBIDDEN');
    }
    return true;
  }

  throw new AppError(403, 'Peran Anda tidak diizinkan mengakses scanner pos', 'FORBIDDEN');
}

/**
 * Mendapatkan daftar ID gunung yang ditugaskan kepada pengguna.
 * null menandakan seluruh gunung (khusus admin).
 */
export async function getAssignedMountainIds(userId: string, role: Role): Promise<string[] | null> {
  if (role === 'admin') return null;

  if (role === 'organizer') {
    const list = await prisma.mountainOrganizer.findMany({
      where: { organizerId: userId },
      select: { mountainId: true },
    });
    return list.map((a) => a.mountainId);
  }

  if (role === 'officer') {
    const list = await prisma.officerAssignment.findMany({
      where: { officerId: userId },
      select: { mountainId: true },
    });
    return list.map((a) => a.mountainId);
  }

  return [];
}

/**
 * Resolusi QR Token atau Kode Booking untuk validasi di pos basecamp.
 */
export async function resolveBooking(userId: string, userRole: Role, input: ResolveQrInput) {
  let bookingId: string | null = null;
  let bookingCode: string | null = null;

  if (input.qrToken) {
    const payload = verifyQrToken(input.qrToken);
    if (payload) {
      bookingId = payload.bookingId;
      bookingCode = payload.bookingCode;
    }
  }

  if (!bookingId && input.bookingCode) {
    bookingCode = input.bookingCode.trim().toUpperCase();
  }

  const whereClause = bookingId
    ? { id: bookingId }
    : bookingCode
      ? { bookingCode }
      : input.qrToken
        ? { qrToken: input.qrToken }
        : null;

  if (!whereClause) {
    throw new AppError(400, 'QR Token tidak valid atau format salah', 'INVALID_QR_TOKEN');
  }

  const booking = await prisma.booking.findFirst({
    where: whereClause,
    include: {
      leader: {
        select: {
          fullName: true,
          email: true,
          phone: true,
          profile: { select: { nik: true, emergencyContactName: true, emergencyContactPhone: true } },
        },
      },
      trail: {
        include: {
          mountain: {
            select: { id: true, name: true, slug: true, timezone: true },
          },
          checkpoints: {
            select: { id: true, name: true, orderNo: true, isSummit: true },
            orderBy: { orderNo: 'asc' },
          },
        },
      },
      members: {
        orderBy: { fullName: 'asc' },
      },
    },
  });

  if (!booking) {
    throw new AppError(404, 'Data booking pendakian tidak ditemukan', 'NOT_FOUND');
  }

  // Periksa hak akses petugas/organizer terhadap gunung ini
  await assertMountainAccess(userId, userRole, booking.trail.mountain.id);

  // Periksa status booking
  if (booking.status !== 'paid' && booking.status !== 'completed') {
    throw new AppError(400, `Tiket tidak dapat diproses (Status: ${booking.status})`, 'BOOKING_NOT_ACTIVE');
  }

  // Cek kesesuaian tanggal pendakian menurut zona waktu gunung
  const mountainTz = booking.trail.mountain.timezone;
  const today = todayIn(mountainTz);
  const climbDateStr = booking.climbDate.toISOString().slice(0, 10);
  const isDateMatch = climbDateStr === today;

  // Cek status peringatan jalur (advisory) saat ini
  const now = new Date();
  const advisory = await prisma.trailAdvisory.findFirst({
    where: {
      trailId: booking.trailId,
      validFrom: { lte: now },
      OR: [{ validUntil: null }, { validUntil: { gte: now } }],
    },
    orderBy: { validFrom: 'desc' },
    include: {
      maxCheckpoint: { select: { id: true, name: true, orderNo: true } },
    },
  });

  const advisoryData = advisory
    ? {
        status: advisory.status,
        severity: advisory.severity,
        reason: advisory.reason,
        message: advisory.message,
        maxCheckpoint: advisory.maxCheckpoint,
      }
    : {
        status: 'open' as const,
        severity: 'info' as const,
        reason: null,
        message: null,
        maxCheckpoint: null,
      };

  return {
    booking: {
      id: booking.id,
      bookingCode: booking.bookingCode,
      status: booking.status,
      climbDate: climbDateStr,
      todayInMountain: today,
      isDateMatch,
      mountain: booking.trail.mountain,
      trail: {
        id: booking.trail.id,
        name: booking.trail.name,
      },
      advisory: advisoryData,
      leader: {
        fullName: booking.leader.fullName,
        email: booking.leader.email,
        phone: booking.leader.phone,
        emergencyContactName: booking.leader.profile?.emergencyContactName ?? null,
        emergencyContactPhone: booking.leader.profile?.emergencyContactPhone ?? null,
      },
      members: booking.members.map((m) => ({
        id: m.id,
        fullName: m.fullName,
        nikMasked: maskNik(m.nik),
        birthDate: m.birthDate.toISOString().slice(0, 10),
        gender: m.gender,
        status: m.status,
        checkinAt: m.checkinAt,
        checkoutAt: m.checkoutAt,
        checkoutNote: m.checkoutNote,
        isForeign: m.isForeign,
      })),
    },
  };
}

/**
 * Scan Masuk (Check-In) untuk anggota rombongan yang hadir.
 */
export async function checkInMembers(
  userId: string,
  userRole: Role,
  input: CheckInInput,
  ipAddress?: string,
) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: {
      trail: { include: { mountain: true } },
      members: true,
    },
  });

  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');

  // Periksa wewenang petugas pada gunung ini
  await assertMountainAccess(userId, userRole, booking.trail.mountainId);

  // Periksa status booking
  if (booking.status !== 'paid' && booking.status !== 'completed') {
    throw new AppError(400, 'Tiket belum lunas atau tidak aktif', 'BOOKING_NOT_ACTIVE');
  }

  // Periksa tanggal pendakian
  const today = todayIn(booking.trail.mountain.timezone);
  const climbDateStr = booking.climbDate.toISOString().slice(0, 10);
  if (climbDateStr !== today) {
    throw new AppError(400, `Tanggal tiket (${climbDateStr}) tidak sesuai dengan hari ini (${today})`, 'DATE_MISMATCH');
  }

  // Periksa apakah jalur sedang berstatus ditutup (closed)
  const now = new Date();
  const advisory = await prisma.trailAdvisory.findFirst({
    where: {
      trailId: booking.trailId,
      validFrom: { lte: now },
      OR: [{ validUntil: null }, { validUntil: { gte: now } }],
    },
    orderBy: { validFrom: 'desc' },
  });

  if (advisory?.status === 'closed') {
    throw new AppError(400, 'Jalur pendakian sedang ditutup. Tidak dapat melakukan check-in', 'TRAIL_CLOSED');
  }

  // Validasi ID anggota
  const memberMap = new Map(booking.members.map((m) => [m.id, m]));
  for (const memberId of input.memberIds) {
    const m = memberMap.get(memberId);
    if (!m) {
      throw new AppError(404, `Anggota dengan ID ${memberId} tidak ditemukan pada rombongan ini`, 'MEMBER_NOT_FOUND');
    }
    if (m.status === 'climbing') {
      throw new AppError(409, `Anggota "${m.fullName}" sudah tercatat masuk sebelumnya`, 'ALREADY_CHECKED_IN');
    }
    if (m.status === 'exited') {
      throw new AppError(409, `Anggota "${m.fullName}" sudah selesai mendaki`, 'ALREADY_EXITED');
    }
    if (m.status !== 'not_entered') {
      throw new AppError(409, `Status anggota "${m.fullName}" (${m.status}) tidak valid untuk check-in`, 'INVALID_STATUS');
    }
  }

  // Eksekusi transaksi database
  const result = await prisma.$transaction(async (tx) => {
    // 1. Update status anggota menjadi climbing
    await tx.bookingMember.updateMany({
      where: { id: { in: input.memberIds } },
      data: {
        status: 'climbing',
        checkinAt: now,
        checkinById: userId,
      },
    });

    // 2. Catat riwayat scan ke gate_scans
    const gateScan = await tx.gateScan.create({
      data: {
        bookingId: booking.id,
        trailId: input.trailId,
        scanType: 'IN',
        scanMethod: input.method,
        scannedById: userId,
        note: input.note ?? null,
      },
    });

    // 3. Catat anggota yang diproses ke gate_scan_members
    await tx.gateScanMember.createMany({
      data: input.memberIds.map((memberId) => ({
        scanId: gateScan.id,
        memberId,
      })),
    });

    // 4. Catat audit jika metode manual
    if (input.method === 'manual') {
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'scan.manual_checkin',
          targetType: 'booking',
          targetId: booking.id,
          ipAddress: ipAddress ?? null,
          detail: {
            trailId: input.trailId,
            memberIds: input.memberIds,
            note: input.note,
          },
        },
      });
    }

    return { scanId: gateScan.id, checkedInCount: input.memberIds.length };
  });

  return {
    success: true,
    message: `Berhasil check-in untuk ${result.checkedInCount} anggota`,
    scanId: result.scanId,
  };
}

/**
 * Scan Keluar (Check-Out) untuk anggota rombongan yang turun.
 * Mendukung rombongan turun terpisah dan pendakian lintas jalur (exit trail pada gunung yang sama).
 */
export async function checkOutMembers(
  userId: string,
  userRole: Role,
  input: CheckOutInput,
  ipAddress?: string,
) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: {
      trail: { include: { mountain: true } },
      members: true,
    },
  });

  if (!booking) throw new AppError(404, 'Booking tidak ditemukan', 'NOT_FOUND');

  // Validasi jalur keluar (harus pada gunung yang sama)
  const exitTrail = await prisma.trail.findUnique({
    where: { id: input.trailId },
    select: { id: true, mountainId: true, name: true },
  });

  if (!exitTrail) throw new AppError(404, 'Jalur keluar tidak ditemukan', 'NOT_FOUND');
  if (exitTrail.mountainId !== booking.trail.mountainId) {
    throw new AppError(400, 'Jalur keluar harus berada pada gunung yang sama (lintas jalur)', 'CROSS_MOUNTAIN_NOT_ALLOWED');
  }

  // Periksa wewenang petugas pada gunung ini
  await assertMountainAccess(userId, userRole, booking.trail.mountainId);

  // Validasi ID anggota
  const memberMap = new Map(booking.members.map((m) => [m.id, m]));
  for (const memberId of input.memberIds) {
    const m = memberMap.get(memberId);
    if (!m) {
      throw new AppError(404, `Anggota dengan ID ${memberId} tidak ditemukan pada rombongan ini`, 'MEMBER_NOT_FOUND');
    }
    if (m.status === 'not_entered') {
      throw new AppError(400, `Anggota "${m.fullName}" belum tercatat masuk (check-in)`, 'NOT_CHECKED_IN');
    }
    if (m.status === 'exited') {
      throw new AppError(409, `Anggota "${m.fullName}" sudah pernah tercatat keluar sebelumnya`, 'ALREADY_EXITED');
    }
    if (m.status !== 'climbing') {
      throw new AppError(409, `Status anggota "${m.fullName}" (${m.status}) tidak valid untuk check-out`, 'INVALID_STATUS');
    }
  }

  const now = new Date();

  // Eksekusi transaksi database
  const result = await prisma.$transaction(async (tx) => {
    // 1. Update status anggota menjadi exited
    await tx.bookingMember.updateMany({
      where: { id: { in: input.memberIds } },
      data: {
        status: 'exited',
        checkoutAt: now,
        checkoutById: userId,
        checkoutNote: input.note ?? null,
      },
    });

    // 2. Catat riwayat scan ke gate_scans
    const gateScan = await tx.gateScan.create({
      data: {
        bookingId: booking.id,
        trailId: input.trailId,
        scanType: 'OUT',
        scanMethod: input.method,
        scannedById: userId,
        note: input.note ?? null,
      },
    });

    // 3. Catat anggota ke gate_scan_members
    await tx.gateScanMember.createMany({
      data: input.memberIds.map((memberId) => ({
        scanId: gateScan.id,
        memberId,
      })),
    });

    // 4. Periksa apakah seluruh anggota kini telah berstatus final
    const allMembers = await tx.bookingMember.findMany({
      where: { bookingId: booking.id },
      select: { status: true },
    });

    const finalStatuses = new Set(['exited', 'manual_exit', 'cancelled', 'no_show']);
    const isCompleted = allMembers.every((m) => finalStatuses.has(m.status));

    if (isCompleted && booking.status !== 'completed') {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: 'completed' },
      });
    }

    // 5. Catat audit jika metode manual
    if (input.method === 'manual') {
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: 'scan.manual_checkout',
          targetType: 'booking',
          targetId: booking.id,
          ipAddress: ipAddress ?? null,
          detail: {
            exitTrailId: input.trailId,
            memberIds: input.memberIds,
            note: input.note,
          },
        },
      });
    }

    return {
      scanId: gateScan.id,
      checkedOutCount: input.memberIds.length,
      isBookingCompleted: isCompleted,
    };
  });

  return {
    success: true,
    message: `Berhasil check-out untuk ${result.checkedOutCount} anggota`,
    scanId: result.scanId,
    isBookingCompleted: result.isBookingCompleted,
  };
}

/**
 * Menandai status khusus anggota (misal evakuasi/manual_exit atau batal/cancelled).
 */
export async function markMemberStatus(
  userId: string,
  userRole: Role,
  memberId: string,
  input: MarkMemberInput,
  ipAddress?: string,
) {
  const member = await prisma.bookingMember.findUnique({
    where: { id: memberId },
    include: {
      booking: {
        include: { trail: { include: { mountain: true } } },
      },
    },
  });

  if (!member) throw new AppError(404, 'Data anggota tidak ditemukan', 'NOT_FOUND');

  // Periksa wewenang pengguna pada kawasan gunung ini
  await assertMountainAccess(userId, userRole, member.booking.trail.mountainId);

  if (input.status === 'cancelled') {
    if (member.status !== 'not_entered') {
      throw new AppError(400, 'Hanya anggota yang belum masuk jalur yang dapat dibatalkan', 'INVALID_OPERATION');
    }
  } else if (input.status === 'manual_exit') {
    if (member.status !== 'climbing') {
      throw new AppError(400, 'Hanya anggota yang sedang mendaki yang dapat ditandai evakuasi / manual exit', 'INVALID_OPERATION');
    }
  }

  const now = new Date();

  const updated = await prisma.$transaction(async (tx) => {
    const updatedMember = await tx.bookingMember.update({
      where: { id: member.id },
      data: {
        status: input.status,
        checkoutAt: now,
        checkoutById: userId,
        checkoutNote: input.reason,
      },
    });

    // Cek apakah seluruh anggota sudah berstatus akhir
    const allMembers = await tx.bookingMember.findMany({
      where: { bookingId: member.bookingId },
      select: { status: true },
    });

    const finalStatuses = new Set(['exited', 'manual_exit', 'cancelled', 'no_show']);
    if (allMembers.every((m) => finalStatuses.has(m.status))) {
      await tx.booking.update({
        where: { id: member.bookingId },
        data: { status: 'completed' },
      });
    }

    // Catat ke audit log
    await tx.auditLog.create({
      data: {
        actorId: userId,
        action: 'member.marked_status',
        targetType: 'booking_member',
        targetId: member.id,
        ipAddress: ipAddress ?? null,
        detail: {
          previousStatus: member.status,
          newStatus: input.status,
          reason: input.reason,
        },
      },
    });

    return updatedMember;
  });

  return {
    success: true,
    member: {
      id: updated.id,
      fullName: updated.fullName,
      status: updated.status,
      checkoutNote: updated.checkoutNote,
      checkoutAt: updated.checkoutAt,
    },
  };
}

/**
 * Pencarian booking manual oleh petugas pos saat gawai pendaki mati / kuota habis.
 */
export async function searchBookingsManual(
  userId: string,
  userRole: Role,
  query: SearchQuery,
  ipAddress?: string,
) {
  const assignedMountainIds = await getAssignedMountainIds(userId, userRole);
  if (assignedMountainIds !== null && assignedMountainIds.length === 0) {
    return { data: [] };
  }

  const keyword = query.q.trim();

  // Bangun filter pencarian
  const where: any = {
    status: { in: ['paid', 'completed'] },
    ...(assignedMountainIds ? { trail: { mountainId: { in: assignedMountainIds } } } : {}),
    OR: [
      { bookingCode: { contains: keyword, mode: 'insensitive' } },
      { leader: { fullName: { contains: keyword, mode: 'insensitive' } } },
      { leader: { phone: { contains: keyword } } },
      { leader: { profile: { nik: { contains: keyword } } } },
      { members: { some: { fullName: { contains: keyword, mode: 'insensitive' } } } },
      { members: { some: { nik: { contains: keyword } } } },
    ],
  };

  if (query.type === 'in') {
    where.members = {
      ...where.members,
      some: { status: 'not_entered' },
    };
  } else if (query.type === 'out') {
    where.members = {
      ...where.members,
      some: { status: 'climbing' },
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      leader: {
        select: {
          fullName: true,
          phone: true,
          profile: { select: { nik: true } },
        },
      },
      trail: {
        include: {
          mountain: { select: { id: true, name: true, timezone: true } },
        },
      },
      members: {
        select: {
          id: true,
          fullName: true,
          nik: true,
          status: true,
        },
      },
    },
    take: 20,
    orderBy: { climbDate: 'desc' },
  });

  // Untuk scan masuk (type: 'in'), filter tanggal pendakian harus hari ini menurut zona waktu gunung
  const filtered = query.type === 'in'
    ? bookings.filter((b) => {
        const today = todayIn(b.trail.mountain.timezone);
        const climbDateStr = b.climbDate.toISOString().slice(0, 10);
        return climbDateStr === today;
      })
    : bookings;

  // Catat pencarian manual ke audit log
  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: 'scanner.search',
      targetType: 'scanner',
      ipAddress: ipAddress ?? null,
      detail: { query: keyword, type: query.type, matchedCount: filtered.length },
    },
  });

  return {
    data: filtered.map((b) => ({
      id: b.id,
      bookingCode: b.bookingCode,
      climbDate: b.climbDate.toISOString().slice(0, 10),
      mountainName: b.trail.mountain.name,
      trailName: b.trail.name,
      leader: {
        fullName: b.leader.fullName,
        phone: b.leader.phone,
        nikMasked: b.leader.profile ? maskNik(b.leader.profile.nik) : null,
      },
      memberCount: b.memberCount,
      members: b.members.map((m) => ({
        id: m.id,
        fullName: m.fullName,
        nikMasked: maskNik(m.nik),
        status: m.status,
      })),
    })),
  };
}

/**
 * Mengambil daftar pendaki yang sedang berada di atas gunung (status climbing).
 */
export async function getClimbersInside(userId: string, userRole: Role, mountainId?: string) {
  if (mountainId) {
    await assertMountainAccess(userId, userRole, mountainId);
  }

  const assignedMountainIds = await getAssignedMountainIds(userId, userRole);
  if (assignedMountainIds !== null && assignedMountainIds.length === 0) {
    return { count: 0, climbers: [] };
  }

  const targetMountainIds = mountainId
    ? [mountainId]
    : assignedMountainIds;

  const members = await prisma.bookingMember.findMany({
    where: {
      status: 'climbing',
      booking: {
        trail: targetMountainIds ? { mountainId: { in: targetMountainIds } } : undefined,
      },
    },
    include: {
      booking: {
        select: {
          bookingCode: true,
          climbDate: true,
          leader: { select: { fullName: true, phone: true } },
          trail: {
            select: {
              name: true,
              mountain: { select: { id: true, name: true, timezone: true } },
            },
          },
        },
      },
      checkinBy: { select: { fullName: true } },
    },
    orderBy: { checkinAt: 'asc' },
  });

  return {
    count: members.length,
    climbers: members.map((m) => ({
      id: m.id,
      fullName: m.fullName,
      nikMasked: maskNik(m.nik),
      emergencyContact: m.emergencyContact,
      checkinAt: m.checkinAt,
      checkinBy: m.checkinBy?.fullName ?? null,
      bookingCode: m.booking.bookingCode,
      climbDate: m.booking.climbDate.toISOString().slice(0, 10),
      mountainName: m.booking.trail.mountain.name,
      entryTrailName: m.booking.trail.name,
      leader: m.booking.leader,
    })),
  };
}
