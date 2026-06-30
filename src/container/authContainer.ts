import { UserRepositoryMongo } from '@/modules/user/infrastructure/repositories/UserRepositoryMongo.js';
import { RefreshTokenRepositoryMongo } from '@/modules/auth/infrastructure/repositories/RefreshTokenRepositoryMongo.js';
import { JwtTokenService } from '@/modules/auth/infrastructure/services/JwtTokenService.js';
import { BcryptPasswordHasher } from '@/modules/auth/infrastructure/services/BcryptPasswordHasher.js';
import { Login } from '@/modules/auth/application/useCases/Login.js';
import { RefreshAccessToken } from '@/modules/auth/application/useCases/RefreshAccessToken.js';
import { Logout } from '@/modules/auth/application/useCases/Logout.js';
import { AuthController } from '@/modules/auth/presentation/controllers/AuthController.js';

export function buildAuthContainer() {
  const userRepository = new UserRepositoryMongo();
  const refreshTokenRepository = new RefreshTokenRepositoryMongo();
  const tokenService = new JwtTokenService();
  const passwordHasher = new BcryptPasswordHasher();

  const login = new Login({
    userRepository,
    refreshTokenRepository,
    tokenService,
    passwordHasher,
  });
  const refreshAccessToken = new RefreshAccessToken({
    refreshTokenRepository,
    userRepository,
    tokenService,
  });
  const logout = new Logout({ refreshTokenRepository });

  const authController = new AuthController({
    login,
    refreshAccessToken,
    logout,
  });

  return { authController };
}
