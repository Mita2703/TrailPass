import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../middleware/auth";
import { asyncHandler } from "../../middleware/errors";
import { validateBody } from "../../middleware/validate";
import { getMe, login, register } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";

const router = Router();

// Batasi percobaan per IP (perlindungan dasar terhadap tebak kata sandi).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    error: {
      code: "RATE_LIMITED",
      message: "Terlalu banyak percobaan, coba lagi nanti",
    },
  },
});

router.post(
  "/auth/register",
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json({ data: await register(req.body), error: null });
  }),
);

router.post(
  "/auth/login",
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    res.json({ data: await login(req.body), error: null });
  }),
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({ data: await getMe(req.user!.id), error: null });
  }),
);

export default router;
