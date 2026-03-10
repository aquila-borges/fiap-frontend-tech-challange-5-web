import { inject, InjectionToken } from '@angular/core';
import { AccessibilityService } from '../domain';
import { AccessibilityServiceImpl } from './accessibility.service';

export const ACCESSIBILITY_SERVICE_TOKEN = new InjectionToken<AccessibilityService>(
  'ACCESSIBILITY_SERVICE_TOKEN',
  {
    factory: () => inject(AccessibilityServiceImpl),
  }
);