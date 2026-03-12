import type { AccessibilityPreferences } from './accessibility-preferences.interface';

export interface AccessibilityPreferencesLocalStorageRepository {
  load(): Partial<AccessibilityPreferences>;
  save(preferences: AccessibilityPreferences): void;
}
