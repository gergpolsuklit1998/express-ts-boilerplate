import { IRefreshTokenRepository } from '@/modules/auth/domain/repositories/IRefreshTokenRepository.js';
import { RefreshToken } from '@/modules/auth/domain/entities/RefreshToken.js';
import { RefreshTokenModel } from '@/modules/auth/infrastructure/models/RefreshTokenModel.js';

export class RefreshTokenRepositoryMongo implements IRefreshTokenRepository {
  async save(token: RefreshToken): Promise<void> {
    await RefreshTokenModel.updateOne(
      { id: token.id },
      {
        id: token.id,
        userId: token.userId,
        tokenHash: token.tokenHash,
        expiresAt: token.expiresAt,
        revoked: token.revoked,
        createdAt: token.createdAt,
      },
      { upsert: true },
    );
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const doc = await RefreshTokenModel.findOne({ tokenHash }).lean();
    if (!doc) return null;
    return new RefreshToken({
      id: doc.id,
      userId: doc.userId,
      tokenHash: doc.tokenHash,
      expiresAt: doc.expiresAt,
      revoked: doc.revoked,
      createdAt: doc.createdAt,
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await RefreshTokenModel.updateMany({ userId }, { revoked: true });
  }
}
