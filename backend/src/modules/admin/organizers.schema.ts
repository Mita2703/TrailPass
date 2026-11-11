import { z } from 'zod';

export const ListOrganizersSchema = z.object({
  status: z.enum(['pending', 'approved', 'blocked']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const ApproveOrganizerSchema = z.object({
  action: z.enum(['approve', 'block']),
});

export const CreateMountainSchema = z.object({
  name: z.string().min(2).max(150),
  slug: z.string().min(2).max(160).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  province: z.string().min(2).max(100),
  regency: z.string().min(2).max(100),
  elevationM: z.number().int().positive(),
  lat: z.number(),
  lng: z.number(),
  timezone: z.string().default('Asia/Jakarta'),
  description: z.string().optional(),
  coverImage: z.string().url().max(500).optional(),
  managingAgency: z.string().max(200).optional(),
  officialUrl: z.string().url().max(500).optional(),
  isActive: z.boolean().default(true),
});

export const UpdateMountainSchema = CreateMountainSchema.partial();

export const SetMountainRulesSchema = z.object({
  minGroup: z.number().int().min(1).default(1),
  maxGroup: z.number().int().min(1).max(50),
  minAge: z.number().int().min(0).max(100).optional().nullable(),
  bookingCutoffDays: z.number().int().min(0).default(0),
  holdMinutes: z.number().int().min(5).max(1440).default(30),
  maxDurationDays: z.number().int().min(1).max(30).default(3),
  rescheduleDeadlineDays: z.number().int().min(1).optional().nullable(),
  requireBriefing: z.boolean().default(false),
  extraRules: z.any().optional(),
});

export const AssignOrganizerSchema = z.object({
  organizerId: z.string().uuid(),
});

export type ListOrganizersInput = z.infer<typeof ListOrganizersSchema>;
export type ApproveOrganizerInput = z.infer<typeof ApproveOrganizerSchema>;
export type CreateMountainInput = z.infer<typeof CreateMountainSchema>;
export type UpdateMountainInput = z.infer<typeof UpdateMountainSchema>;
export type SetMountainRulesInput = z.infer<typeof SetMountainRulesSchema>;
export type AssignOrganizerInput = z.infer<typeof AssignOrganizerSchema>;
