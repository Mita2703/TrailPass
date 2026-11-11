import { z } from 'zod';

export const bookingPaymentParamSchema = z.object({
  id: z.string().uuid('ID booking tidak valid'),
});

export const midtransNotificationSchema = z.object({
  order_id: z.string(),
  status_code: z.string(),
  gross_amount: z.string(),
  signature_key: z.string(),
  transaction_status: z.string(),
  fraud_status: z.string().optional(),
  payment_type: z.string().optional(),
  transaction_time: z.string().optional(),
  settlement_time: z.string().optional(),
}).passthrough();

export const checkTicketQuerySchema = z.object({
  bookingCode: z.string().optional(),
  nik: z.string().length(16, 'NIK harus 16 digit').optional(),
  climbDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .optional(),
}).refine(
  (data) => Boolean(data.bookingCode || (data.nik && data.climbDate)),
  { message: 'Harus mengisi Kode Booking atau kombinasi NIK Ketua dan Tanggal Pendakian' },
);

export type MidtransNotificationPayload = z.infer<typeof midtransNotificationSchema>;
export type CheckTicketQuery = z.infer<typeof checkTicketQuerySchema>;
