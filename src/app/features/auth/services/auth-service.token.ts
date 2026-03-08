import { InjectionToken } from '@angular/core';
import { AuthService } from '../domain/interfaces/auth-service.interface';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>(
  'AUTH_SERVICE_TOKEN'
);
