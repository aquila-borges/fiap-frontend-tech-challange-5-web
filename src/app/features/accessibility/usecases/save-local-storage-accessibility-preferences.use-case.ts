import { inject, Injectable } from '@angular/core';
import {
  AccessibilityPreferencesLocalStorageRepository,
  AccessibilityPreferences,
} from '../domain';
import { ACCESSIBILITY_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class SaveLocalStorageAccessibilityPreferencesUseCase {
  private readonly repository = inject<AccessibilityPreferencesLocalStorageRepository>(
    ACCESSIBILITY_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  execute(preferences: AccessibilityPreferences): void {
    this.repository.save(preferences);
  }
}
