import { AccessibilityConfig } from './accessibility-config.model';

/**
 * Modelo de domínio para nível de contraste.
 * Contém lógica de negócio para normalização e ciclagem de níveis.
 */
export class ContrastLevel {
  /**
   * Normaliza um valor de nível para um índice válido.
   */
  static normalize(level: number): number {
    if (!Number.isInteger(level) || level < 0 || level >= AccessibilityConfig.CONTRAST_LEVELS.length) {
      return 0;
    }
    return level;
  }

  /**
   * Retorna o próximo nível no ciclo.
   */
  static getNextLevel(current: number): number {
    return current === AccessibilityConfig.CONTRAST_LEVELS.length - 1 
      ? 0 
      : current + 1;
  }

  /**
   * Verifica se está usando contraste customizado (diferente do padrão).
   */
  static isCustom(level: number): boolean {
    return level !== 0;
  }

  /**
   * Retorna o label do nível atual.
   */
  static getLabel(level: number): string {
    return AccessibilityConfig.CONTRAST_LEVELS[level]?.label ?? AccessibilityConfig.CONTRAST_LEVELS[0].label;
  }
}
