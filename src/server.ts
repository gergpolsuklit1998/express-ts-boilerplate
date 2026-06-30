import mongoose from 'mongoose';
import { createApp } from '@/app.js';
import { config } from '@/shared/config/env.js';
import { logger } from '@/shared/utils/logger.js';

async function start(): Promise<void> {
  try {
    logger.info('Connecting to MongoDB...');

    await mongoose.connect(config.MONGO_URI);

    logger.info('MongoDB connected successfully');

    const app = createApp();

    const server = app.listen(config.PORT, () => {
      logger.info(
        `${config.APP_NAME} is running on http://localhost:${config.PORT}`,
      );
    });

    const shutdown = async (signal: string) => {
      logger.warn(`${signal} received. Shutting down...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        await mongoose.connection.close();
        logger.info('MongoDB connection closed');

        process.exit(0);
      });
    };

    process.on('SIGTERM', () => {
      void shutdown('SIGTERM');
    });

    process.on('SIGINT', () => {
      void shutdown('SIGINT');
    });
  } catch (error) {
    logger.error('Failed to start application', {
      error: error instanceof Error ? error.stack : error,
    });

    process.exit(1);
  }
}

void start();
