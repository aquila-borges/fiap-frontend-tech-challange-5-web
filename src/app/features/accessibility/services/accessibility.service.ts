import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import type { AccessibilitySettings, TextSpacingPreset } from '../domain';
import { AccessibilityService } from '../domain/interfaces/accessibility-service.interface';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityServiceImpl implements AccessibilityService {
  private readonly STORAGE_KEY_FONT_SCALE = 'app-font-scale';
  private readonly STORAGE_KEY_FONT = 'app-accessible-font';
  private readonly STORAGE_KEY_WIDGET_SCALE = 'app-widget-scaled';
  private readonly STORAGE_KEY_LINE_HEIGHT = 'app-line-height-scale';
  private readonly STORAGE_KEY_TEXT_SPACING = 'app-text-spacing-level';

  private readonly scaleSteps = [100, 112.5, 125, 150, 175, 200] as const;
  private readonly lineHeightOptions = [1, 1.5, 1.75, 2] as const;
  private readonly textSpacingPresets: readonly TextSpacingPreset[] = [
    { letter: '0.015em', word: 'normal', paragraph: '1em', label: 'Padrão' },
    { letter: '0.06em', word: '0.08em', paragraph: '1.5em', label: 'Médio' },
    { letter: '0.12em', word: '0.16em', paragraph: '2em', label: 'Máximo' },
  ] as const;

  private readonly document = globalThis.document ?? inject(DOCUMENT);

  readonly fontScale = signal<number>(this.loadInitialFontScale());
  readonly useAccessibleFont = signal<boolean>(this.loadAccessibleFontPreference());
  readonly widgetScaled = signal<boolean>(this.loadWidgetScalePreference());
  readonly lineHeight = signal<number>(this.loadInitialLineHeight());
  readonly textSpacingLevel = signal<number>(this.loadInitialTextSpacingLevel());
  readonly isPanelOpen = signal<boolean>(false);

  constructor() {
    this.applyFontScale(this.fontScale());
    this.applyAccessibleFont(this.useAccessibleFont());
    this.applyLineHeight(this.lineHeight());
    this.applyTextSpacing(this.textSpacingLevel());
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
  }

  toggleWidgetScale(): void {
    const newValue = !this.widgetScaled();
    this.widgetScaled.set(newValue);
    localStorage.setItem(this.STORAGE_KEY_WIDGET_SCALE, String(newValue));
  }

  cycleLineHeight(): void {
    const currentIndex = this.lineHeightOptions.findIndex(option => option === this.lineHeight());
    const nextIndex = currentIndex === -1 || currentIndex === this.lineHeightOptions.length - 1 ? 0 : currentIndex + 1;
    const nextValue = this.lineHeightOptions[nextIndex];

    this.lineHeight.set(nextValue);
    this.applyLineHeight(nextValue);
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
  }

  isCustomTextSpacingActive(): boolean {
    return this.textSpacingLevel() !== 0;
  }

  getTextSpacingLabel(): string {
    return this.textSpacingPresets[this.textSpacingLevel()].label;
  }

  resetAllSettings(): void {
    const defaultScale = this.scaleSteps[0];
    this.fontScale.set(defaultScale);
    this.applyFontScale(defaultScale);

    this.useAccessibleFont.set(false);
    this.applyAccessibleFont(false);

    this.widgetScaled.set(false);
    localStorage.setItem(this.STORAGE_KEY_WIDGET_SCALE, 'false');

    const defaultLineHeight = this.lineHeightOptions[0];
    this.lineHeight.set(defaultLineHeight);
    this.applyLineHeight(defaultLineHeight);

    this.textSpacingLevel.set(0);
    this.applyTextSpacing(0);
  }

  togglePanel(): void {
    this.isPanelOpen.update(isOpen => !isOpen);
  }

  private applyFontScale(scale: number): void {
    this.document.documentElement.style.setProperty('--app-font-size', `${scale / 100}`);
    localStorage.setItem(this.STORAGE_KEY_FONT_SCALE, String(scale));
  }

  private loadInitialFontScale(): number {
    const raw = Number(localStorage.getItem(this.STORAGE_KEY_FONT_SCALE));
    if (!Number.isFinite(raw)) {
      return this.scaleSteps[0];
    }

    const closest = this.scaleSteps.reduce((prev, current) => {
      return Math.abs(current - raw) < Math.abs(prev - raw) ? current : prev;
    }, this.scaleSteps[0]);

    return closest;
  }

  private loadAccessibleFontPreference(): boolean {
    return localStorage.getItem(this.STORAGE_KEY_FONT) === 'true';
  }

  private applyAccessibleFont(enabled: boolean): void {
    if (enabled) {
      this.document.body.classList.add('accessible-font');
    } else {
      this.document.body.classList.remove('accessible-font');
    }
    localStorage.setItem(this.STORAGE_KEY_FONT, String(enabled));
  }

  private loadWidgetScalePreference(): boolean {
    return localStorage.getItem(this.STORAGE_KEY_WIDGET_SCALE) === 'true';
  }

  private applyLineHeight(value: number): void {
    this.document.documentElement.style.setProperty('--app-line-height', String(value));
    localStorage.setItem(this.STORAGE_KEY_LINE_HEIGHT, String(value));
  }

  private loadInitialLineHeight(): number {
    const raw = Number(localStorage.getItem(this.STORAGE_KEY_LINE_HEIGHT));
    if (!Number.isFinite(raw)) {
      return this.lineHeightOptions[0];
    }

    const closest = this.lineHeightOptions.reduce((prev, current) => {
      return Math.abs(current - raw) < Math.abs(prev - raw) ? current : prev;
    }, this.lineHeightOptions[0]);

    return closest;
  }

  private applyTextSpacing(level: number): void {
    const preset = this.textSpacingPresets[level] ?? this.textSpacingPresets[0];
    this.document.documentElement.style.setProperty('--app-letter-spacing', preset.letter);
    this.document.documentElement.style.setProperty('--app-word-spacing', preset.word);
    this.document.documentElement.style.setProperty('--app-paragraph-spacing', preset.paragraph);
    localStorage.setItem(this.STORAGE_KEY_TEXT_SPACING, String(level));
  }

  private loadInitialTextSpacingLevel(): number {
    const raw = Number(localStorage.getItem(this.STORAGE_KEY_TEXT_SPACING));
    if (!Number.isInteger(raw) || raw < 0 || raw >= this.textSpacingPresets.length) {
      return 0;
    }

    return raw;
  }
}
