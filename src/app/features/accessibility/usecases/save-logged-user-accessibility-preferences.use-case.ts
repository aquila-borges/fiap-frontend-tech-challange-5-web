import { inject, Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';
import { FIREBASE_AUTH_TOKEN } from '../../../core';
import {
  AccessibilityPreferences,
  AccessibilityPreferencesRepository,
  ACCESSIBILITY_PREFERENCES_REPOSITORY_TOKEN,
} from '../index';

@Injectable({
  providedIn: 'root',
})
export class SaveLoggedUserAccessibilityPreferencesUseCase {
  private readonly auth = inject<Auth>(FIREBASE_AUTH_TOKEN);
  private readonly repository = inject<AccessibilityPreferencesRepository>(
    ACCESSIBILITY_PREFERENCES_REPOSITORY_TOKEN
  );

  async execute(preferences: AccessibilityPreferences): Promise<void> {
    const userId = this.auth.currentUser?.uid;

    if (!userId) {
      return;
    }

    await this.repository.saveByUserId(userId, preferences);
  }
}
