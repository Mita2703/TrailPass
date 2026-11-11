import { z } from 'zod';

export const ListBlacklistSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  activeOnly: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
});

export const CreateBlacklistSchema = z.object({
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit angka'),
  fullName: z.string().min(2).max(150),
  reason: z.string().min(3).max(500),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal YYYY-MM-DD').optional().nullable(),
}).refine((data) => {
  if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    return false;
  }
  return true;
}, {
  message: 'Tanggal berakhir harus lebih besar atau sama dengan tanggal mulai',
  path: ['endDate'],
});

export const UpdateBlacklistSchema = z.object({
  fullName: z.string().min(2).max(150).optional(),
  reason: z.string().min(3).max(500).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal YYYY-MM-DD').optional().nullable(),
});

export type ListBlacklistInput = z.infer<typeof ListBlacklistSchema>;
export type CreateBlacklistInput = z.infer<typeof CreateBlacklistSchema>;
export type UpdateBlacklistInput = z.infer<typeof UpdateBlacklistSchema>;
