import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errors';
import {
  bookingPaymentParamSchema,
  checkTicketQuerySchema,
  midtransNotificationSchema,
} from './payments.schema';
import {
  checkBookingPublic,
  createPayment,
  getTicket,
  handleMidtransNotification,
} from './payments.service';

const router = Router();

// Rate limiter untuk cek booking publik
const checkBookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  message: {
    data: null,
    error: {
      code: 'RATE_LIMITED',
      message: 'Terlalu banyak permintaan pengecekan booking, coba lagi nanti',
    },
  },
});

/**
 * Buat / minta Snap Token Midtrans untuk pembayaran booking
 */
router.post(
  '/bookings/:id/pay',
  authenticate,
  requireRole('climber'),
  asyncHandler(async (req, res) => {
    const { id } = bookingPaymentParamSchema.parse(req.params);
    const result = await createPayment(req.user!.id, id);
    res.json({ data: result, error: null });
  }),
);

/**
 * Webhook Midtrans HTTP Notification
 */
router.post(
  '/payments/midtrans/notification',
  asyncHandler(async (req, res) => {
    const payload = midtransNotificationSchema.parse(req.body);
    const result = await handleMidtransNotification(payload);
    res.json({ data: result, error: null });
  }),
);

/**
 * Ambil e-tiket (hanya pemilik booking)
 */
router.get(
  '/bookings/:id/ticket',
  authenticate,
  requireRole('climber'),
  asyncHandler(async (req, res) => {
    const { id } = bookingPaymentParamSchema.parse(req.params);
    const ticket = await getTicket(req.user!.id, id);
    res.json({ data: ticket, error: null });
  }),
);

/**
 * Cek status booking secara publik tanpa login
 */
router.post(
  '/bookings/check',
  checkBookingLimiter,
  asyncHandler(async (req, res) => {
    const query = checkTicketQuerySchema.parse(req.body);
    const result = await checkBookingPublic(query);
    res.json({ data: result, error: null });
  }),
);

export default router;
