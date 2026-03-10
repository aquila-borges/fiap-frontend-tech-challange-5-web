import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import type {
  AccessibilityLocalStorageRepository,
  TextSpacingPreset,
  AccessibilityService,
  AccessibilityPreferences,
} from '../domain';
import { ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN } from '../repositories';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityServiceImpl implements AccessibilityService {
  private readonly scaleSteps = [100, 112.5, 125, 150, 175, 200] as const;
  private readonly lineHeightOptions = [1, 1.5, 1.75, 2] as const;
  private readonly textSpacingPresets: readonly TextSpacingPreset[] = [
    { letter: '0.015em', word: 'normal', paragraph: '1em', label: 'Padrão' },
    { letter: '0.06em', word: '0.08em', paragraph: '1.5em', label: 'Médio' },
    { letter: '0.12em', word: '0.16em', paragraph: '2em', label: 'Máximo' },
  ] as const;
  private readonly saturationLevels = [
    { value: 100, label: 'Normal' },
    { value: 125, label: 'Alta' },
    { value: 150, label: 'Muito alta' },
    { value: 75, label: 'Reduzida' },
    { value: 50, label: 'Baixa' },
    { value: 0, label: 'Escala de cinza' },
  ] as const;
  private readonly contrastLevels = [
    { label: 'Normal' },
    { label: 'Forte' },
  ] as const;

  private readonly document = globalThis.document ?? inject(DOCUMENT);
  private readonly localStorageRepository = inject<AccessibilityLocalStorageRepository>(
    ACCESSIBILITY_LOCAL_STORAGE_REPOSITORY_TOKEN
  );

  readonly fontScale = signal<number>(this.scaleSteps[0]);
  readonly useAccessibleFont = signal<boolean>(false);
  readonly widgetScaled = signal<boolean>(false);
  readonly lineHeight = signal<number>(this.lineHeightOptions[0]);
  readonly textSpacingLevel = signal<number>(0);
  readonly reducedMotionEnabled = signal<boolean>(this.getSystemReducedMotionPreference());
  readonly saturationLevel = signal<number>(0);
  readonly contrastLevel = signal<number>(0);
  readonly isPanelOpen = signal<boolean>(false);

  constructor() {
    this.restorePreferencesFromLocalStorage();
    this.applyPreferences(this.getCurrentPreferences());
  }

  getScaleSteps(): readonly number[] {
    return this.scaleSteps;
  }

  getLineHeightOptions(): readonly number[] {
    return this.lineHeightOptions;
  }

  getTextSpacingPresets(): readonly TextSpacingPreset[] {
    return this.textSpacingPresets;
  }

  increaseFontSize(): void {
    const current = this.fontScale();
    const nextScale = this.scaleSteps.find(step => step > current);

    if (!nextScale) {
      return;
    }

    this.fontScale.set(nextScale);
    this.applyFontScale(nextScale);
    this.persistCurrentPreferences();
  }

  decreaseFontSize(): void {
    const current = this.fontScale();
    const prevSteps = this.scaleSteps.filter(step => step < current);
    const previousScale = prevSteps[prevSteps.length - 1];

    if (!previousScale) {
      return;
    }

    this.fontScale.set(previousScale);
    this.applyFontScale(previousScale);
    this.persistCurrentPreferences();
  }

  isFontScaleAtMax(): boolean {
    return this.fontScale() >= this.scaleSteps[this.scaleSteps.length - 1];
  }

  isFontScaleAtMin(): boolean {
    return this.fontScale() <= this.scaleSteps[0];
  }

  toggleAccessibleFont(): void {
    const newValue = !this.useAccessibleFont();
    this.useAccessibleFont.set(newValue);
    this.applyAccessibleFont(newValue);
    this.persistCurrentPreferences();
  }

  toggleWidgetScale(): void {
    const newValue = !this.widgetScaled();
    this.widgetScaled.set(newValue);
    this.persistCurrentPreferences();
  }

  cycleLineHeight(): void {
    const currentIndex = this.lineHeightOptions.findIndex(option => option === this.lineHeight());
    const nextIndex = currentIndex === -1 || currentIndex === this.lineHeightOptions.length - 1 ? 0 : currentIndex + 1;
    const nextValue = this.lineHeightOptions[nextIndex];

    this.lineHeight.set(nextValue);
    this.applyLineHeight(nextValue);
    this.persistCurrentPreferences();
  }

  isCustomLineHeightActive(): boolean {
    return this.lineHeight() !== this.lineHeightOptions[0];
  }

  cycleTextSpacing(): void {
    const nextLevel = this.textSpacingLevel() === this.textSpacingPresets.length - 1
      ? 0
      : this.textSpacingLevel() + 1;

    this.textSpacingLevel.set(nextLevel);
    this.applyTextSpacing(nextLevel);
    this.persistCurrentPreferences();
  }

  isCustomTextSpacingActive(): boolean {
    return this.textSpacingLevel() !== 0;
  }

  getTextSpacingLabel(): string {
    return this.textSpacingPresets[this.textSpacingLevel()].label;
  }

  cycleSaturation(): void {
    const nextLevel = this.saturationLevel() === this.saturationLevels.length - 1
      ? 0
      : this.saturationLevel() + 1;

    this.saturationLevel.set(nextLevel);
    this.applySaturation(nextLevel);
    this.persistCurrentPreferences();
  }

  isCustomSaturationActive(): boolean {
    return this.saturationLevel() !== 0;
  }

  getSaturationLabel(): string {
    return this.saturationLevels[this.saturationLevel()].label;
  }

  cycleContrast(): void {
    const nextLevel = this.contrastLevel() === this.contrastLevels.length - 1
      ? 0
      : this.contrastLevel() + 1;

    this.contrastLevel.set(nextLevel);
    this.applyContrast(nextLevel);
    this.persistCurrentPreferences();
  }

  isCustomContrastActive(): boolean {
    return this.contrastLevel() !== 0;
  }

  getContrastLabel(): string {
    return this.contrastLevels[this.contrastLevel()].label;
  }

  toggleReducedMotion(): void {
    const newValue = !this.reducedMotionEnabled();
    this.reducedMotionEnabled.set(newValue);
    this.applyReducedMotion(newValue);
    this.persistCurrentPreferences();
  }

  resetAllSettings(): void {
    const defaultScale = this.scaleSteps[0];
    this.fontScale.set(defaultScale);
    this.applyFontScale(defaultScale);

    this.useAccessibleFont.set(false);
    this.applyAccessibleFont(false);

    this.widgetScaled.set(false);

    const defaultLineHeight = this.lineHeightOptions[0];
    this.lineHeight.set(defaultLineHeight);
    this.applyLineHeight(defaultLineHeight);

    this.textSpacingLevel.set(0);
    this.applyTextSpacing(0);

    this.saturationLevel.set(0);
    this.applySaturation(0);

    this.contrastLevel.set(0);
    this.applyContrast(0);

    this.reducedMotionEnabled.set(false);
    this.applyReducedMotion(false);
    this.persistCurrentPreferences();
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
    const normalizedFontScale = this.normalizeToClosestScale(preferences.fontScale);
    this.fontScale.set(normalizedFontScale);
    this.applyFontScale(normalizedFontScale);

    const accessibleFontEnabled = Boolean(preferences.useAccessibleFont);
    this.useAccessibleFont.set(accessibleFontEnabled);
    this.applyAccessibleFont(accessibleFontEnabled);

    const widgetScaled = Boolean(preferences.widgetScaled);
    this.widgetScaled.set(widgetScaled);

    const normalizedLineHeight = this.normalizeToClosestLineHeight(preferences.lineHeight);
    this.lineHeight.set(normalizedLineHeight);
    this.applyLineHeight(normalizedLineHeight);

    const normalizedTextSpacingLevel = this.normalizeTextSpacingLevel(preferences.textSpacingLevel);
    this.textSpacingLevel.set(normalizedTextSpacingLevel);
    this.applyTextSpacing(normalizedTextSpacingLevel);

    const normalizedSaturationLevel = this.normalizeSaturationLevel(preferences.saturationLevel);
    this.saturationLevel.set(normalizedSaturationLevel);
    this.applySaturation(normalizedSaturationLevel);

    const normalizedContrastLevel = this.normalizeContrastLevel(preferences.contrastLevel);
    this.contrastLevel.set(normalizedContrastLevel);
    this.applyContrast(normalizedContrastLevel);

    const reducedMotionEnabled = Boolean(preferences.reducedMotionEnabled);
    this.reducedMotionEnabled.set(reducedMotionEnabled);
    this.applyReducedMotion(reducedMotionEnabled);

    this.persistCurrentPreferences();
  }

  private applyFontScale(scale: number): void {
    this.document.documentElement.style.setProperty('--app-font-size', `${scale / 100}`);
  }

  private applyAccessibleFont(enabled: boolean): void {
    if (enabled) {
      this.document.body.classList.add('accessible-font');
    } else {
      this.document.body.classList.remove('accessible-font');
    }
  }

  private applyLineHeight(value: number): void {
    this.document.documentElement.style.setProperty('--app-line-height', String(value));
  }

  private applyTextSpacing(level: number): void {
    const preset = this.textSpacingPresets[level] ?? this.textSpacingPresets[0];
    this.document.documentElement.style.setProperty('--app-letter-spacing', preset.letter);
    this.document.documentElement.style.setProperty('--app-word-spacing', preset.word);
    this.document.documentElement.style.setProperty('--app-paragraph-spacing', preset.paragraph);
  }

  private applySaturation(level: number): void {
    const saturationValue = this.saturationLevels[level]?.value ?? this.saturationLevels[0].value;
    this.document.documentElement.style.setProperty('--app-saturation', `${saturationValue}%`);
  }

  private applyContrast(level: number): void {
    if (level === 1) {
      this.document.body.classList.add('theme-high-contrast');
    } else {
      this.document.body.classList.remove('theme-high-contrast');
    }
  }

  private applyReducedMotion(enabled: boolean): void {
    if (enabled) {
      this.document.body.classList.add('reduced-motion');
    } else {
      this.document.body.classList.remove('reduced-motion');
    }
  }

  private restorePreferencesFromLocalStorage(): void {
    const persistedPreferences = this.localStorageRepository.load();

    if (persistedPreferences.fontScale !== undefined) {
      this.fontScale.set(this.normalizeToClosestScale(persistedPreferences.fontScale));
    }

    if (persistedPreferences.useAccessibleFont !== undefined) {
      this.useAccessibleFont.set(Boolean(persistedPreferences.useAccessibleFont));
    }

    if (persistedPreferences.widgetScaled !== undefined) {
      this.widgetScaled.set(Boolean(persistedPreferences.widgetScaled));
    }

    if (persistedPreferences.lineHeight !== undefined) {
      this.lineHeight.set(this.normalizeToClosestLineHeight(persistedPreferences.lineHeight));
    }

    if (persistedPreferences.textSpacingLevel !== undefined) {
      this.textSpacingLevel.set(this.normalizeTextSpacingLevel(persistedPreferences.textSpacingLevel));
    }

    if (persistedPreferences.reducedMotionEnabled !== undefined) {
      this.reducedMotionEnabled.set(Boolean(persistedPreferences.reducedMotionEnabled));
    }

    if (persistedPreferences.saturationLevel !== undefined) {
      this.saturationLevel.set(this.normalizeSaturationLevel(persistedPreferences.saturationLevel));
    }

    if (persistedPreferences.contrastLevel !== undefined) {
      this.contrastLevel.set(this.normalizeContrastLevel(persistedPreferences.contrastLevel));
    }
  }

  private persistCurrentPreferences(): void {
    this.localStorageRepository.save(this.getCurrentPreferences());
  }

  private getSystemReducedMotionPreference(): boolean {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  private normalizeToClosestScale(value: number): number {
    return this.scaleSteps.reduce((prev, current) => {
      return Math.abs(current - value) < Math.abs(prev - value) ? current : prev;
    }, this.scaleSteps[0]);
  }

  private normalizeToClosestLineHeight(value: number): number {
    return this.lineHeightOptions.reduce((prev, current) => {
      return Math.abs(current - value) < Math.abs(prev - value) ? current : prev;
    }, this.lineHeightOptions[0]);
  }

  private normalizeTextSpacingLevel(value: number): number {
    if (!Number.isInteger(value) || value < 0 || value >= this.textSpacingPresets.length) {
      return 0;
    }

    return value;
  }

  private normalizeSaturationLevel(value: number): number {
    if (!Number.isInteger(value) || value < 0 || value >= this.saturationLevels.length) {
      return 0;
    }

    return value;
  }

  private normalizeContrastLevel(value: number): number {
    if (!Number.isInteger(value) || value < 0 || value >= this.contrastLevels.length) {
      return 0;
    }

    return value;
  }
}