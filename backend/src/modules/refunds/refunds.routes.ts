import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errors';
import {
  bookingIdParamSchema,
  closureChoiceSchema,
  rescheduleSchema,
} from './refunds.schema';
import {
  cancelPendingBooking,
  getMyBookings,
  handleClosureChoice,
  rescheduleBooking,
} from './refunds.service';

const router = Router();

// Seluruh endpoint ini mensyaratkan login sebagai pendaki (climber)
router.use(authenticate, requireRole('climber'));

/**
 * Riwayat booking saya
 */
router.get(
  '/me/bookings',
  asyncHandler(async (req, res) => {
    const result = await getMyBookings(req.user!.id);
    res.json({ data: result, error: null });
  }),
);

/**
 * Reschedule mandiri (1x sebelum H-N)
 */
router.post(
  '/bookings/:id/reschedule',
  asyncHandler(async (req, res) => {
    const { id } = bookingIdParamSchema.parse(req.params);
    const input = rescheduleSchema.parse(req.body);
    const result = await rescheduleBooking(req.user!.id, id, input);
    res.json({ data: result, error: null });
  }),
);

/**
 * Pilihan reschedule atau refund saat jalur ditutup
 */
router.post(
  '/bookings/:id/closure-choice',
  asyncHandler(async (req, res) => {
    const { id } = bookingIdParamSchema.parse(req.params);
    const input = closureChoiceSchema.parse(req.body);
    const result = await handleClosureChoice(req.user!.id, id, input);
    res.json({ data: result, error: null });
  }),
);

/**
 * Batalkan booking sebelum bayar (status pending)
 */
router.delete(
  '/bookings/:id',
  asyncHandler(async (req, res) => {
    const { id } = bookingIdParamSchema.parse(req.params);
    const result = await cancelPendingBooking(req.user!.id, id);
    res.json({ data: result, error: null });
  }),
);

export default router;
