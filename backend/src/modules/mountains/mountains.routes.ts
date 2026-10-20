import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../middleware/errors';
import { getMountainBySlug, listMountains } from './mountains.service';

const router = Router();

const slugSchema = z.object({ slug: z.string().min(1).max(160) });

router.get(
  '/mountains',
  asyncHandler(async (_req, res) => {
    res.json({ data: await listMountains(), error: null });
  }),
);

router.get(
  '/mountains/:slug',
  asyncHandler(async (req, res) => {
    const { slug } = slugSchema.parse(req.params);
    res.json({ data: await getMountainBySlug(slug), error: null });
  }),
);

export default router;