import { inject, Injectable } from '@angular/core';
import { AuthService } from '../domain/interfaces/auth-service.interface';
import { AuthResult } from '../domain/models/auth-result.model';
import { AUTH_SERVICE_TOKEN } from '../services/auth-service.token';

/**
 * Application Layer: Login With Google Usecase
 * Orchestrates Google OAuth authentication flow.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginWithGoogleUsecase {
  private authService = inject<AuthService>(AUTH_SERVICE_TOKEN);

  async execute(): Promise<AuthResult> {
    try {
      const user = await this.authService.loginWithGoogle();
      return AuthResult.success(user);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      return AuthResult.failure(errorMessage);
    }
  }
}
