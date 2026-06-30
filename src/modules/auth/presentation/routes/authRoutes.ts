import { Router } from 'express';
import { AuthController } from '@/modules/auth/presentation/controllers/AuthController.js';
import { asyncHandler } from '@/shared/middlewares/asyncHandler.js';
import { validate } from '@/shared/middlewares/validate.js';
import { authenticate } from '@/shared/middlewares/authenticate.js';
import {
  loginSchema,
  refreshTokenSchema,
} from '@/modules/auth/presentation/validators/authValidator.js';

export function authRoutes(authController: AuthController): Router {
  const router = Router();

  router.post(
    '/login',
    validate(loginSchema),
    asyncHandler(authController.login),
  );
  router.post(
    '/refresh',
    validate(refreshTokenSchema),
    asyncHandler(authController.refresh),
  );
  router.post('/logout', authenticate, asyncHandler(authController.logout));

  return router;
}
