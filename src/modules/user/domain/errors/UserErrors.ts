export class UserNotFoundError extends Error {
  statusCode = 404;
  constructor(id: string) {
    super(`User ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class DuplicateEmailError extends Error {
  statusCode = 409;
  constructor(email: string) {
    super(`Email ${email} already exists`);
    this.name = 'DuplicateEmailError';
  }
}
