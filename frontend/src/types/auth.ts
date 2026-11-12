export type UserRole = 'CLIMBER' | 'ORGANIZER' | 'ADMIN' | 'OFFICER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  assignedMountain?: string; // For ORGANIZER and OFFICER
  assignedPost?: string;     // For OFFICER
}

export interface RoleConfig {
  role: UserRole;
  label: string;
  badgeCls: string;
  description: string;
  defaultPath: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  CLIMBER: {
    role: 'CLIMBER',
    label: 'Pendaki (Climber)',
    badgeCls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Pengguna publik yang memesan tiket, membayar, dan memiliki e-SIMAKSI.',
    defaultPath: '/pendaki/dashboard',
  },
  ORGANIZER: {
    role: 'ORGANIZER',
    label: 'Organizer (Basecamp)',
    badgeCls: 'bg-blue-50 text-blue-800 border-blue-200',
    description: 'Pengelola jalur, kuota, harga, dan laporan pendapatan basecamp.',
    defaultPath: '/organizer/dashboard',
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Super Admin',
    badgeCls: 'bg-purple-50 text-purple-800 border-purple-200',
    description: 'Pengelola platform: master data gunung se-Indonesia, approval, blacklist, & refund.',
    defaultPath: '/admin/dashboard',
  },
  OFFICER: {
    role: 'OFFICER',
    label: 'Petugas Pos (Scanner)',
    badgeCls: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Petugas lapangan yang memvalidasi QR Code check-in & check-out.',
    defaultPath: '/petugas/scanner',
  },
};
