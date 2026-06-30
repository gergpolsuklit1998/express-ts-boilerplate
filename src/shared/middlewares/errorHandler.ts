import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/shared/errors/AppError.js';
import { logger } from '@/shared/utils/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const baseMeta = {
    requestId: req.requestId,
    path: req.path,
    method: req.method,
  };

  if (!(err instanceof AppError)) {
    logger.error('UNEXPECTED ERROR', {
      ...baseMeta,
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      success: false,
      error: { name: 'InternalServerError', message: 'Something went wrong' },
    });
    return;
  }

  if (!err.isOperational) {
    logger.error('NON-OPERATIONAL ERROR', {
      ...baseMeta,
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn('OPERATIONAL ERROR', {
      ...baseMeta,
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
