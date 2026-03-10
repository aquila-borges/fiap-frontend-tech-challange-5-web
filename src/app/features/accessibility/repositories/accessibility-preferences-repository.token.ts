import { inject, InjectionToken } from '@angular/core';
import { AccessibilityPreferencesRepository } from '../domain';
import { AccessibilityPreferencesRepositoryImpl } from './accessibility-preferences.repository';

export const ACCESSIBILITY_PREFERENCES_REPOSITORY_TOKEN =
  new InjectionToken<AccessibilityPreferencesRepository>(
    'ACCESSIBILITY_PREFERENCES_REPOSITORY_TOKEN',
    {
      factory: () => inject(AccessibilityPreferencesRepositoryImpl),
    }
  );