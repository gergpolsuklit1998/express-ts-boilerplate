import bcrypt from 'bcrypt';
import { IPasswordHasher } from '@/modules/auth/application/services/IPasswordHasher.js';

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
