import { inject, Injectable } from '@angular/core';
import {
  AccessibilityLocalStorageRepository,
  AccessibilityPreferences,
} from '../domain';
import { ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../repositories';

@Injectable({
  providedIn: 'root',
})
export class LoadLocalAccessibilityPreferencesUseCase {
  private readonly repository = inject<AccessibilityLocalStorageRepository>(
    ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  execute(): Partial<AccessibilityPreferences> {
    return this.repository.load();
  }
}
