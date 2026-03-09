import { inject, Injectable } from '@angular/core';
import { AuthService, AuthResult, AUTH_SERVICE_TOKEN } from '../domain';

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
