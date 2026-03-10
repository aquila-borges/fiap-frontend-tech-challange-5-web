import type { TextSpacingPreset } from '../interfaces/text-spacing-preset.interface';

/**
 * Configurações de domínio para acessibilidade.
 * Define os valores válidos para escalas, níveis e presets.
 */
export class AccessibilityConfig {
  static readonly SCALE_STEPS = [100, 112.5, 125, 150, 175, 200] as const;
  
  static readonly LINE_HEIGHT_OPTIONS = [1, 1.5, 1.75, 2] as const;
  
  static readonly TEXT_SPACING_PRESETS: readonly TextSpacingPreset[] = [
    { letter: '0.015em', word: 'normal', paragraph: '1em', label: 'Padrão' },
    { letter: '0.06em', word: '0.08em', paragraph: '1.5em', label: 'Médio' },
    { letter: '0.12em', word: '0.16em', paragraph: '2em', label: 'Máximo' },
  ] as const;
  
  static readonly SATURATION_LEVELS = [
    { value: 100, label: 'Normal' },
    { value: 125, label: 'Alta' },
    { value: 150, label: 'Muito alta' },
    { value: 75, label: 'Reduzida' },
    { value: 50, label: 'Baixa' },
    { value: 0, label: 'Escala de cinza' },
  ] as const;
  
  static readonly CONTRAST_LEVELS = [
    { label: 'Normal' },
    { label: 'Forte' },
  ] as const;
}
