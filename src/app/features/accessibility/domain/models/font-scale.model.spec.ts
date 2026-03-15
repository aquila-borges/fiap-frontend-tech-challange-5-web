import { FontScale } from './font-scale.model';

describe('FontScale', () => {
  it('deve normalizar para o step mais proximo', () => {
    expect(FontScale.normalize(113)).toBe(112.5);
    expect(FontScale.normalize(149)).toBe(150);
  });

  it('deve retornar proximo e anterior conforme os steps definidos', () => {
    expect(FontScale.getNextStep(125)).toBe(150);
    expect(FontScale.getPreviousStep(125)).toBe(112.5);
    expect(FontScale.getNextStep(200)).toBeUndefined();
    expect(FontScale.getPreviousStep(100)).toBeUndefined();
  });

  it('deve identificar limites minimo e maximo corretamente', () => {
    expect(FontScale.isAtMin(100)).toBe(true);
    expect(FontScale.isAtMin(99)).toBe(true);
    expect(FontScale.isAtMax(200)).toBe(true);
    expect(FontScale.isAtMax(201)).toBe(true);
    expect(FontScale.isAtMin(125)).toBe(false);
    expect(FontScale.isAtMax(125)).toBe(false);
  });
});