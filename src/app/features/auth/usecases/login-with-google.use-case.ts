import { inject, Injectable } from '@angular/core';
import { AuthService, AuthResult } from '../domain';
import { AUTH_SERVICE_TOKEN } from '../index';

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
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado. Tente novamente.';
      return AuthResult.failure(errorMessage);
    }
  }
}
