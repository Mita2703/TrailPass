import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errors';
import {
  cancelBookingsByClosure,
  getCurrentAdvisory,
  previewAffectedBookings,
  setTrailAdvisory,
} from './advisories.service';
import { SetAdvisorySchema } from './advisories.schema';
import {
  getProfileById,
  getProfiles,
  verifyProfile,
} from './profiles.service';
import {
  ListProfilesSchema,
  VerifyProfileSchema,
} from './profiles.schema';
import {
  addBlacklist,
  listBlacklists,
  removeBlacklist,
  updateBlacklist,
} from './blacklist.service';
import {
  CreateBlacklistSchema,
  ListBlacklistSchema,
  UpdateBlacklistSchema,
} from './blacklist.schema';
import {
  approveOrganizer,
  assignOrganizerToMountain,
  createMountain,
  listOrganizers,
  removeOrganizerFromMountain,
  setMountainRules,
  updateMountain,
} from './organizers.service';
import {
  ApproveOrganizerSchema,
  AssignOrganizerSchema,
  CreateMountainSchema,
  ListOrganizersSchema,
  SetMountainRulesSchema,
  UpdateMountainSchema,
} from './organizers.schema';
import {
  getGlobalRevenueReport,
  listAllBookings,
  listAllUsers,
  listAuditLogs,
  listRefundRequests,
  processRefundRequest,
  toggleUserActive,
} from './admin.service';
import {
  ListAuditLogsSchema,
  ListBookingsAdminSchema,
  ListUsersSchema,
  ProcessRefundSchema,
  RevenueReportQuerySchema,
} from './admin.schema';
import { z } from 'zod';

const router = Router();

// Semua rute admin memerlukan autentikasi dan peran 'admin'
router.use(authenticate, requireRole('admin'));

// ----------------------------------------------------
// 1. Advisories & Status Jalur
// ----------------------------------------------------
router.get(
  '/admin/trails/:id/advisories/preview',
  asyncHandler(async (req, res) => {
    const query = z.object({
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).parse(req.query);

    const result = await previewAffectedBookings(req.params.id, query.from, query.to);
    res.json({ data: result, error: null });
  }),
);

router.post(
  '/admin/trails/:id/advisories',
  asyncHandler(async (req, res) => {
    const body = SetAdvisorySchema.parse(req.body);
    const result = await setTrailAdvisory(req.user!.id, req.params.id, body);
    res.status(201).json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 2. Profile Verifications
// ----------------------------------------------------
router.get(
  '/admin/verifications/profiles',
  asyncHandler(async (req, res) => {
    const query = ListProfilesSchema.parse(req.query);
    const result = await getProfiles(query);
    res.json({ data: result, error: null });
  }),
);

router.get(
  '/admin/verifications/profiles/:id',
  asyncHandler(async (req, res) => {
    const profile = await getProfileById(req.params.id);
    res.json({ data: profile, error: null });
  }),
);

router.post(
  '/admin/verifications/profiles/:id',
  asyncHandler(async (req, res) => {
    const body = VerifyProfileSchema.parse(req.body);
    const result = await verifyProfile(req.user!.id, req.params.id, body);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 3. Blacklist
// ----------------------------------------------------
router.get(
  '/admin/blacklists',
  asyncHandler(async (req, res) => {
    const query = ListBlacklistSchema.parse(req.query);
    const result = await listBlacklists(query);
    res.json({ data: result, error: null });
  }),
);

router.post(
  '/admin/blacklists',
  asyncHandler(async (req, res) => {
    const body = CreateBlacklistSchema.parse(req.body);
    const result = await addBlacklist(req.user!.id, body);
    res.status(201).json({ data: result, error: null });
  }),
);

router.put(
  '/admin/blacklists/:id',
  asyncHandler(async (req, res) => {
    const body = UpdateBlacklistSchema.parse(req.body);
    const result = await updateBlacklist(req.user!.id, req.params.id, body);
    res.json({ data: result, error: null });
  }),
);

router.delete(
  '/admin/blacklists/:id',
  asyncHandler(async (req, res) => {
    const result = await removeBlacklist(req.user!.id, req.params.id);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 4. Organizers & Mountains
// ----------------------------------------------------
router.get(
  '/admin/organizers',
  asyncHandler(async (req, res) => {
    const query = ListOrganizersSchema.parse(req.query);
    const result = await listOrganizers(query);
    res.json({ data: result, error: null });
  }),
);

router.post(
  '/admin/organizers/:id/approve',
  asyncHandler(async (req, res) => {
    const body = ApproveOrganizerSchema.parse(req.body);
    const result = await approveOrganizer(req.user!.id, req.params.id, body);
    res.json({ data: result, error: null });
  }),
);

router.post(
  '/admin/mountains',
  asyncHandler(async (req, res) => {
    const body = CreateMountainSchema.parse(req.body);
    const result = await createMountain(req.user!.id, body);
    res.status(201).json({ data: result, error: null });
  }),
);

router.put(
  '/admin/mountains/:id',
  asyncHandler(async (req, res) => {
    const body = UpdateMountainSchema.parse(req.body);
    const result = await updateMountain(req.user!.id, req.params.id, body);
    res.json({ data: result, error: null });
  }),
);

router.put(
  '/admin/mountains/:id/rules',
  asyncHandler(async (req, res) => {
    const body = SetMountainRulesSchema.parse(req.body);
    const result = await setMountainRules(req.user!.id, req.params.id, body);
    res.json({ data: result, error: null });
  }),
);

router.post(
  '/admin/mountains/:id/organizers',
  asyncHandler(async (req, res) => {
    const body = AssignOrganizerSchema.parse(req.body);
    const result = await assignOrganizerToMountain(req.user!.id, req.params.id, body.organizerId);
    res.status(201).json({ data: result, error: null });
  }),
);

router.delete(
  '/admin/mountains/:id/organizers/:organizerId',
  asyncHandler(async (req, res) => {
    const result = await removeOrganizerFromMountain(req.user!.id, req.params.id, req.params.organizerId);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 5. Bookings & Transactions Monitoring
// ----------------------------------------------------
router.get(
  '/admin/bookings',
  asyncHandler(async (req, res) => {
    const query = ListBookingsAdminSchema.parse(req.query);
    const result = await listAllBookings(query);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 6. Refunds
// ----------------------------------------------------
router.get(
  '/admin/refunds',
  asyncHandler(async (req, res) => {
    const query = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      status: z.enum(['requested', 'refunded', 'rejected']).optional(),
    }).parse(req.query);

    const result = await listRefundRequests(query.page, query.limit, query.status);
    res.json({ data: result, error: null });
  }),
);

router.post(
  '/admin/refunds/:id/process',
  asyncHandler(async (req, res) => {
    const body = ProcessRefundSchema.parse(req.body);
    const result = await processRefundRequest(req.user!.id, req.params.id, body);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 7. Revenue Reports
// ----------------------------------------------------
router.get(
  '/admin/reports/revenue',
  asyncHandler(async (req, res) => {
    const query = RevenueReportQuerySchema.parse(req.query);
    const result = await getGlobalRevenueReport(query);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 8. Audit Logs
// ----------------------------------------------------
router.get(
  '/admin/audit-logs',
  asyncHandler(async (req, res) => {
    const query = ListAuditLogsSchema.parse(req.query);
    const result = await listAuditLogs(query);
    res.json({ data: result, error: null });
  }),
);

// ----------------------------------------------------
// 9. User Management
// ----------------------------------------------------
router.get(
  '/admin/users',
  asyncHandler(async (req, res) => {
    const query = ListUsersSchema.parse(req.query);
    const result = await listAllUsers(query);
    res.json({ data: result, error: null });
  }),
);

router.put(
  '/admin/users/:id/status',
  asyncHandler(async (req, res) => {
    const body = z.object({ isActive: z.boolean() }).parse(req.body);
    const result = await toggleUserActive(req.user!.id, req.params.id, body.isActive);
    res.json({ data: result, error: null });
  }),
);

export default router;
