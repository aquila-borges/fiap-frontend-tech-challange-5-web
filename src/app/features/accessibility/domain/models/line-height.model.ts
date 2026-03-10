import { AccessibilityConfig } from './accessibility-config.model';

/**
 * Modelo de domínio para altura de linha.
 * Contém lógica de negócio para normalização e ciclagem de valores.
 */
export class LineHeight {
  /**
   * Normaliza um valor para a opção mais próxima válida.
   */
  static normalize(value: number): number {
    return AccessibilityConfig.LINE_HEIGHT_OPTIONS.reduce((prev, current) => {
      return Math.abs(current - value) < Math.abs(prev - value) ? current : prev;
    }, AccessibilityConfig.LINE_HEIGHT_OPTIONS[0]);
  }

  /**
   * Retorna o próximo valor no ciclo.
   */
  static getNextValue(current: number): number {
    const currentIndex = AccessibilityConfig.LINE_HEIGHT_OPTIONS.findIndex(option => option === current);
    const nextIndex = currentIndex === -1 || currentIndex === AccessibilityConfig.LINE_HEIGHT_OPTIONS.length - 1 
      ? 0 
      : currentIndex + 1;
    return AccessibilityConfig.LINE_HEIGHT_OPTIONS[nextIndex];
  }

  /**
   * Verifica se está usando altura customizada (diferente do padrão).
   */
  static isCustom(value: number): boolean {
    return value !== AccessibilityConfig.LINE_HEIGHT_OPTIONS[0];
  }
}
