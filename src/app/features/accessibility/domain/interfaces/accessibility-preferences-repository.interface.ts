import type { AccessibilityPreferences } from './accessibility-preferences.interface';

export interface AccessibilityPreferencesRepository {
  loadByUserId(userId: string): Promise<AccessibilityPreferences | null>;
  saveByUserId(userId: string, preferences: AccessibilityPreferences): Promise<void>;
}
