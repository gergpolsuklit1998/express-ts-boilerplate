export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
}

export class User {
  readonly id: string;
  name: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;

  constructor(props: UserProps) {
    if (!props.email || !props.email.includes('@')) {
      throw new Error('Invalid email');
    }
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt ?? new Date();
  }

  changeName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Name too short');
    }
    this.name = newName;
  }
}
