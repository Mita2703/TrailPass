import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errors';
import {
  joinQueueSchema,
  queueStatusQuerySchema,
  trailIdParamSchema,
} from './queue.schema';
import { getQueueStatus, joinQueue, leaveQueue } from './queue.service';

const router = Router();

/**
 * Masuk antrean virtual pemesanan tiket
 */
router.post(
  '/trails/:id/queue/join',
  authenticate,
  requireRole('climber'),
  asyncHandler(async (req, res) => {
    const { id } = trailIdParamSchema.parse(req.params);
    const input = joinQueueSchema.parse(req.body);
    const result = await joinQueue(req.user!.id, id, input);
    res.json({ data: result, error: null });
  }),
);

/**
 * Cek posisi antrean & estimasi waktu tunggu
 */
router.get(
  '/trails/:id/queue/status',
  authenticate,
  requireRole('climber'),
  asyncHandler(async (req, res) => {
    const { id } = trailIdParamSchema.parse(req.params);
    const { date } = queueStatusQuerySchema.parse(req.query);
    const result = await getQueueStatus(req.user!.id, id, date);
    res.json({ data: result, error: null });
  }),
);

/**
 * Keluar dari antrean
 */
router.delete(
  '/trails/:id/queue/leave',
  authenticate,
  requireRole('climber'),
  asyncHandler(async (req, res) => {
    const { id } = trailIdParamSchema.parse(req.params);
    const { date } = queueStatusQuerySchema.parse(req.query);
    const result = await leaveQueue(req.user!.id, id, date);
    res.json({ data: result, error: null });
  }),
);

export default router;
