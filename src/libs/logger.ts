import pino, { type LoggerOptions } from 'pino';
import { env } from '@/config/index.js';

const isDev = env.NODE_ENV !== 'production';

const options: LoggerOptions = {
  level: env.LOG_LEVEL,

  base: {
    pid: process.pid,
    hostname: false,
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  formatters: {
    level(label, _number) {
      return { level: label };
    },
  },
};

if (isDev) {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(options);
