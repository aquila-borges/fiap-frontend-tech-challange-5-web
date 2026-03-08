import { inject, Injectable } from '@angular/core';
import { IAuthService } from '../domain/interfaces/auth-service.interface';
import { AuthCredentials, AuthResult } from '../domain/models/auth-credentials';
import { AUTH_SERVICE_TOKEN } from '../services/tokens/auth-service.token';

/**
 * Application Layer: Register Usecase
 * Orchestrates the registration business logic.
 * Coordinates between domain models and infrastructure services.
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterUsecase {
  private authService = inject<IAuthService>(AUTH_SERVICE_TOKEN);

  async execute(email: string, password: string): Promise<AuthResult> {
    try {
      // Create domain model with validation
      const credentials = AuthCredentials.create(email, password);

      // Call infrastructure service
      const user = await this.authService.register(credentials);
      return AuthResult.success(user);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      return AuthResult.failure(errorMessage);
    }
  }
}
