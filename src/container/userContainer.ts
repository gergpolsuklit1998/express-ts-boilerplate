import { v4 as uuidv4 } from 'uuid';
import { UserRepositoryMongo } from '@/modules/user/infrastructure/repositories/UserRepositoryMongo.js';
import { CreateUser } from '@/modules/user/application/useCases/CreateUser.js';
import { GetUserById } from '@/modules/user/application/useCases/GetUserById.js';
import { UserController } from '@/modules/user/presentation/controllers/UserController.js';

export function buildUserContainer() {
  const userRepository = new UserRepositoryMongo();
  const idGenerator = { generate: uuidv4 };

  const createUser = new CreateUser({ userRepository, idGenerator });
  const getUserById = new GetUserById({ userRepository });

  const userController = new UserController({ createUser, getUserById });

  return { userController };
}
