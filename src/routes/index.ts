import { Router } from 'express';

const router = Router();

/**
 * Health check
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
