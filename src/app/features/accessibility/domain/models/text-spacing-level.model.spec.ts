import { TextSpacingLevel } from './text-spacing-level.model';

describe('TextSpacingLevel', () => {
  it('deve normalizar nivel invalido para padrao', () => {
    expect(TextSpacingLevel.normalize(-1)).toBe(0);
    expect(TextSpacingLevel.normalize(99)).toBe(0);
    expect(TextSpacingLevel.normalize(1.2)).toBe(0);
  });

  it('deve ciclar para o proximo nivel e voltar ao inicio no ultimo', () => {
    expect(TextSpacingLevel.getNextLevel(0)).toBe(1);
    expect(TextSpacingLevel.getNextLevel(1)).toBe(2);
    expect(TextSpacingLevel.getNextLevel(2)).toBe(0);
  });

  it('deve retornar preset e label com fallback para padrao', () => {
    expect(TextSpacingLevel.isCustom(0)).toBe(false);
    expect(TextSpacingLevel.isCustom(1)).toBe(true);

    expect(TextSpacingLevel.getLabel(1)).toBe('Médio');
    expect(TextSpacingLevel.getLabel(999)).toBe('Padrão');

    expect(TextSpacingLevel.getPreset(2)).toEqual({
      letter: '0.12em',
      word: '0.16em',
      paragraph: '2em',
      label: 'Máximo',
    });
    expect(TextSpacingLevel.getPreset(999)).toEqual({
      letter: '0.015em',
      word: 'normal',
      paragraph: '1em',
      label: 'Padrão',
    });
  });
});