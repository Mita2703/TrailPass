import { z } from 'zod';

export const resolveQrSchema = z
  .object({
    qrToken: z.string().optional(),
    bookingCode: z.string().optional(),
  })
  .refine((data) => Boolean(data.qrToken || data.bookingCode), {
    message: 'Harus menyertakan qrToken atau bookingCode',
  });

export const checkInSchema = z.object({
  bookingId: z.string().uuid('ID booking tidak valid'),
  trailId: z.string().uuid('ID jalur tidak valid'),
  memberIds: z
    .array(z.string().uuid('ID anggota tidak valid'))
    .min(1, 'Pilih minimal satu anggota untuk check-in'),
  method: z.enum(['qr', 'manual']).default('qr'),
  note: z.string().max(500).optional(),
});

export const checkOutSchema = z.object({
  bookingId: z.string().uuid('ID booking tidak valid'),
  trailId: z.string().uuid('ID jalur keluar tidak valid'),
  memberIds: z
    .array(z.string().uuid('ID anggota tidak valid'))
    .min(1, 'Pilih minimal satu anggota untuk check-out'),
  method: z.enum(['qr', 'manual']).default('qr'),
  note: z.string().max(500).optional(),
});

export const memberIdParamSchema = z.object({
  id: z.string().uuid('ID anggota tidak valid'),
});

export const markMemberSchema = z.object({
  status: z.enum(['manual_exit', 'cancelled']),
  reason: z.string().min(3, 'Alasan minimal 3 karakter').max(500),
});

export const searchQuerySchema = z.object({
  q: z.string().min(3, 'Kata kunci pencarian minimal 3 karakter'),
  type: z.enum(['in', 'out']),
});

export const insideQuerySchema = z.object({
  mountainId: z.string().uuid('ID gunung tidak valid').optional(),
});

export type ResolveQrInput = z.infer<typeof resolveQrSchema>;
export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type MarkMemberInput = z.infer<typeof markMemberSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type InsideQuery = z.infer<typeof insideQuerySchema>;
