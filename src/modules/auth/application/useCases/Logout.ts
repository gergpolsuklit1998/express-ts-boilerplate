import { IRefreshTokenRepository } from '@/modules/auth/domain/repositories/IRefreshTokenRepository.js';

interface Deps {
  refreshTokenRepository: IRefreshTokenRepository;
}

export class Logout {
  constructor(private readonly deps: Deps) {}

  async execute(userId: string): Promise<void> {
    await this.deps.refreshTokenRepository.revokeAllByUserId(userId);
  }
}
