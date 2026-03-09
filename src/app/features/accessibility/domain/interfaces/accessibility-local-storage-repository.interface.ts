import type { AccessibilityPreferences } from './accessibility-preferences.interface';

export interface AccessibilityLocalStorageRepository {
  load(): Partial<AccessibilityPreferences>;
  save(preferences: AccessibilityPreferences): void;
}
