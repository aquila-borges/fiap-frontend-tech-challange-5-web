import type { AccessibilityPreferences } from './accessibility-preferences.interface';

export interface AccessibilityPreferencesFirestoreRepository {
  loadByUserId(userId: string): Promise<AccessibilityPreferences | null>;
  saveByUserId(userId: string, preferences: AccessibilityPreferences): Promise<void>;
}
