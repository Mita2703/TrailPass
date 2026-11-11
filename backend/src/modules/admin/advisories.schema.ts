import { z } from 'zod';

export const SetAdvisorySchema = z.object({
  status: z.enum(['open', 'limited', 'closed']),
  maxCheckpointId: z.string().uuid().optional(),
  reason: z.string().max(200).optional(),
  message: z.string().optional(),
  severity: z.enum(['info', 'warning', 'danger']).default('info'),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime().optional(),
  sourceUrl: z.string().url().max(500).optional(),
  /** Hanya relevan saat status=closed: tanggal mulai & akhir penutupan */
  closureDateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  closureDateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Jika true, booking terdampak langsung di-cancel */
  cancelAffected: z.boolean().default(false),
});

export type SetAdvisoryInput = z.infer<typeof SetAdvisorySchema>;
