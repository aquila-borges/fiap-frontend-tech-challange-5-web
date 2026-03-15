import axe from 'axe-core';

describe('Acessibilidade de foco e teclado - tema alto contraste', () => {
  const TEST_CONTAINER_ID = 'a11y-high-contrast-focus-container';

  const highContrastFocusStyles = `
    .theme-high-contrast {
      --color-primary: #FFEE32;
      --color-secondary: #8080FF;
      --color-bg: #000000;
      --color-text: #FFFFFF;
      background: var(--color-bg);
      color: var(--color-text);
      padding: 1rem;
    }

    .theme-high-contrast a,
    .theme-high-contrast button {
      font-size: 16px;
      border-radius: 0.375rem;
      margin-right: 0.5rem;
    }

    .theme-high-contrast .btn-primary {
      background: var(--color-bg);
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      padding: 0.5rem 0.875rem;
    }

    .theme-high-contrast .btn-secondary {
      background: var(--color-secondary);
      color: var(--color-bg);
      border: 2px solid var(--color-secondary);
      padding: 0.5rem 0.875rem;
    }

    .theme-high-contrast a:focus,
    .theme-high-contrast a:focus-visible,
    .theme-high-contrast button:focus,
    .theme-high-contrast button:focus-visible {
      outline: 3px solid var(--color-primary);
      outline-offset: 2px;
      box-shadow: 0 0 0 2px #000000, 0 0 0 4px var(--color-primary);
    }
  `;

  beforeEach(() => {
    const style = document.createElement('style');
    style.id = 'a11y-high-contrast-focus-style';
    style.textContent = highContrastFocusStyles;
    document.head.appendChild(style);

    const host = document.createElement('div');
    host.id = TEST_CONTAINER_ID;
    host.className = 'theme-high-contrast';
    host.innerHTML = `
      <nav aria-label="Atalhos principais">
        <a id="link-inicio" href="#inicio">Ir para início</a>
      </nav>

      <main id="inicio">
        <button id="btn-salvar" type="button" class="btn-primary">Salvar</button>
        <button id="btn-cancelar" type="button" class="btn-secondary">Cancelar</button>
      </main>
    `;

    document.body.appendChild(host);
  });

  afterEach(() => {
    document.getElementById(TEST_CONTAINER_ID)?.remove();
    document.getElementById('a11y-high-contrast-focus-style')?.remove();
  });

  it('deve manter elementos interativos acessiveis por teclado', async () => {
    const container = document.getElementById(TEST_CONTAINER_ID);

    const axeResult = await axe.run(container ?? document.body, {
      runOnly: {
        type: 'rule',
        values: ['focus-order-semantics', 'link-name', 'button-name'],
      },
    });

    expect(axeResult.violations).toEqual([]);

    const link = document.getElementById('link-inicio') as HTMLAnchorElement;
    const saveButton = document.getElementById('btn-salvar') as HTMLButtonElement;
    const cancelButton = document.getElementById('btn-cancelar') as HTMLButtonElement;

    link.focus();
    expect(document.activeElement).toBe(link);

    saveButton.focus();
    expect(document.activeElement).toBe(saveButton);

    cancelButton.focus();
    expect(document.activeElement).toBe(cancelButton);

    const saveButtonStyle = getComputedStyle(saveButton);
    expect(saveButtonStyle.outlineStyle).not.toBe('none');
    expect(saveButtonStyle.outlineWidth).not.toBe('0px');
  });
});