import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { NotFoundError } from '@/shared/errors/AppError.js';
import {
  UpdateUserInput,
  UserOutput,
} from '@/modules/user/application/dto/UserDTO.js';
import { UserMapper } from '@/modules/user/application/mappers/UserMapper.js';

interface Deps {
  userRepository: IUserRepository;
}

export class UpdateUser {
  constructor(private readonly deps: Deps) {}

  async execute(id: string, input: UpdateUserInput): Promise<UserOutput> {
    const { userRepository } = this.deps;

    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);

    user.changeName(input.name);

    await userRepository.update(user);

    return UserMapper.toOutput(user);
  }
}
