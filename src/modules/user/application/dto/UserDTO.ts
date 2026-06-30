import { UserRole } from '@/shared/constants/userRole.js';
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name: string;
}

export interface UserOutput {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
