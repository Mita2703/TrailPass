import { z } from 'zod';

export const bookingIdParamSchema = z.object({
  id: z.string().uuid('ID booking tidak valid'),
});

export const rescheduleSchema = z.object({
  newClimbDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'Tanggal tidak valid'),
});

export const closureChoiceSchema = z.discriminatedUnion('choice', [
  z.object({
    choice: z.literal('reschedule'),
    newClimbDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
      .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'Tanggal tidak valid'),
  }),
  z.object({
    choice: z.literal('refund'),
    bankName: z.string().min(2, 'Nama bank minimal 2 karakter').max(50),
    accountNumber: z.string().min(4, 'Nomor rekening minimal 4 digit').max(50),
    accountHolder: z.string().min(2, 'Nama pemilik rekening minimal 2 karakter').max(150),
  }),
]);

export type RescheduleInput = z.infer<typeof rescheduleSchema>;
export type ClosureChoiceInput = z.infer<typeof closureChoiceSchema>;
