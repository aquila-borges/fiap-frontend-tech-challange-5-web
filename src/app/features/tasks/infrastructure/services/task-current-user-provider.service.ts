import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../auth/domain';
import { AUTH_SERVICE_TOKEN } from '../../../auth';
import { TaskCurrentUserProvider } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class TaskCurrentUserProviderServiceImpl implements TaskCurrentUserProvider {
  private readonly authService = inject<AuthService>(AUTH_SERVICE_TOKEN);

  getCurrentUserId(): string | null {
    return this.authService.getCurrentUser()?.id ?? null;
  }
}