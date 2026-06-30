export interface RefreshTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revoked?: boolean;
  createdAt?: Date;
}

export class RefreshToken {
  readonly id: string;
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
  revoked: boolean;
  readonly createdAt: Date;

  constructor(props: RefreshTokenProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.tokenHash = props.tokenHash;
    this.expiresAt = props.expiresAt;
    this.revoked = props.revoked ?? false;
    this.createdAt = props.createdAt ?? new Date();
  }

  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }

  isValid(): boolean {
    return !this.revoked && !this.isExpired();
  }

  revoke(): void {
    this.revoked = true;
  }
}
