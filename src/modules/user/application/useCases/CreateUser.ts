import bcrypt from 'bcrypt';
import { User } from '@/modules/user/domain/entities/User.js';
import type { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { ConflictError } from '@/shared/errors/AppError.js';
import type {
  CreateUserInput,
  UserOutput,
} from '@/modules/user/application/dto/UserDTO.js';
import { UserMapper } from '@/modules/user/application/mappers/UserMapper.js';
interface IdGenerator {
  generate(): string;
}

interface Deps {
  userRepository: IUserRepository;
  idGenerator: IdGenerator;
}

export class CreateUser {
  constructor(private readonly deps: Deps) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const { userRepository, idGenerator } = this.deps;

    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError(`Email ${input.email} already exists`, {
        field: 'email',
      });
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = new User({
      id: idGenerator.generate(),
      name: input.name,
      email: input.email,
      passwordHash,
    });

    await userRepository.save(user);

    return UserMapper.toOutput(user);
  }
}
