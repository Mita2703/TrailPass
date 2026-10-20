import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter').max(72, 'Kata sandi maksimal 72 karakter'),
  fullName: z.string().trim().min(2, 'Nama minimal 2 karakter').max(150),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+]{8,20}$/, 'Nomor telepon tidak valid')
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;