import winston from 'winston';
import { config } from '@/shared/config/env.js';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// format สำหรับ dev (อ่านง่ายบน terminal ของ local machine)
const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${stack || message} ${metaStr}`;
  }),
);

// format สำหรับ production: JSON ล้วน, บรรทัดเดียวต่อ 1 log event
// เหมาะกับ log driver ของ Docker/K8s ที่จะดูด stdout ไปต่อให้ CloudWatch, Loki, Datadog ฯลฯ
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: config.NODE_ENV === 'production' ? prodFormat : devFormat,
  defaultMeta: {
    service: 'user-service', // เปลี่ยนตามชื่อ service จริง
    env: config.NODE_ENV,
  },
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

// ไม่มี File transport แล้ว — log ทั้งหมดออกทาง stdout เท่านั้น
// container runtime (Docker log driver / K8s) จะ capture แล้วส่งต่อให้ log aggregator เอง
