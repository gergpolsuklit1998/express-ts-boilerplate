import { v4 as uuidv4 } from 'uuid';
import { UserRepositoryMongo } from '@/modules/user/infrastructure/repositories/UserRepositoryMongo.js';
import { RefreshTokenRepositoryMongo } from '@/modules/auth/infrastructure/repositories/RefreshTokenRepositoryMongo.js';
import { CreateUser } from '@/modules/user/application/useCases/CreateUser.js';
import { GetUserById } from '@/modules/user/application/useCases/GetUserById.js';
import { DeleteUser } from '@/modules/user/application/useCases/DeleteUser.js';
import { UpdateUser } from '@/modules/user/application/useCases/UpdateUser.js';
import { UserController } from '@/modules/user/presentation/controllers/UserController.js';

export function buildUserContainer() {
  const userRepository = new UserRepositoryMongo();
  const refreshTokenRepository = new RefreshTokenRepositoryMongo();
  const idGenerator = { generate: uuidv4 };

  const createUser = new CreateUser({ userRepository, idGenerator });
  const getUserById = new GetUserById({ userRepository });
  const deleteUser = new DeleteUser({ userRepository, refreshTokenRepository });
  const updateUser = new UpdateUser({ userRepository });

  const userController = new UserController({
    createUser,
    getUserById,
    deleteUser,
    updateUser,
  });

  return { userController };
}
