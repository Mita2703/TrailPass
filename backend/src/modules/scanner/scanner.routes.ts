import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errors';
import {
  checkInSchema,
  checkOutSchema,
  insideQuerySchema,
  markMemberSchema,
  memberIdParamSchema,
  resolveQrSchema,
  searchQuerySchema,
} from './scanner.schema';
import {
  checkInMembers,
  checkOutMembers,
  getClimbersInside,
  markMemberStatus,
  resolveBooking,
  searchBookingsManual,
} from './scanner.service';

const router = Router();

// Seluruh endpoint scanner mensyaratkan login dengan peran officer, organizer, atau admin
router.use(authenticate, requireRole('officer', 'organizer', 'admin'));

/**
 * Resolusi QR Token atau Kode Booking di pos
 */
router.post(
  '/scanner/resolve',
  asyncHandler(async (req, res) => {
    const input = resolveQrSchema.parse(req.body);
    const result = await resolveBooking(req.user!.id, req.user!.role, input);
    res.json({ data: result, error: null });
  }),
);

/**
 * Scan Masuk (Check-In) rombongan di basecamp
 */
router.post(
  '/scanner/check-in',
  asyncHandler(async (req, res) => {
    const input = checkInSchema.parse(req.body);
    const result = await checkInMembers(req.user!.id, req.user!.role, input, req.ip);
    res.json({ data: result, error: null });
  }),
);

/**
 * Scan Keluar (Check-Out) rombongan
 * Mendukung rombongan turun terpisah & pendakian lintas jalur
 */
router.post(
  '/scanner/check-out',
  asyncHandler(async (req, res) => {
    const input = checkOutSchema.parse(req.body);
    const result = await checkOutMembers(req.user!.id, req.user!.role, input, req.ip);
    res.json({ data: result, error: null });
  }),
);

/**
 * Tandai status darurat anggota (evakuasi/manual_exit atau batal/cancelled)
 */
router.post(
  '/scanner/members/:id/mark',
  asyncHandler(async (req, res) => {
    const { id } = memberIdParamSchema.parse(req.params);
    const input = markMemberSchema.parse(req.body);
    const result = await markMemberStatus(req.user!.id, req.user!.role, id, input, req.ip);
    res.json({ data: result, error: null });
  }),
);

/**
 * Pencarian booking manual oleh petugas pos
 */
router.get(
  '/scanner/search',
  asyncHandler(async (req, res) => {
    const query = searchQuerySchema.parse(req.query);
    const result = await searchBookingsManual(req.user!.id, req.user!.role, query, req.ip);
    res.json({ data: result, error: null });
  }),
);

/**
 * Daftar pendaki yang sedang berada di atas gunung (climbing)
 */
router.get(
  '/scanner/inside',
  asyncHandler(async (req, res) => {
    const query = insideQuerySchema.parse(req.query);
    const result = await getClimbersInside(req.user!.id, req.user!.role, query.mountainId);
    res.json({ data: result, error: null });
  }),
);

export default router;
