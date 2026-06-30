import mongoose from 'mongoose';
import { createApp } from '@/app.js';
import { config } from '@/shared/config/env.js';

async function start(): Promise<void> {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(config.MONGO_URI);
  console.log('MongoDB connected successfully');
  const app = createApp();
  const server = app.listen(config.PORT, () => {
    console.log(
      `${config.APP_NAME} running on http://localhost:${config.PORT}`,
    );
  });

  const shutdown = (signal: string) => {
    console.warn(`${signal} received. shutting down...`);

    server.close(() => {
      console.log('server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
