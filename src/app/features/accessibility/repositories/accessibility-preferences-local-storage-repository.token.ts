import { inject, InjectionToken } from '@angular/core';
import { AccessibilityLocalStorageRepository } from '../domain';
import { AccessibilityLocalStorageRepositoryImpl } from './accessibility-preferences-local-storage.repository';

export const ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN =
  new InjectionToken<AccessibilityLocalStorageRepository>(
    'ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN',
    {
      factory: () => inject(AccessibilityLocalStorageRepositoryImpl),
    }
  );