import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
  imports: [RouterLink, RouterLinkActive, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {
  private readonly STORAGE_KEY = 'app-font-scale';
  private readonly FONT_KEY = 'app-accessible-font';
  private readonly WIDGET_SCALE_KEY = 'app-widget-scaled';
  private readonly LINE_HEIGHT_KEY = 'app-line-height-scale';
  private readonly TEXT_SPACING_KEY = 'app-text-spacing-level';
  private readonly scaleSteps = [100, 112.5, 125, 150, 175, 200] as const;
  private readonly lineHeightOptions = [1, 1.5, 1.75, 2] as const;
  private readonly textSpacingPresets = [
    { letter: '0.015em', word: 'normal', paragraph: '1em', label: 'Padrão' },
    { letter: '0.06em', word: '0.08em', paragraph: '1.5em', label: 'Médio' },
    { letter: '0.12em', word: '0.16em', paragraph: '2em', label: 'Máximo' }
  ] as const;
  private readonly document = globalThis.document ?? inject(DOCUMENT);

  protected readonly currentScale = signal<number>(this.loadInitialScale());
  protected readonly isOffcanvasOpen = signal<boolean>(false);
  protected readonly useAccessibleFont = signal<boolean>(this.loadAccessibleFontPreference());
  protected readonly isWidgetScaled = signal<boolean>(this.loadWidgetScalePreference());
  protected readonly currentLineHeight = signal<number>(this.loadInitialLineHeight());
  protected readonly currentTextSpacingLevel = signal<number>(this.loadInitialTextSpacingLevel());

  constructor() {
    this.applyScale(this.currentScale());
    this.applyAccessibleFont(this.useAccessibleFont());
    this.applyLineHeight(this.currentLineHeight());
    this.applyTextSpacing(this.currentTextSpacingLevel());
  }

  protected toggleOffcanvas(): void {
    this.isOffcanvasOpen.update(isOpen => !isOpen);
  }

  protected increaseFontSize(): void {
    const current = this.currentScale();
    const nextScale = this.scaleSteps.find(step => step > current);

    if (!nextScale) {
      return;
    }

    this.currentScale.set(nextScale);
    this.applyScale(nextScale);
  }

  protected decreaseFontSize(): void {
    const current = this.currentScale();
    const prevSteps = this.scaleSteps.filter(step => step < current);
    const previousScale = prevSteps[prevSteps.length - 1];

    if (!previousScale) {
      return;
    }

    this.currentScale.set(previousScale);
    this.applyScale(previousScale);
  }

  protected isScaleMaxed(): boolean {
    return this.currentScale() >= this.scaleSteps[this.scaleSteps.length - 1];
  }

  protected isScaleMinned(): boolean {
    return this.currentScale() <= this.scaleSteps[0];
  }

  protected toggleAccessibleFont(): void {
    const newValue = !this.useAccessibleFont();
    this.useAccessibleFont.set(newValue);
    this.applyAccessibleFont(newValue);
  }

  protected toggleWidgetScale(): void {
    const newValue = !this.isWidgetScaled();
    this.isWidgetScaled.set(newValue);
    localStorage.setItem(this.WIDGET_SCALE_KEY, String(newValue));
  }

  protected cycleLineHeight(): void {
    const currentIndex = this.lineHeightOptions.findIndex(option => option === this.currentLineHeight());
    const nextIndex = currentIndex === -1 || currentIndex === this.lineHeightOptions.length - 1 ? 0 : currentIndex + 1;
    const nextValue = this.lineHeightOptions[nextIndex];

    this.currentLineHeight.set(nextValue);
    this.applyLineHeight(nextValue);
  }

  protected isCustomLineHeightActive(): boolean {
    return this.currentLineHeight() !== this.lineHeightOptions[0];
  }

  protected cycleTextSpacing(): void {
    const nextLevel = this.currentTextSpacingLevel() === this.textSpacingPresets.length - 1
      ? 0
      : this.currentTextSpacingLevel() + 1;

    this.currentTextSpacingLevel.set(nextLevel);
    this.applyTextSpacing(nextLevel);
  }

  protected isCustomTextSpacingActive(): boolean {
    return this.currentTextSpacingLevel() !== 0;
  }

  protected currentTextSpacingLabel(): string {
    return this.textSpacingPresets[this.currentTextSpacingLevel()].label;
  }

  protected resetAccessibilitySettings(): void {
    const defaultScale = this.scaleSteps[0];
    this.currentScale.set(defaultScale);
    this.applyScale(defaultScale);

    this.useAccessibleFont.set(false);
    this.applyAccessibleFont(false);

    this.isWidgetScaled.set(false);
    localStorage.setItem(this.WIDGET_SCALE_KEY, 'false');

    const defaultLineHeight = this.lineHeightOptions[0];
    this.currentLineHeight.set(defaultLineHeight);
    this.applyLineHeight(defaultLineHeight);

    this.currentTextSpacingLevel.set(0);
    this.applyTextSpacing(0);
  }

  private applyScale(scale: number): void {
    this.document.documentElement.style.fontSize = `${scale}%`;
    this.document.documentElement.style.setProperty('--app-font-scale-factor', `${scale / 100}`);
    localStorage.setItem(this.STORAGE_KEY, String(scale));
  }

  private loadInitialScale(): number {
    const raw = Number(localStorage.getItem(this.STORAGE_KEY));
    if (!Number.isFinite(raw)) {
      return this.scaleSteps[0];
    }

    const closest = this.scaleSteps.reduce((prev, current) => {
      return Math.abs(current - raw) < Math.abs(prev - raw) ? current : prev;
    }, this.scaleSteps[0]);

    return closest;
  }

  private loadAccessibleFontPreference(): boolean {
    return localStorage.getItem(this.FONT_KEY) === 'true';
  }

  private applyAccessibleFont(enabled: boolean): void {
    if (enabled) {
      this.document.body.classList.add('accessible-font');
    } else {
      this.document.body.classList.remove('accessible-font');
    }
    localStorage.setItem(this.FONT_KEY, String(enabled));
  }

  private loadWidgetScalePreference(): boolean {
    return localStorage.getItem(this.WIDGET_SCALE_KEY) === 'true';
  }

  private applyLineHeight(value: number): void {
    this.document.documentElement.style.setProperty('--app-line-height', String(value));
    localStorage.setItem(this.LINE_HEIGHT_KEY, String(value));
  }

  private loadInitialLineHeight(): number {
    const raw = Number(localStorage.getItem(this.LINE_HEIGHT_KEY));
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
    localStorage.setItem(this.TEXT_SPACING_KEY, String(level));
  }

  private loadInitialTextSpacingLevel(): number {
    const raw = Number(localStorage.getItem(this.TEXT_SPACING_KEY));
    if (!Number.isInteger(raw) || raw < 0 || raw >= this.textSpacingPresets.length) {
      return 0;
    }

    return raw;
  }
}
