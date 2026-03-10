import { AccessibilityConfig } from './accessibility-config.model';

/**
 * Modelo de domínio para nível de saturação.
 * Contém lógica de negócio para normalização e ciclagem de níveis.
 */
export class SaturationLevel {
  /**
   * Normaliza um valor de nível para um índice válido.
   */
  static normalize(level: number): number {
    if (!Number.isInteger(level) || level < 0 || level >= AccessibilityConfig.SATURATION_LEVELS.length) {
      return 0;
    }
    return level;
  }

  /**
   * Retorna o próximo nível no ciclo.
   */
  static getNextLevel(current: number): number {
    return current === AccessibilityConfig.SATURATION_LEVELS.length - 1 
      ? 0 
      : current + 1;
  }

  /**
   * Verifica se está usando saturação customizada (diferente do padrão).
   */
  static isCustom(level: number): boolean {
    return level !== 0;
  }

  /**
   * Retorna o label do nível atual.
   */
  static getLabel(level: number): string {
    return AccessibilityConfig.SATURATION_LEVELS[level]?.label ?? AccessibilityConfig.SATURATION_LEVELS[0].label;
  }

  /**
   * Retorna o valor de saturação em percentual.
   */
  static getValue(level: number): number {
    return AccessibilityConfig.SATURATION_LEVELS[level]?.value ?? AccessibilityConfig.SATURATION_LEVELS[0].value;
  }
}
