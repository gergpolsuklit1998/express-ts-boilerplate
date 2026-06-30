import express, { type Application, Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { errorHandler } from '@/shared/middlewares/errorHandler.js';
import { userRoutes } from '@/modules/user/presentation/routes/userRoutes.js';
import { requestLogger } from '@/shared/middlewares/requestLogger.js';
import { requestId } from '@/shared/middlewares/requestId.js';
import { buildUserContainer } from '@/container/userContainer.js';
import { config } from '@/shared/config/env.js';
import { buildAuthContainer } from '@/container/authContainer.js';
import { authRoutes } from '@/modules/auth/presentation/routes/authRoutes.js';

export function createApp(): Application {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.use(requestId);
  app.use(requestLogger);

  const v1Router = Router();
  const { userController } = buildUserContainer();
  v1Router.use('/users', userRoutes(userController));

  const { authController } = buildAuthContainer();
  v1Router.use('/auth', authRoutes(authController));

  app.use(`/api/${config.API_VERSION}`, v1Router);

  app.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  app.use(errorHandler);
  return app;
}
