import { Router } from 'express';
import { UserController } from '@/modules/user/presentation/controllers/UserController.js';
import { asyncHandler } from '@/shared/middlewares/asyncHandler.js';
import { validate } from '@/shared/middlewares/validate.js';
import {
  createUserSchema,
  idParamSchema,
} from '@/modules/user/presentation/validators/userValidator.js';
import { authenticate } from '@/shared/middlewares/authenticate.js';
import { authorize } from '@/shared/middlewares/authorize.js';
import { USER_ROLE } from '@/shared/constants/userRole.js';

export function userRoutes(userController: UserController): Router {
  const router = Router();

  router.post(
    '/',
    validate(createUserSchema, 'body'),
    asyncHandler(userController.create),
  );

  router.get(
    '/me',
    authenticate, // login แล้วก็เข้าได้ ไม่ต้องเช็ค role
    asyncHandler(userController.getMe),
  );

  router.delete('/me', authenticate, asyncHandler(userController.deleteMe));

  router.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(userController.getById),
  );

  router.delete(
    '/:id',
    authenticate,
    authorize(USER_ROLE.ADMIN), // เฉพาะ admin เท่านั้นที่ลบ user ได้
    validate(idParamSchema, 'params'),
    asyncHandler(userController.delete),
  );

  return router;
}
