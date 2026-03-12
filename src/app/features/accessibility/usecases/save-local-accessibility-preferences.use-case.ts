import { inject, Injectable } from '@angular/core';
import {
  AccessibilityLocalStorageRepository,
  AccessibilityPreferences,
} from '../domain';
import { ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class SaveLocalAccessibilityPreferencesUseCase {
  private readonly repository = inject<AccessibilityLocalStorageRepository>(
    ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  execute(preferences: AccessibilityPreferences): void {
    this.repository.save(preferences);
  }
}
