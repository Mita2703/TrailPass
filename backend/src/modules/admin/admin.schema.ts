import { z } from 'zod';

export const ListBookingsAdminSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
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
  mountainId: z.string().uuid().optional(),
  trailId: z.string().uuid().optional(),
  climbDateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  climbDateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  search: z.string().optional(),
});

export const ProcessRefundSchema = z.object({
  action: z.enum(['approve', 'reject']),
  note: z.string().max(255).optional(),
});

export const ListAuditLogsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  action: z.string().optional(),
  targetType: z.string().optional(),
  actorId: z.string().uuid().optional(),
});

export const ListUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(['climber', 'organizer', 'admin', 'officer']).optional(),
  search: z.string().optional(),
});

export const RevenueReportQuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  mountainId: z.string().uuid().optional(),
});

export type ListBookingsAdminInput = z.infer<typeof ListBookingsAdminSchema>;
export type ProcessRefundInput = z.infer<typeof ProcessRefundSchema>;
export type ListAuditLogsInput = z.infer<typeof ListAuditLogsSchema>;
export type ListUsersInput = z.infer<typeof ListUsersSchema>;
export type RevenueReportQueryInput = z.infer<typeof RevenueReportQuerySchema>;
