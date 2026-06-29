import app from './app.js';
import { env } from '@/config/index.js';
import { logger } from '@/libs/index.js';

const server = app.listen(env.PORT, () => {
  logger.info(`${env.APP_NAME} running on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  logger.warn(`${signal} received. shutting down...`);

  server.close(() => {
    logger.info('server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
