import { User } from '@/modules/user/domain/entities/User.js';
import type { UserOutput } from '@/modules/user/application/dto/UserDTO.js';

export class UserMapper {
  static toOutput(user: User): UserOutput {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  // เผื่อในอนาคตมี output รูปแบบอื่น เช่น สำหรับ admin endpoint
  static toOutputList(users: User[]): UserOutput[] {
    return users.map(UserMapper.toOutput);
  }
}
