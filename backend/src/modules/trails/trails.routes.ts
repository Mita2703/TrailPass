import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../middleware/errors';
import { getAvailability } from './trails.service';

const router = Router();

const idSchema = z.object({ id: z.string().uuid('ID jalur tidak valid') });
const querySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Format bulan harus YYYY-MM, contoh 2026-11')
    .optional(),
});

router.get(
  '/trails/:id/availability',
  asyncHandler(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    const { month } = querySchema.parse(req.query);
    const target = month ?? new Date().toISOString().slice(0, 7); // bulan ini bila kosong
    res.json({ data: await getAvailability(id, target), error: null });
  }),
);

export default router;