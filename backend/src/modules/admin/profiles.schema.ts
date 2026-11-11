import { z } from 'zod';

export const ListProfilesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['pending', 'verified', 'rejected']).optional(),
  search: z.string().optional(),
});

export const VerifyProfileSchema = z.object({
  decision: z.enum(['verified', 'rejected']),
  rejectionReason: z.string().min(3).max(255).optional(),
}).refine((data) => {
  if (data.decision === 'rejected' && !data.rejectionReason) {
    return false;
  }
  return true;
}, {
  message: 'Alasan penolakan wajib diisi jika status ditolak',
  path: ['rejectionReason'],
});

export type ListProfilesInput = z.infer<typeof ListProfilesSchema>;
export type VerifyProfileInput = z.infer<typeof VerifyProfileSchema>;
