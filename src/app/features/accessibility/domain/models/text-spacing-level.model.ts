import { AccessibilityConfig } from './accessibility-config.model';

/**
 * Modelo de domínio para nível de espaçamento de texto.
 * Contém lógica de negócio para normalização e ciclagem de níveis.
 */
export class TextSpacingLevel {
  /**
   * Normaliza um valor de nível para um índice válido.
   */
  static normalize(level: number): number {
    if (!Number.isInteger(level) || level < 0 || level >= AccessibilityConfig.TEXT_SPACING_PRESETS.length) {
      return 0;
    }
    return level;
  }

  /**
   * Retorna o próximo nível no ciclo.
   */
  static getNextLevel(current: number): number {
    return current === AccessibilityConfig.TEXT_SPACING_PRESETS.length - 1 
      ? 0 
      : current + 1;
  }

  /**
   * Verifica se está usando espaçamento customizado (diferente do padrão).
   */
  static isCustom(level: number): boolean {
    return level !== 0;
  }

  /**
   * Retorna o label do preset atual.
   */
  static getLabel(level: number): string {
    return AccessibilityConfig.TEXT_SPACING_PRESETS[level]?.label ?? AccessibilityConfig.TEXT_SPACING_PRESETS[0].label;
  }

  /**
   * Retorna o preset correspondente ao nível.
   */
  static getPreset(level: number) {
    return AccessibilityConfig.TEXT_SPACING_PRESETS[level] ?? AccessibilityConfig.TEXT_SPACING_PRESETS[0];
  }
}
