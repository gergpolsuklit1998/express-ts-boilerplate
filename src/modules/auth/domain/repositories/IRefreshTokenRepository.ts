import { RefreshToken } from '@/modules/auth/domain/entities/RefreshToken.js';

export interface IRefreshTokenRepository {
  save(token: RefreshToken): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revokeAllByUserId(userId: string): Promise<void>;
}
