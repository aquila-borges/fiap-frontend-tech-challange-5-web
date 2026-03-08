/**
 * Domain Model: AuthCredentials
 * Encapsulates authentication credentials.
 * Contains pure business logic for credential validation.
 */
export class AuthCredentials {
  private readonly email: string;
  private readonly password: string;

  private constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  /**
   * Factory method to create credentials with validation.
   * Business rule: Email and password must not be empty
   */
  static create(email: string, password: string): AuthCredentials {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    return new AuthCredentials(email, password);
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }
}
