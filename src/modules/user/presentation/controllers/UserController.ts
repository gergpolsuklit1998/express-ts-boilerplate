import { Request, Response } from 'express';
import { CreateUser } from '@/modules/user/application/useCases/CreateUser.js';
import { GetUserById } from '@/modules/user/application/useCases/GetUserById.js';
import { DeleteUser } from '@/modules/user/application/useCases/DeleteUser.js';
import { UpdateUser } from '../../application/useCases/UpdateUser.js';
import {
  IdParam,
  CreateUserSchemaType,
  UpdateUserSchemaType,
} from '@/modules/user/presentation/validators/userValidator.js';
import { UnauthorizedError } from '@/shared/errors/AppError.js';

interface Deps {
  createUser: CreateUser;
  getUserById: GetUserById;
  deleteUser: DeleteUser;
  updateUser: UpdateUser;
}

export class UserController {
  constructor(private readonly deps: Deps) {}

  // ระบุ type ของ body ด้วยเลย จะได้ type-safe ทั้ง req.body และ req.params
  create = async (
    req: Request<CreateUserSchemaType>,
    res: Response,
  ): Promise<void> => {
    const result = await this.deps.createUser.execute(req.body);
    res.status(201).json({ success: true, data: result });
  };

  getById = async (req: Request<IdParam>, res: Response): Promise<void> => {
    const result = await this.deps.getUserById.execute(req.params.id);
    res.status(200).json({ success: true, data: result });
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const result = await this.deps.getUserById.execute(req.user.userId);
    res.status(200).json({ success: true, data: result });
  };

  delete = async (req: Request<IdParam>, res: Response): Promise<void> => {
    await this.deps.deleteUser.execute(req.params.id);
    res.status(200).json({ success: true });
  };

  deleteMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new UnauthorizedError('Authentication required');
    await this.deps.deleteUser.execute(req.user.userId);
    res.status(200).json({ success: true });
  };

  update = async (
    req: Request<IdParam, UpdateUserSchemaType>,
    res: Response,
  ): Promise<void> => {
    const result = await this.deps.updateUser.execute(req.params.id, req.body);
    res.status(200).json({ success: true, data: result });
  };
}
