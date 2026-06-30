import jwt from 'jsonwebtoken';
import {
  ITokenService,
  TokenPayload,
} from '@/modules/auth/application/services/ITokenService.js';
import { config } from '@/shared/config/env.js';

export class JwtTokenService implements ITokenService {
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  }

  signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
  }
}
