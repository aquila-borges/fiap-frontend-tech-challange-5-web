import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthCredentials, AuthResult } from '../domain/models/auth-credentials';

/**
 * Application Layer: Login Usecase
 * Orchestrates the login business logic.
 * Coordinates between domain models and infrastructure services.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginUsecase {
  private authService = inject(AuthService);

  async execute(email: string, password: string): Promise<AuthResult> {
    try {
      // Create domain model with validation
      const credentials = AuthCredentials.create(email, password);

      // Call infrastructure service
      const userCredential = await this.authService.login(
        credentials.getEmail(),
        credentials.getPassword()
      );

      // Return domain result
      if (userCredential.user.uid) {
        return AuthResult.success(userCredential.user.uid);
      }

      return AuthResult.failure('Login failed: No user ID returned');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      return AuthResult.failure(errorMessage);
    }
  }
}
