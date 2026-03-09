import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  AccessibilityPreferences,
  AccessibilityPreferencesRepository,
} from '../../domain';
import { FIREBASE_FIRESTORE_TOKEN } from '../../../../core';
import { ACCESSIBILITY_FIRESTORE_PATH } from '../constants/accessibility-firestore.const';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityPreferencesRepositoryImpl implements AccessibilityPreferencesRepository
{
  private readonly firestore = inject<Firestore>(FIREBASE_FIRESTORE_TOKEN);

  async loadByUserId(userId: string): Promise<AccessibilityPreferences | null> {
    const accessibilityDocRef = doc(
      this.firestore,
      ACCESSIBILITY_FIRESTORE_PATH.usersCollection,
      userId,
      ACCESSIBILITY_FIRESTORE_PATH.preferencesCollection,
      ACCESSIBILITY_FIRESTORE_PATH.accessibilityDocument
    );
    const snapshot = await getDoc(accessibilityDocRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      fontScale: Number(data['fontScale'] ?? 100),
      useAccessibleFont: Boolean(data['useAccessibleFont']),
      widgetScaled: Boolean(data['widgetScaled']),
      lineHeight: Number(data['lineHeight'] ?? 1),
      textSpacingLevel: Number(data['textSpacingLevel'] ?? 0),
      reducedMotionEnabled: Boolean(data['reducedMotionEnabled']),
      saturationLevel: Number(data['saturationLevel'] ?? 0),
      contrastLevel: Number(data['contrastLevel'] ?? 0),
    };
  }

  async saveByUserId(
    userId: string,
    preferences: AccessibilityPreferences
  ): Promise<void> {
    const accessibilityDocRef = doc(
      this.firestore,
      ACCESSIBILITY_FIRESTORE_PATH.usersCollection,
      userId,
      ACCESSIBILITY_FIRESTORE_PATH.preferencesCollection,
      ACCESSIBILITY_FIRESTORE_PATH.accessibilityDocument
    );

    await setDoc(
      accessibilityDocRef,
      {
        ...preferences,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
