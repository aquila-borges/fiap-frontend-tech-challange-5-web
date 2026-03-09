import { inject, InjectionToken } from '@angular/core';
import { AuthService } from '../domain';
import { AuthServiceImpl } from './auth.service';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>(
  'AUTH_SERVICE_TOKEN',
  {
    factory: () => inject(AuthServiceImpl),
  }
);
