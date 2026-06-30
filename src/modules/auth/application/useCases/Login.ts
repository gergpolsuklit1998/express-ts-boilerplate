import { randomUUID } from 'crypto';
import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { IRefreshTokenRepository } from '@/modules/auth/domain/repositories/IRefreshTokenRepository.js';
import { ITokenService } from '@/modules/auth/application/services/ITokenService.js';
import { IPasswordHasher } from '@/modules/auth/application/services/IPasswordHasher.js';
import { InvalidCredentialsError } from '@/modules/auth/domain/errors/AuthErrors.js';
import { RefreshToken } from '@/modules/auth/domain/entities/RefreshToken.js';
import {
  LoginInput,
  LoginOutput,
} from '@/modules/auth/application/dto/AuthDTO.js';
import crypto from 'crypto';

interface Deps {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  tokenService: ITokenService;
  passwordHasher: IPasswordHasher;
}

export class Login {
  constructor(private readonly deps: Deps) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const {
      userRepository,
      refreshTokenRepository,
      tokenService,
      passwordHasher,
    } = this.deps;

    const user = await userRepository.findByEmail(input.email);
    if (!user) throw new InvalidCredentialsError();

    const isValidPassword = await passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isValidPassword) throw new InvalidCredentialsError();

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = tokenService.signAccessToken(payload);
    const refreshTokenValue = tokenService.signRefreshToken(payload);

    // เก็บ hash ของ refresh token ไว้ใน DB เพื่อให้ revoke ได้ทีหลัง (logout, security incident)
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshTokenValue)
      .digest('hex');
    const refreshToken = new RefreshToken({
      id: randomUUID(),
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
    });
    await refreshTokenRepository.save(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
