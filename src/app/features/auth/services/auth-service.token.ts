import { InjectionToken } from '@angular/core';
import { AuthService } from '../domain';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>(
  'AUTH_SERVICE_TOKEN'
);
