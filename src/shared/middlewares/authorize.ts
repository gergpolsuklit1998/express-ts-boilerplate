import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@/shared/constants/userRole.js';
import { ForbiddenError, UnauthorizedError } from '@/shared/errors/AppError.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
}
