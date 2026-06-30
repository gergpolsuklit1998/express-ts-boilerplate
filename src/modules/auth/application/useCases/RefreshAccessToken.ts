import crypto from 'crypto';
import { IRefreshTokenRepository } from '@/modules/auth/domain/repositories/IRefreshTokenRepository.js';
import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { ITokenService } from '@/modules/auth/application/services/ITokenService.js';
import { InvalidRefreshTokenError } from '@/modules/auth/domain/errors/AuthErrors.js';
import {
  RefreshTokenInput,
  RefreshTokenOutput,
} from '@/modules/auth/application/dto/AuthDTO.js';

interface Deps {
  refreshTokenRepository: IRefreshTokenRepository;
  userRepository: IUserRepository;
  tokenService: ITokenService;
}

export class RefreshAccessToken {
  constructor(private readonly deps: Deps) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const { refreshTokenRepository, userRepository, tokenService } = this.deps;

    // verify signature/expiry ของ JWT ก่อน
    let payload;
    try {
      payload = tokenService.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new InvalidRefreshTokenError();
    }

    // เช็คใน DB ว่า token นี้ยังไม่ถูก revoke (รองรับ logout/security revoke)
    const tokenHash = crypto
      .createHash('sha256')
      .update(input.refreshToken)
      .digest('hex');
    const storedToken = await refreshTokenRepository.findByTokenHash(tokenHash);
    if (!storedToken || !storedToken.isValid()) {
      throw new InvalidRefreshTokenError();
    }

    const user = await userRepository.findById(payload.userId);
    if (!user) throw new InvalidRefreshTokenError();

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = tokenService.signAccessToken(newPayload);
    const newRefreshToken = tokenService.signRefreshToken(newPayload);

    // revoke token เก่า แล้วออกใหม่ (rotation) — ลด risk ถ้า token หลุด
    storedToken.revoke();
    await refreshTokenRepository.save(storedToken);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
