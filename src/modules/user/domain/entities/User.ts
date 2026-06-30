import { USER_ROLE, UserRole } from '@/shared/constants/userRole.js';
export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  createdAt?: Date;
}

export class User {
  readonly id: string;
  name: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly createdAt: Date;

  constructor(props: UserProps) {
    if (!props.email || !props.email.includes('@')) {
      throw new Error('Invalid email');
    }
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role ?? USER_ROLE.MEMBER;
    this.createdAt = props.createdAt ?? new Date();
  }

  changeName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Name too short');
    }
    this.name = newName;
  }
}
