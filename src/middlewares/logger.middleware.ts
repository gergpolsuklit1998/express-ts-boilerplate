import { pinoHttp } from 'pino-http';
import { logger } from '@/libs/index.js';

export const loggerMiddleware = pinoHttp({
  logger,

  customLogLevel: function (_, res, err) {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  autoLogging: {
    ignore: (req) => req.url === '/health',
  },

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        headers: {
          'user-agent': req.headers['user-agent'],
          'content-type': req.headers['content-type'],
        },
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
