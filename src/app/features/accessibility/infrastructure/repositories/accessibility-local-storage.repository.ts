import { Injectable } from '@angular/core';
import type {
  AccessibilityLocalStorageRepository,
  AccessibilityPreferences,
} from '../../domain';
import { ACCESSIBILITY_STORAGE_KEYS } from '../constants/accessibility-storage-keys.const';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityLocalStorageRepositoryImpl
  implements AccessibilityLocalStorageRepository
{
  load(): Partial<AccessibilityPreferences> {
    const preferences: Partial<AccessibilityPreferences> = {};

    const fontScale = this.readNumber(ACCESSIBILITY_STORAGE_KEYS.fontScale);
    if (fontScale !== null) {
      preferences.fontScale = fontScale;
    }

    const useAccessibleFont = this.readBoolean(ACCESSIBILITY_STORAGE_KEYS.accessibleFont);
    if (useAccessibleFont !== null) {
      preferences.useAccessibleFont = useAccessibleFont;
    }

    const widgetScaled = this.readBoolean(ACCESSIBILITY_STORAGE_KEYS.widgetScale);
    if (widgetScaled !== null) {
      preferences.widgetScaled = widgetScaled;
    }

    const lineHeight = this.readNumber(ACCESSIBILITY_STORAGE_KEYS.lineHeight);
    if (lineHeight !== null) {
      preferences.lineHeight = lineHeight;
    }

    const textSpacingLevel = this.readNumber(ACCESSIBILITY_STORAGE_KEYS.textSpacing);
    if (textSpacingLevel !== null) {
      preferences.textSpacingLevel = textSpacingLevel;
    }

    const reducedMotionEnabled = this.readBoolean(ACCESSIBILITY_STORAGE_KEYS.reducedMotion);
    if (reducedMotionEnabled !== null) {
      preferences.reducedMotionEnabled = reducedMotionEnabled;
    }

    const saturationLevel = this.readNumber(ACCESSIBILITY_STORAGE_KEYS.saturation);
    if (saturationLevel !== null) {
      preferences.saturationLevel = saturationLevel;
    }

    const contrastLevel = this.readNumber(ACCESSIBILITY_STORAGE_KEYS.contrast);
    if (contrastLevel !== null) {
      preferences.contrastLevel = contrastLevel;
    }

    return preferences;
  }

  save(preferences: AccessibilityPreferences): void {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEYS.fontScale, String(preferences.fontScale));
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.accessibleFont,
      String(preferences.useAccessibleFont)
    );
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEYS.widgetScale, String(preferences.widgetScaled));
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEYS.lineHeight, String(preferences.lineHeight));
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.textSpacing,
      String(preferences.textSpacingLevel)
    );
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.reducedMotion,
      String(preferences.reducedMotionEnabled)
    );
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEYS.saturation, String(preferences.saturationLevel));
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEYS.contrast, String(preferences.contrastLevel));
  }

  private readBoolean(key: string): boolean | null {
    const value = localStorage.getItem(key);
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return null;
  }

  private readNumber(key: string): number | null {
    const value = Number(localStorage.getItem(key));

    if (!Number.isFinite(value)) {
      return null;
    }

    return value;
  }
}
