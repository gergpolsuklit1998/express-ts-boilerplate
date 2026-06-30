import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // รองรับ header ที่มาจาก upstream (เช่น API Gateway, Load Balancer) ถ้ามี ใช้ตัวเดิม
  const incomingId = req.headers['x-request-id'] as string | undefined;
  req.requestId = incomingId || randomUUID();
  res.setHeader('x-request-id', req.requestId);
  next();
}
