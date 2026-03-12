import { inject, Injectable, signal } from '@angular/core';
import {
  AccessibilityConfig,
  FontScale,
  LineHeight,
  TextSpacingLevel,
  SaturationLevel,
  ContrastLevel,
} from '../../domain';
import type {
  AccessibilityService,
  AccessibilityPreferences,
  AccessibilityDomRenderer,
} from '../../domain';
import { ACCESSIBILITY_DOM_RENDERER_TOKEN } from './accessibility-dom-renderer.token';
import {
  LoadLocalStorageAccessibilityPreferencesUseCase,
  SaveLocalStorageAccessibilityPreferencesUseCase,
} from '../../usecases';

/**
 * Implementação do serviço de acessibilidade seguindo Clean Architecture.
 * Responsável por manter estado (signals) e coordenar operações entre domain models e renderer.
 * - Lógica de negócio: delegada para domain models (FontScale, LineHeight, etc)
 * - Manipulação DOM: delegada para AccessibilityDomRenderer
 * - Persistência local: delegada para use cases da camada de aplicação
 */
@Injectable({
  providedIn: 'root',
})
export class AccessibilityServiceImpl implements AccessibilityService {
  // Dependencies
  private readonly domRenderer = inject<AccessibilityDomRenderer>(ACCESSIBILITY_DOM_RENDERER_TOKEN);
  private readonly loadLocalPreferences = inject(LoadLocalStorageAccessibilityPreferencesUseCase);
  private readonly saveLocalPreferences = inject(SaveLocalStorageAccessibilityPreferencesUseCase);

  // Signals (state)
  readonly fontScale = signal<number>(AccessibilityConfig.SCALE_STEPS[0]);
  readonly useAccessibleFont = signal<boolean>(false);
  readonly widgetScaled = signal<boolean>(false);
  readonly lineHeight = signal<number>(AccessibilityConfig.LINE_HEIGHT_OPTIONS[0]);
  readonly textSpacingLevel = signal<number>(0);
  readonly reducedMotionEnabled = signal<boolean>(this.getSystemReducedMotionPreference());
  readonly saturationLevel = signal<number>(0);
  readonly contrastLevel = signal<number>(0);
  readonly isPanelOpen = signal<boolean>(false);

  constructor() {
    this.restorePreferencesFromLocalStorage();
    this.applyPreferences(this.getCurrentPreferences());
  }

  // Configuration getters (delegam para AccessibilityConfig)
  getScaleSteps(): readonly number[] {
    return AccessibilityConfig.SCALE_STEPS;
  }

  getLineHeightOptions(): readonly number[] {
    return AccessibilityConfig.LINE_HEIGHT_OPTIONS;
  }

  getTextSpacingPresets() {
    return AccessibilityConfig.TEXT_SPACING_PRESETS;
  }

  // Font scale operations (lógica em domain models, renderização em renderer)
  increaseFontSize(): void {
    const current = this.fontScale();
    const nextScale = FontScale.getNextStep(current);

    if (!nextScale) {
      return;
    }

    this.fontScale.set(nextScale);
    this.domRenderer.applyFontScale(nextScale);
    this.persistToLocalStorage();
  }

  decreaseFontSize(): void {
    const current = this.fontScale();
    const previousScale = FontScale.getPreviousStep(current);

    if (!previousScale) {
      return;
    }

    this.fontScale.set(previousScale);
    this.domRenderer.applyFontScale(previousScale);
    this.persistToLocalStorage();
  }

  isFontScaleAtMax(): boolean {
    return FontScale.isAtMax(this.fontScale());
  }

  isFontScaleAtMin(): boolean {
    return FontScale.isAtMin(this.fontScale());
  }

  // Accessibility toggles
  toggleAccessibleFont(): void {
    const newValue = !this.useAccessibleFont();
    this.useAccessibleFont.set(newValue);
    this.domRenderer.applyAccessibleFont(newValue);
    this.persistToLocalStorage();
  }

  toggleWidgetScale(): void {
    const newValue = !this.widgetScaled();
    this.widgetScaled.set(newValue);
    this.persistToLocalStorage();
  }

  // Line height operations (lógica em domain models)
  cycleLineHeight(): void {
    const current = this.lineHeight();
    const nextValue = LineHeight.getNextValue(current);

    this.lineHeight.set(nextValue);
    this.domRenderer.applyLineHeight(nextValue);
    this.persistToLocalStorage();
  }

  isCustomLineHeightActive(): boolean {
    return LineHeight.isCustom(this.lineHeight());
  }

  // Text spacing operations (lógica em domain models)
  cycleTextSpacing(): void {
    const current = this.textSpacingLevel();
    const nextLevel = TextSpacingLevel.getNextLevel(current);
    const preset = TextSpacingLevel.getPreset(nextLevel);

    this.textSpacingLevel.set(nextLevel);
    this.domRenderer.applyTextSpacing(preset);
    this.persistToLocalStorage();
  }

  isCustomTextSpacingActive(): boolean {
    return TextSpacingLevel.isCustom(this.textSpacingLevel());
  }

  getTextSpacingLabel(): string {
    return TextSpacingLevel.getLabel(this.textSpacingLevel());
  }

  // Saturation operations (lógica em domain models)
  cycleSaturation(): void {
    const current = this.saturationLevel();
    const nextLevel = SaturationLevel.getNextLevel(current);
    const saturationValue = SaturationLevel.getValue(nextLevel);

    this.saturationLevel.set(nextLevel);
    this.domRenderer.applySaturation(saturationValue);
    this.persistToLocalStorage();
  }

  isCustomSaturationActive(): boolean {
    return SaturationLevel.isCustom(this.saturationLevel());
  }

  getSaturationLabel(): string {
    return SaturationLevel.getLabel(this.saturationLevel());
  }

  // Contrast operations (lógica em domain models)
  cycleContrast(): void {
    const current = this.contrastLevel();
    const nextLevel = ContrastLevel.getNextLevel(current);
    const isHighContrast = nextLevel === 1;

    this.contrastLevel.set(nextLevel);
    this.domRenderer.applyContrast(isHighContrast);
    this.persistToLocalStorage();
  }

  isCustomContrastActive(): boolean {
    return ContrastLevel.isCustom(this.contrastLevel());
  }

  getContrastLabel(): string {
    return ContrastLevel.getLabel(this.contrastLevel());
  }

  // Motion controls
  toggleReducedMotion(): void {
    const newValue = !this.reducedMotionEnabled();
    this.reducedMotionEnabled.set(newValue);
    this.domRenderer.applyReducedMotion(newValue);
    this.persistToLocalStorage();
  }

  // General operations
  resetAllSettings(): void {
    const defaultScale = AccessibilityConfig.SCALE_STEPS[0];
    this.fontScale.set(defaultScale);
    this.domRenderer.applyFontScale(defaultScale);

    this.useAccessibleFont.set(false);
    this.domRenderer.applyAccessibleFont(false);

    this.widgetScaled.set(false);

    const defaultLineHeight = AccessibilityConfig.LINE_HEIGHT_OPTIONS[0];
    this.lineHeight.set(defaultLineHeight);
    this.domRenderer.applyLineHeight(defaultLineHeight);

    const defaultTextSpacingLevel = 0;
    this.textSpacingLevel.set(defaultTextSpacingLevel);
    this.domRenderer.applyTextSpacing(TextSpacingLevel.getPreset(defaultTextSpacingLevel));

    const defaultSaturationLevel = 0;
    this.saturationLevel.set(defaultSaturationLevel);
    this.domRenderer.applySaturation(SaturationLevel.getValue(defaultSaturationLevel));

    const defaultContrastLevel = 0;
    this.contrastLevel.set(defaultContrastLevel);
    this.domRenderer.applyContrast(false);

    this.reducedMotionEnabled.set(false);
    this.domRenderer.applyReducedMotion(false);

    this.persistToLocalStorage();
  }

  togglePanel(): void {
    this.isPanelOpen.update(isOpen => !isOpen);
  }

  getCurrentPreferences(): AccessibilityPreferences {
    return {
      fontScale: this.fontScale(),
      useAccessibleFont: this.useAccessibleFont(),
      widgetScaled: this.widgetScaled(),
      lineHeight: this.lineHeight(),
      textSpacingLevel: this.textSpacingLevel(),
      reducedMotionEnabled: this.reducedMotionEnabled(),
      saturationLevel: this.saturationLevel(),
      contrastLevel: this.contrastLevel(),
    };
  }

  applyPreferences(preferences: AccessibilityPreferences): void {
    // Font scale (usa domain model para normalização)
    const normalizedFontScale = FontScale.normalize(preferences.fontScale);
    this.fontScale.set(normalizedFontScale);
    this.domRenderer.applyFontScale(normalizedFontScale);

    // Accessible font
    const accessibleFontEnabled = Boolean(preferences.useAccessibleFont);
    this.useAccessibleFont.set(accessibleFontEnabled);
    this.domRenderer.applyAccessibleFont(accessibleFontEnabled);

    // Widget scaled
    const widgetScaled = Boolean(preferences.widgetScaled);
    this.widgetScaled.set(widgetScaled);

    // Line height (usa domain model para normalização)
    const normalizedLineHeight = LineHeight.normalize(preferences.lineHeight);
    this.lineHeight.set(normalizedLineHeight);
    this.domRenderer.applyLineHeight(normalizedLineHeight);

    // Text spacing (usa domain model para normalização)
    const normalizedTextSpacingLevel = TextSpacingLevel.normalize(preferences.textSpacingLevel);
    this.textSpacingLevel.set(normalizedTextSpacingLevel);
    this.domRenderer.applyTextSpacing(TextSpacingLevel.getPreset(normalizedTextSpacingLevel));

    // Saturation (usa domain model para normalização)
    const normalizedSaturationLevel = SaturationLevel.normalize(preferences.saturationLevel);
    this.saturationLevel.set(normalizedSaturationLevel);
    this.domRenderer.applySaturation(SaturationLevel.getValue(normalizedSaturationLevel));

    // Contrast (usa domain model para normalização)
    const normalizedContrastLevel = ContrastLevel.normalize(preferences.contrastLevel);
    this.contrastLevel.set(normalizedContrastLevel);
    this.domRenderer.applyContrast(normalizedContrastLevel === 1);

    // Reduced motion
    const reducedMotionEnabled = Boolean(preferences.reducedMotionEnabled);
    this.reducedMotionEnabled.set(reducedMotionEnabled);
    this.domRenderer.applyReducedMotion(reducedMotionEnabled);

    // Persist
    this.persistToLocalStorage();
  }

  // Private helpers
  private restorePreferencesFromLocalStorage(): void {
    const persisted = this.loadLocalPreferences.execute();

    if (persisted.fontScale !== undefined) {
      this.fontScale.set(FontScale.normalize(persisted.fontScale));
    }
    if (persisted.useAccessibleFont !== undefined) {
      this.useAccessibleFont.set(Boolean(persisted.useAccessibleFont));
    }
    if (persisted.widgetScaled !== undefined) {
      this.widgetScaled.set(Boolean(persisted.widgetScaled));
    }
    if (persisted.lineHeight !== undefined) {
      this.lineHeight.set(LineHeight.normalize(persisted.lineHeight));
    }
    if (persisted.textSpacingLevel !== undefined) {
      this.textSpacingLevel.set(TextSpacingLevel.normalize(persisted.textSpacingLevel));
    }
    if (persisted.reducedMotionEnabled !== undefined) {
      this.reducedMotionEnabled.set(Boolean(persisted.reducedMotionEnabled));
    }
    if (persisted.saturationLevel !== undefined) {
      this.saturationLevel.set(SaturationLevel.normalize(persisted.saturationLevel));
    }
    if (persisted.contrastLevel !== undefined) {
      this.contrastLevel.set(ContrastLevel.normalize(persisted.contrastLevel));
    }
  }

  private persistToLocalStorage(): void {
    this.saveLocalPreferences.execute(this.getCurrentPreferences());
  }

  private getSystemReducedMotionPreference(): boolean {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}
