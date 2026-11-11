import { z } from 'zod';

export const trailIdParamSchema = z.object({
  id: z.string().uuid('ID jalur tidak valid'),
});

export const joinQueueSchema = z.object({
  climbDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  memberCount: z
    .number()
    .int('Jumlah anggota harus bilangan bulat')
    .min(1, 'Minimal 1 orang')
    .max(50, 'Maksimal 50 orang'),
});

export const queueStatusQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
});

export type JoinQueueInput = z.infer<typeof joinQueueSchema>;
export type QueueStatusQuery = z.infer<typeof queueStatusQuerySchema>;
