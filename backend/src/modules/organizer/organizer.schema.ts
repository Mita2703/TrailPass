import { z } from 'zod';

export const CreateTrailSchema = z.object({
  name: z.string().min(2).max(150),
  distanceKm: z.number().positive().optional(),
  estimatedHours: z.number().positive().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  price: z.number().int().nonnegative(),
  priceForeign: z.number().int().nonnegative().optional(),
  extraFees: z.any().optional(),
  queueEnabled: z.boolean().default(true),
  queueMaxActive: z.number().int().positive().default(30),
  ruleOverrides: z.any().optional(),
  isActive: z.boolean().default(true),
});

export const UpdateTrailSchema = CreateTrailSchema.partial();

export const BulkQuotaItemSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal YYYY-MM-DD'),
  totalQuota: z.number().int().nonnegative(),
  isClosed: z.boolean().optional(),
  priceOverride: z.number().int().nonnegative().optional(),
});

export const BulkUpdateQuotaSchema = z.object({
  quotas: z.array(BulkQuotaItemSchema).min(1).max(366),
});

export const OrgBookingsFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  mountainId: z.string().uuid().optional(),
  trailId: z.string().uuid().optional(),
  status: z.enum([
    'pending',
    'paid',
    'completed',
    'expired',
    'failed',
    'rescheduled',
    'cancelled_by_closure',
    'refund_requested',
    'refunded',
  ]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  search: z.string().optional(),
});

export const CreateOfficerSchema = z.object({
  fullName: z.string().min(2).max(150),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(8).max(20).optional(),
});

export const OrgRevenueFilterSchema = z.object({
  mountainId: z.string().uuid().optional(),
  trailId: z.string().uuid().optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateTrailInput = z.infer<typeof CreateTrailSchema>;
export type UpdateTrailInput = z.infer<typeof UpdateTrailSchema>;
export type BulkUpdateQuotaInput = z.infer<typeof BulkUpdateQuotaSchema>;
export type OrgBookingsFilterInput = z.infer<typeof OrgBookingsFilterSchema>;
export type CreateOfficerInput = z.infer<typeof CreateOfficerSchema>;
export type OrgRevenueFilterInput = z.infer<typeof OrgRevenueFilterSchema>;
