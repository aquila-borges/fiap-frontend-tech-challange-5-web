import { InjectionToken } from '@angular/core';
import { AccessibilityService } from '../domain/interfaces/accessibility-service.interface';

export const ACCESSIBILITY_SERVICE_TOKEN = new InjectionToken<AccessibilityService>(
  'ACCESSIBILITY_SERVICE_TOKEN'
);
