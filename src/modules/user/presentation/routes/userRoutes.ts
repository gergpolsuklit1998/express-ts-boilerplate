import { Router } from 'express';
import { UserController } from '@/modules/user/presentation/controllers/UserController.js';
import { asyncHandler } from '@/shared/middlewares/asyncHandler.js';
import { validate } from '@/shared/middlewares/validate.js';
import {
  createUserSchema,
  idParamSchema,
} from '@/modules/user/presentation/validators/userValidator.js';

export function userRoutes(userController: UserController): Router {
  const router = Router();

  router.post(
    '/',
    validate(createUserSchema, 'body'),
    asyncHandler(userController.create),
  );

  router.get(
    '/:id',
    validate(idParamSchema, 'params'),
    asyncHandler(userController.getById),
  );

  return router;
}
