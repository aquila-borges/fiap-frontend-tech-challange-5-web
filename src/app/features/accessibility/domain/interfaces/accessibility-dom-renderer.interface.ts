import type { TextSpacingPreset } from '../../domain';

/**
 * Contrato para renderização de preferências de acessibilidade no DOM.
 * Responsável apenas pela manipulação visual (CSS e classes).
 */
export interface AccessibilityDomRenderer {
  /**
   * Aplica escala de fonte através de CSS variable.
   */
  applyFontScale(scale: number): void;

  /**
   * Aplica ou remove fonte acessível através de classe CSS.
   */
  applyAccessibleFont(enabled: boolean): void;

  /**
   * Aplica altura de linha através de CSS variable.
   */
  applyLineHeight(value: number): void;

  /**
   * Aplica espaçamento de texto através de CSS variables.
   */
  applyTextSpacing(preset: TextSpacingPreset): void;

  /**
   * Aplica saturação através de CSS variable.
   */
  applySaturation(value: number): void;

  /**
   * Aplica ou remove tema de alto contraste através de classe CSS.
   */
  applyContrast(isHighContrast: boolean): void;

  /**
   * Aplica ou remove modo de movimento reduzido através de classe CSS.
   */
  applyReducedMotion(enabled: boolean): void;
}
