import { Injectable } from '@angular/core';
import {
  AccessibilityPreferences,
  AccessibilityPreferencesLocalStorageRepository,
} from '../../domain';

const ACCESSIBILITY_STORAGE_KEYS = {
  fontScale: 'fontScale',
  useAccessibleFont: 'useAccessibleFont',
  widgetScaled: 'widgetScaled',
  lineHeight: 'lineHeight',
  textSpacingLevel: 'textSpacingLevel',
  reducedMotionEnabled: 'reducedMotionEnabled',
  saturationLevel: 'saturationLevel',
  contrastLevel: 'contrastLevel',
};

@Injectable({ providedIn: 'root' })
export class AccessibilityPreferencesLocalStorageRepositoryImpl
  implements AccessibilityPreferencesLocalStorageRepository
{
  save(preferences: AccessibilityPreferences): void {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEYS.fontScale, String(preferences.fontScale));
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.useAccessibleFont,
      String(preferences.useAccessibleFont)
    );
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.widgetScaled,
      String(preferences.widgetScaled)
    );
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.lineHeight,
      String(preferences.lineHeight)
    );
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.textSpacingLevel,
      String(preferences.textSpacingLevel)
    );
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.reducedMotionEnabled,
      String(preferences.reducedMotionEnabled)
    );
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.saturationLevel,
      String(preferences.saturationLevel)
    );
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEYS.contrastLevel,
      String(preferences.contrastLevel)
    );
  }

  load(): Partial<AccessibilityPreferences> {
    const fontScale = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.fontScale);
    const useAccessibleFont = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.useAccessibleFont);
    const widgetScaled = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.widgetScaled);
    const lineHeight = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.lineHeight);
    const textSpacingLevel = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.textSpacingLevel);
    const reducedMotionEnabled = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.reducedMotionEnabled);
    const saturationLevel = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.saturationLevel);
    const contrastLevel = localStorage.getItem(ACCESSIBILITY_STORAGE_KEYS.contrastLevel);

    return {
      ...(fontScale && { fontScale: Number(fontScale) }),
      ...(useAccessibleFont && { useAccessibleFont: useAccessibleFont === 'true' }),
      ...(widgetScaled && { widgetScaled: widgetScaled === 'true' }),
      ...(lineHeight && { lineHeight: Number(lineHeight) }),
      ...(textSpacingLevel && { textSpacingLevel: Number(textSpacingLevel) }),
      ...(reducedMotionEnabled && { reducedMotionEnabled: reducedMotionEnabled === 'true' }),
      ...(saturationLevel && { saturationLevel: Number(saturationLevel) }),
      ...(contrastLevel && { contrastLevel: Number(contrastLevel) }),
    };
  }
}