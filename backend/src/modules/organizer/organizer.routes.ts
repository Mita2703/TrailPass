import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errors';
import {
  bulkUpdateTrailQuotas,
  createOfficer,
  createTrail,
  getOfficers,
  getOrgBookings,
  getOrgMountains,
  getOrgOverdue,
  getOrgRevenue,
  getOrgTrails,
  removeOfficer,
  updateTrail,
  getTrailQuotas,
  assertOrganizerTrail,
} from './organizer.service';
import {
  BulkUpdateQuotaSchema,
  CreateOfficerSchema,
  CreateTrailSchema,
  OrgBookingsFilterSchema,
  OrgRevenueFilterSchema,
  UpdateTrailSchema,
} from './organizer.schema';
import {
  previewAffectedBookings,
  setTrailAdvisory,
} from '../admin/advisories.service';
import { SetAdvisorySchema } from '../admin/advisories.schema';

const router = Router();

// Semua endpoint organizer membutuhkan login dan role 'organizer'
router.use(authenticate, requireRole('organizer'));

// ----------------------------------------------------
// 1. Gunung & Jalur
// ----------------------------------------------------
router.get(
  '/org/mountains',
  asyncHandler(async (req, res) => {
    const mountains = await getOrgMountains(req.user!.id);
    res.json({ data: mountains, error: null });
  }),
);

router.get(
  '/org/trails',
  asyncHandler(async (req, res) => {
    const mountainId = req.query.mountainId as string | undefined;
    const trails = await getOrgTrails(req.user!.id, mountainId);
    res.json({ data: trails, error: null });
  }),
);

router.post(
  '/org/mountains/:mountainId/trails',
  asyncHandler(async (req, res) => {
    const body = CreateTrailSchema.parse(req.body);
    const trail = await createTrail(req.user!.id, req.params.mountainId, body);
    res.status(201).json({ data: trail, error: null });
  }),
);

router.put(
  '/org/trails/:id',
  asyncHandler(async (req, res) => {
    const body = UpdateTrailSchema.parse(req.body);
    const updated = await updateTrail(req.user!.id, req.params.id, body);
    res.json({ data: updated, error: null });
  }),
);

// ----------------------------------------------------
// 2. Kuota Kalender
// ----------------------------------------------------
router.get(
  '/org/trails/:id/quotas',
  asyncHandler(async (req, res) => {
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        data: null,
        error: { code: 'INVALID_MONTH', message: 'Format bulan harus YYYY-MM' },
      });
    }

    const quotas = await getTrailQuotas(req.user!.id, req.params.id, month);
    res.json({ data: quotas, error: null });
  }),
);

router.put(
  '/org/trails/:id/quotas',
  asyncHandler(async (req, res) => {
    const body = BulkUpdateQuotaSchema.parse(req.body);
    const result = await bulkUpdateTrailQuotas(req.user!.id, req.params.id, body);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 3. Status Jalur / Advisories (Organizer)
// ----------------------------------------------------
router.get(
  '/org/trails/:id/advisories/preview',
  asyncHandler(async (req, res) => {
    await assertOrganizerTrail(req.user!.id, req.params.id);
    const query = z.object({
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).parse(req.query);

    const result = await previewAffectedBookings(req.params.id, query.from, query.to);
    res.json({ data: result, error: null });
  }),
);

router.post(
  '/org/trails/:id/advisories',
  asyncHandler(async (req, res) => {
    await assertOrganizerTrail(req.user!.id, req.params.id);
    const body = SetAdvisorySchema.parse(req.body);
    const result = await setTrailAdvisory(req.user!.id, req.params.id, body);
    res.status(201).json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 4. Booking Monitoring & Overdue Climbers
// ----------------------------------------------------
router.get(
  '/org/bookings',
  asyncHandler(async (req, res) => {
    const filters = OrgBookingsFilterSchema.parse(req.query);
    const result = await getOrgBookings(req.user!.id, filters);
    res.json({ data: result, error: null });
  }),
);

router.get(
  '/org/overdue',
  asyncHandler(async (req, res) => {
    const overdue = await getOrgOverdue(req.user!.id);
    res.json({ data: overdue, error: null });
  }),
);

// ----------------------------------------------------
// 5. Pendapatan / Revenue Report
// ----------------------------------------------------
router.get(
  '/org/reports/revenue',
  asyncHandler(async (req, res) => {
    const filters = OrgRevenueFilterSchema.parse(req.query);
    const result = await getOrgRevenue(req.user!.id, filters);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 6. Pengelolaan Petugas Pos (Officers)
// ----------------------------------------------------
router.get(
  '/org/mountains/:mountainId/officers',
  asyncHandler(async (req, res) => {
    const officers = await getOfficers(req.user!.id, req.params.mountainId);
    res.json({ data: officers, error: null });
  }),
);

router.post(
  '/org/mountains/:mountainId/officers',
  asyncHandler(async (req, res) => {
    const body = CreateOfficerSchema.parse(req.body);
    const officer = await createOfficer(req.user!.id, req.params.mountainId, body);
    res.status(201).json({ data: officer, error: null });
  }),
);

router.delete(
  '/org/mountains/:mountainId/officers/:officerId',
  asyncHandler(async (req, res) => {
    const result = await removeOfficer(req.user!.id, req.params.mountainId, req.params.officerId);
    res.json({ data: result, error: null });
  }),
);

export default router;
