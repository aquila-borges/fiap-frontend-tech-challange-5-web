import { User } from '../entities/user.interface';

/**
 * Domain model that encapsulates the result of an authentication operation.
 */
export class AuthResult {
  private constructor(
    readonly success: boolean,
    readonly user?: User,
    readonly error?: string
  ) {}

  static success(user: User): AuthResult {
    return new AuthResult(true, user);
  }

  static failure(error: string): AuthResult {
    return new AuthResult(false, undefined, error);
  }

  isSuccess(): boolean {
    return this.success;
  }

  getError(): string | undefined {
    return this.error;
  }

  getUser(): User | undefined {
    return this.user;
  }

  getUserId(): string | undefined {
    return this.user?.id;
  }
}
