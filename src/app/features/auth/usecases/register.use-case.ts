import { inject, Injectable } from '@angular/core';
import { AuthService, AuthCredentials, AuthResult } from '../domain';
import { AUTH_SERVICE_TOKEN } from '../index';

/**
 * Application Layer: Register Usecase
 * Orchestrates the registration business logic.
 * Coordinates between domain models and infrastructure services.
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterUsecase {
  private authService = inject<AuthService>(AUTH_SERVICE_TOKEN);

  async execute(email: string, password: string): Promise<AuthResult> {
    try {
      // Create domain model with validation
      const credentials = AuthCredentials.create(email, password);

      // Call infrastructure service
      const user = await this.authService.register(credentials);
      return AuthResult.success(user);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado. Tente novamente.';
      return AuthResult.failure(errorMessage);
    }
  }
}
