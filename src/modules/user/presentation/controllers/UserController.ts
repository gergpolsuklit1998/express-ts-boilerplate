import type { Request, Response } from 'express';
import { CreateUser } from '@/modules/user/application/useCases/CreateUser.js';
import { GetUserById } from '@/modules/user/application/useCases/GetUserById.js';
import type {
  IdParam,
  CreateUserSchemaType,
} from '@/modules/user/presentation/validators/userValidator.js';

interface Deps {
  createUser: CreateUser;
  getUserById: GetUserById;
}

export class UserController {
  constructor(private readonly deps: Deps) {}

  // ระบุ type ของ body ด้วยเลย จะได้ type-safe ทั้ง req.body และ req.params
  create = async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateUserSchemaType
    >,
    res: Response,
  ): Promise<void> => {
    const result = await this.deps.createUser.execute(req.body);
    res.status(201).json({ success: true, data: result });
  };

  getById = async (req: Request<IdParam>, res: Response): Promise<void> => {
    const result = await this.deps.getUserById.execute(req.params.id);
    res.status(200).json({ success: true, data: result });
  };
}
