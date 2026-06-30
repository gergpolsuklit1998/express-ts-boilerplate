import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { User } from '@/modules/user/domain/entities/User.js';
import { UserModel } from '@/modules/user/infrastructure/models/UserModel.js';
import { UserRole } from '@/shared/constants/userRole.js';

export class UserRepositoryMongo implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ id }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await UserModel.deleteOne({ id });
  }

  async update(user: User): Promise<void> {
    await UserModel.updateOne(
      { id: user.id },
      {
        $set: {
          name: user.name,
        },
      },
    );
  }

  private toEntity(doc: {
    id: { toString: () => string };
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
  }): User {
    return new User({
      id: doc.id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      createdAt: doc.createdAt,
    });
  }
}
