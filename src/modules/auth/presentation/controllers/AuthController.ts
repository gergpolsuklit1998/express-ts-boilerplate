import { Request, Response } from 'express';
import { Login } from '@/modules/auth/application/useCases/Login.js';
import { RefreshAccessToken } from '@/modules/auth/application/useCases/RefreshAccessToken.js';
import { Logout } from '@/modules/auth/application/useCases/Logout.js';
import {
  LoginSchemaType,
  RefreshTokenSchemaType,
} from '@/modules/auth/presentation/validators/authValidator.js';

interface Deps {
  login: Login;
  refreshAccessToken: RefreshAccessToken;
  logout: Logout;
}

export class AuthController {
  constructor(private readonly deps: Deps) {}

  login = async (
    req: Request<Record<string, never>, Record<string, never>, LoginSchemaType>,
    res: Response,
  ): Promise<void> => {
    const result = await this.deps.login.execute(req.body);
    res.status(200).json({ success: true, data: result });
  };

  refresh = async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      RefreshTokenSchemaType
    >,
    res: Response,
  ): Promise<void> => {
    const result = await this.deps.refreshAccessToken.execute(req.body);
    res.status(200).json({ success: true, data: result });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    // req.user มาจาก authenticate middleware (ต้อง login ก่อนถึง logout ได้)
    await this.deps.logout.execute(req.user!.userId);
    res.status(200).json({ success: true, data: { message: 'Logged out' } });
  };
}
