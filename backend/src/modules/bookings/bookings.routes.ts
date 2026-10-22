import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errors';
import { bookingIdSchema, createBookingSchema, idempotencyKeySchema } from './bookings.schema';
import { createHold, getBooking } from './bookings.service';

const router = Router();

router.post(
  '/bookings',
  authenticate,
  requireRole('climber'),
  asyncHandler(async (req, res) => {
    const input = createBookingSchema.parse(req.body);
    const key = idempotencyKeySchema.parse(req.header('Idempotency-Key'));
    const { booking, created } = await createHold(req.user!.id, input, key);
    res.status(created ? 201 : 200).json({ data: booking, error: null });
  }),
);

router.get(
  '/bookings/:id',
  authenticate,
  requireRole('climber'),
  asyncHandler(async (req, res) => {
    const { id } = bookingIdSchema.parse(req.params);
    res.json({ data: await getBooking(req.user!.id, id), error: null });
  }),
);

export default router;