import { inject, Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';
import { FIREBASE_AUTH_TOKEN } from '../../../core';
import {
  AccessibilityPreferences,
  AccessibilityPreferencesFirestoreRepository,
  ACCESSIBILITY_PREFERENCES_FIRESTORE_REPOSITORY_TOKEN,
} from '../index';

@Injectable({
  providedIn: 'root',
})
export class LoadLoggedUserFirestoreAccessibilityPreferencesUseCase {
  private readonly auth = inject<Auth>(FIREBASE_AUTH_TOKEN);
  private readonly repository = inject<AccessibilityPreferencesFirestoreRepository>(
    ACCESSIBILITY_PREFERENCES_FIRESTORE_REPOSITORY_TOKEN
  );

  async execute(): Promise<AccessibilityPreferences | null> {
    const userId = this.auth.currentUser?.uid;

    if (!userId) {
      return null;
    }

    return this.repository.loadByUserId(userId);
  }
}
