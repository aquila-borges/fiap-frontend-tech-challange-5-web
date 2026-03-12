import { inject, Injectable } from '@angular/core';
import {
  AccessibilityPreferencesLocalStorageRepository,
  AccessibilityPreferences,
} from '../domain';
import { ACCESSIBILITY_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class LoadLocalStorageAccessibilityPreferencesUseCase {
  private readonly repository = inject<AccessibilityPreferencesLocalStorageRepository>(
    ACCESSIBILITY_PREFERENCES_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  execute(): Partial<AccessibilityPreferences> {
    return this.repository.load();
  }
}
