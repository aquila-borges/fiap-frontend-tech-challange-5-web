import { inject, Injectable } from '@angular/core';
import { AuthService } from '../domain/interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from '../services/auth-service.token';

/**
 * Application Layer: Send Password Reset Usecase
 * Handles password recovery requests.
 */
@Injectable({
  providedIn: 'root'
})
export class SendPasswordResetUsecase {
  private authService = inject<AuthService>(AUTH_SERVICE_TOKEN);

  async execute(email: string): Promise<void> {
    await this.authService.sendPasswordResetEmail(email);
  }
}
