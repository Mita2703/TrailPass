import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errors';
import { signAccessToken } from '../../middleware/auth';
import type { LoginInput, RegisterInput } from './auth.schema';

const publicUser = (u: { id: string; email: string; fullName: string; role: string; phone: string | null }) => ({
  id: u.id,
  email: u.email,
  fullName: u.fullName,
  role: u.role,
  phone: u.phone,
});

export async function register(input: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new AppError(409, 'Email sudah terdaftar', 'EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(input.password, 12);
  // Pendaftaran publik SELALU berperan climber. Peran lain dibuat oleh admin atau organizer.
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, fullName: input.fullName, phone: input.phone, role: 'climber' },
  });
  return { user: publicUser(user), token: signAccessToken({ id: user.id, role: user.role }) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // Pesan sengaja sama untuk email salah maupun kata sandi salah.
  const invalid = new AppError(401, 'Email atau kata sandi salah', 'INVALID_CREDENTIALS');
  if (!user || !user.passwordHash || !user.isActive) throw invalid;

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw invalid;

  if (user.role === 'organizer' && user.organizerStatus !== 'approved') {
    throw new AppError(403, 'Akun organizer belum disetujui admin', 'ORGANIZER_NOT_APPROVED');
  }
  return { user: publicUser(user), token: signAccessToken({ id: user.id, role: user.role }) };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
  if (!user) throw new AppError(404, 'Pengguna tidak ditemukan', 'NOT_FOUND');
  return {
    ...publicUser(user),
    profile: user.profile
      ? { verifiedStatus: user.profile.verifiedStatus, rejectionReason: user.profile.rejectionReason }
      : null,
  };
}