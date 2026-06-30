import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '@/modules/auth/infrastructure/services/JwtTokenService.js';
import { UnauthorizedError } from '@/shared/errors/AppError.js';

const tokenService = new JwtTokenService();

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Missing token');
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload; // แปะ payload เข้า req.user ตามที่ประกาศใน Express.d.ts
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
