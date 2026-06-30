import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { NotFoundError } from '@/shared/errors/AppError.js';
import { IRefreshTokenRepository } from '@/modules/auth/domain/repositories/IRefreshTokenRepository.js';

interface Deps {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
}

export class DeleteUser {
  constructor(private readonly deps: Deps) {}

  async execute(id: string): Promise<void> {
    const { userRepository, refreshTokenRepository } = this.deps;

    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);

    await userRepository.delete(id);

    // revoke refresh token ทั้งหมดของ user นี้ด้วย กัน token เก่ายังใช้ login ได้หลังถูกลบ
    await refreshTokenRepository.revokeAllByUserId(id);
  }
}
