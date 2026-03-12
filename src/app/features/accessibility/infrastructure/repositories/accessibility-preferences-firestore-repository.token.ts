import { inject, InjectionToken } from '@angular/core';
import { AccessibilityPreferencesFirestoreRepository } from '../../domain';
import { AccessibilityPreferencesFirestoreRepositoryImpl } from './accessibility-preferences-firestore.repository';

export const ACCESSIBILITY_PREFERENCES_FIRESTORE_REPOSITORY_TOKEN =
  new InjectionToken<AccessibilityPreferencesFirestoreRepository>(
    'ACCESSIBILITY_PREFERENCES_FIRESTORE_REPOSITORY_TOKEN',
    {
      factory: () => inject(AccessibilityPreferencesFirestoreRepositoryImpl),
    }
  );
