import type { NextFunction, Request, Response } from 'express';

import { logger } from '@/libs/index.js';
import { AppError } from '@/errors/AppError.js';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}
