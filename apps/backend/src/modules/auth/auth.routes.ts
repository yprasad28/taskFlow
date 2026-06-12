import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import { registerSchema, loginSchema, refreshSchema } from "./auth.schema";
import { authRateLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  "/refresh",
  validate(refreshSchema),
  authController.refresh
);

router.get(
  "/me",
  authenticate,
  authController.me
);

export default router;
