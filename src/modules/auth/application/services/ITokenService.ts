import { UserRole } from '@/shared/constants/userRole.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ITokenService {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
