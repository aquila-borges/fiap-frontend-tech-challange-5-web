import { inject, InjectionToken } from '@angular/core';
import { AccessibilityPreferencesLocalStorageRepository } from '../../domain';
import { AccessibilityPreferencesLocalStorageRepositoryImpl } from './accessibility-preferences-local-storage.repository';

export const ACCESSIBILITY_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN =
  new InjectionToken<AccessibilityPreferencesLocalStorageRepository>(
    'ACCESSIBILITY_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN',
    {
      factory: () => inject(AccessibilityPreferencesLocalStorageRepositoryImpl),
    }
  );