import { AccessibilityConfig } from './accessibility-config.model';

/**
 * Modelo de domínio para escala de fonte.
 * Contém lógica de negócio para normalização e navegação entre steps.
 */
export class FontScale {
  /**
   * Normaliza um valor para a escala mais próxima válida.
   */
  static normalize(value: number): number {
    return AccessibilityConfig.SCALE_STEPS.reduce((prev, current) => {
      return Math.abs(current - value) < Math.abs(prev - value) ? current : prev;
    }, AccessibilityConfig.SCALE_STEPS[0]);
  }

  /**
   * Retorna o próximo step de escala, ou undefined se já está no máximo.
   */
  static getNextStep(current: number): number | undefined {
    return AccessibilityConfig.SCALE_STEPS.find(step => step > current);
  }

  /**
   * Retorna o step anterior, ou undefined se já está no mínimo.
   */
  static getPreviousStep(current: number): number | undefined {
    const prevSteps = AccessibilityConfig.SCALE_STEPS.filter(step => step < current);
    return prevSteps[prevSteps.length - 1];
  }

  /**
   * Verifica se o valor está no step máximo.
   */
  static isAtMax(value: number): boolean {
    return value >= AccessibilityConfig.SCALE_STEPS[AccessibilityConfig.SCALE_STEPS.length - 1];
  }

  /**
   * Verifica se o valor está no step mínimo.
   */
  static isAtMin(value: number): boolean {
    return value <= AccessibilityConfig.SCALE_STEPS[0];
  }
}
