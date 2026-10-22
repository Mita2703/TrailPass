import { z } from 'zod';

export const createBookingSchema = z.object({
  trailId: z.string().uuid('ID jalur tidak valid'),
  climbDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'Tanggal tidak valid'),
  memberCount: z.number().int('Jumlah anggota harus bilangan bulat').min(1, 'Minimal 1 orang').max(50),
});

export const idempotencyKeySchema = z
  .string({ required_error: 'Header Idempotency-Key wajib diisi' })
  .min(8, 'Idempotency-Key minimal 8 karakter')
  .max(80);

export const bookingIdSchema = z.object({ id: z.string().uuid('ID booking tidak valid') });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;