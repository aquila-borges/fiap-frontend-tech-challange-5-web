import { InjectionToken } from '@angular/core';
import { IAuthService } from '../../domain/interfaces/auth-service.interface';

export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthService>(
  'AUTH_SERVICE_TOKEN'
);
