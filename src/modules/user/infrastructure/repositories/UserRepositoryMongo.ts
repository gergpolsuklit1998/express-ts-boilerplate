import type { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository.js';
import { User } from '@/modules/user/domain/entities/User.js';
import { UserModel } from '@/modules/user/infrastructure/models/UserModel.js';

export class UserRepositoryMongo implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async save(user: User): Promise<void> {
    await UserModel.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  private toEntity(doc: {
    _id: { toString: () => string };
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
  }): User {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt,
    });
  }
}
