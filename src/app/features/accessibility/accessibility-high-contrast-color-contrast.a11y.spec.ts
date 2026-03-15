import axe from 'axe-core';

describe('Acessibilidade de contraste - tema alto contraste', () => {
  const TEST_CONTAINER_ID = 'a11y-high-contrast-container';

  const highContrastStyles = `
    .theme-high-contrast {
      --color-primary: #FFEE32;
      --color-secondary: #8080FF;
      --color-secondary-hover: #9999FF;
      --color-text: #FFFFFF;
      --color-bg: #000000;
    }

    .theme-high-contrast {
      background: var(--color-bg);
      color: var(--color-text);
      padding: 1rem;
      font-size: 16px;
      line-height: 1.5;
    }

    .theme-high-contrast .btn-primary {
      background: var(--color-bg);
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      padding: 0.5rem 0.875rem;
    }

    .theme-high-contrast .btn-outline-secondary {
      background: var(--color-secondary);
      color: var(--color-bg);
      border: none;
      padding: 0.5rem 0.875rem;
    }

    .theme-high-contrast .modal-content {
      background: #000000;
      border: 2px solid #FFFFFF;
      color: var(--color-text);
      padding: 0.75rem;
    }

    .theme-high-contrast .modal-content .alert {
      background-color: var(--color-secondary);
      color: #000000;
      border: 1px solid var(--color-secondary);
      padding: 0.5rem;
    }

    .theme-high-contrast .breadcrumb-item,
    .theme-high-contrast .breadcrumb-item a,
    .theme-high-contrast .breadcrumb-item.active {
      color: var(--color-primary);
    }
  `;

  beforeEach(() => {
    const style = document.createElement('style');
    style.id = 'a11y-high-contrast-style';
    style.textContent = highContrastStyles;
    document.head.appendChild(style);

    const host = document.createElement('div');
    host.id = TEST_CONTAINER_ID;
    host.className = 'theme-high-contrast';
    host.innerHTML = `
      <nav aria-label="Navegação estrutural">
        <ol>
          <li class="breadcrumb-item"><a href="#">Início</a></li>
          <li class="breadcrumb-item active" aria-current="page">Painel</li>
        </ol>
      </nav>

      <h1>Painel de acessibilidade</h1>
      <p>Este texto valida contraste no tema de alto contraste.</p>

      <button type="button" class="btn-primary">Salvar preferências</button>
      <button type="button" class="btn-outline-secondary">Cancelar</button>

      <section class="modal-content" aria-label="Confirmação">
        <h2>Confirmar ação</h2>
        <p>Deseja realmente continuar com a operação?</p>
        <div class="alert" role="alert">Atenção: esta ação não poderá ser desfeita.</div>
      </section>
    `;

    document.body.appendChild(host);
  });

  afterEach(() => {
    document.getElementById(TEST_CONTAINER_ID)?.remove();
    document.getElementById('a11y-high-contrast-style')?.remove();
  });

  it('deve atender ao contraste de cor do WCAG (regra color-contrast)', async () => {
    const container = document.getElementById(TEST_CONTAINER_ID);

    const result = await axe.run(container ?? document.body, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast'],
      },
    });

    expect(result.violations).toEqual([]);
  });
});