import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import type { AccessibilityDomRenderer, TextSpacingPreset } from '../../domain';

/**
 * Implementação do renderer para aplicar preferências de acessibilidade no DOM.
 * Responsável apenas pela camada de apresentação visual.
 */
@Injectable({
  providedIn: 'root',
})
export class AccessibilityDomRendererImpl implements AccessibilityDomRenderer {
  private readonly document = globalThis.document ?? inject(DOCUMENT);

  applyFontScale(scale: number): void {
    this.document.documentElement.style.setProperty('--app-font-size', `${scale / 100}`);
  }

  applyAccessibleFont(enabled: boolean): void {
    if (enabled) {
      this.document.body.classList.add('accessible-font');
    } else {
      this.document.body.classList.remove('accessible-font');
    }
  }

  applyLineHeight(value: number): void {
    this.document.documentElement.style.setProperty('--app-line-height', String(value));
  }

  applyTextSpacing(preset: TextSpacingPreset): void {
    this.document.documentElement.style.setProperty('--app-letter-spacing', preset.letter);
    this.document.documentElement.style.setProperty('--app-word-spacing', preset.word);
    this.document.documentElement.style.setProperty('--app-paragraph-spacing', preset.paragraph);
  }

  applySaturation(value: number): void {
    this.document.documentElement.style.setProperty('--app-saturation', `${value}%`);
  }

  applyContrast(isHighContrast: boolean): void {
    if (isHighContrast) {
      this.document.body.classList.add('theme-high-contrast');
    } else {
      this.document.body.classList.remove('theme-high-contrast');
    }
  }

  applyReducedMotion(enabled: boolean): void {
    if (enabled) {
      this.document.body.classList.add('reduced-motion');
    } else {
      this.document.body.classList.remove('reduced-motion');
    }
  }
}
