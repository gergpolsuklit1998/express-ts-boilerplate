import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { NotFoundError } from '@/shared/errors/AppError.js';
import { UserOutput } from '@/modules/user/application/dto/UserDTO.js';
import { UserMapper } from '@/modules/user/application/mappers/UserMapper.js';

interface Deps {
  userRepository: IUserRepository;
}

export class GetUserById {
  constructor(private readonly deps: Deps) {}

  async execute(id: string): Promise<UserOutput> {
    const user = await this.deps.userRepository.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return UserMapper.toOutput(user);
  }
}
