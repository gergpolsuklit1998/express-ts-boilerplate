import { TokenPayload } from '@/modules/auth/application/services/ITokenService.js';
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      requestId?: string;
    }
  }
}

export {};
