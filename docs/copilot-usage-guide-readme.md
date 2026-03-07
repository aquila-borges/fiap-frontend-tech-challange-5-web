
# Como usar o GitHub Copilot com as Instruções do Projeto

Este projeto possui instruções de IA definidas em:

.github/copilot-instructions.md

Essas regras orientam o GitHub Copilot a seguir a arquitetura, stack e padrões de código definidos para o projeto.

As instruções incluem:

- Boas práticas modernas de Angular
- Arquitetura baseada em **Features**
- Princípios de **Clean Architecture**
- Uso de **Signals** para gerenciamento de estado
- **Standalone Components**
- Regras e convenções de código

---

# Passo 1 — Garantir que o Copilot carregue as instruções

Após criar ou atualizar:

.github/copilot-instructions.md

Recarregue a janela do VS Code para que o Copilot atualize o contexto do workspace.

Abra o Command Palette:

`Ctrl + Shift + P`

Execute:

`Reload Window`

Isso garante que o Copilot leia as novas instruções do projeto.

---

# Passo 2 — Pedir para o Copilot analisar o projeto

Abra o **Copilot Chat** e use um prompt como:

`Analyze this Angular project and follow the rules defined in .github/copilot-instructions.md. Explain how the current project structure aligns with the architecture rules.`

Isso faz com que o Copilot:

- leia a estrutura do projeto
- interprete as regras definidas
- compare o código atual com os padrões definidos

---

# Passo 3 — Solicitar melhorias de arquitetura

Você também pode pedir para o Copilot alinhar o projeto com a arquitetura definida:

`Based on the instructions in .github/copilot-instructions.md, review this project and suggest improvements to align it with the defined architecture.`

O Copilot pode sugerir:

- reorganização de pastas
- separação de camadas
- criação de features seguindo a arquitetura

---

# Passo 4 — Gerar novas features seguindo as regras

Ao gerar novas funcionalidades, sempre faça referência ao arquivo de instruções.

Exemplo de prompt:

`Create a new Angular feature called transactions following the architecture rules in .github/copilot-instructions.md.`

ou

`Generate a feature using the project's architecture guidelines defined in copilot-instructions.md.`

Resultado esperado:

features/
  transactions/
    domain/
    usecases/
    services/
    components/
    pages/

---

# Passo 5 — Refatorar código existente

Você também pode pedir para o Copilot refatorar o código existente:

`Review the project structure and refactor it to follow the Feature-Based + Clean Architecture rules defined in .github/copilot-instructions.md.`

---

# Passo 6 — Sinais de que as instruções estão funcionando

Se o Copilot estiver usando corretamente as instruções do projeto, ele deve:

- utilizar **signals**
- criar **standalone components**
- aplicar **ChangeDetectionStrategy.OnPush**
- seguir a estrutura **feature-based**
- separar corretamente **domain / usecases / services / components / pages**
- evitar lógica de negócio dentro de componentes

---

# Boa prática ao escrever prompts

Sempre que possível, mencione o arquivo de instruções no prompt:

`follow the project instructions in .github/copilot-instructions.md`

Isso aumenta as chances do Copilot usar a arquitetura e regras definidas.

Sempre que possível, escreva os comandos em **inglês**, pois os modelos de IA geralmente interpretam instruções técnicas com mais precisão nesse idioma.

---

# Resumo

1. Coloque as regras em `.github/copilot-instructions.md`
2. Recarregue o VS Code
3. Peça para o Copilot analisar ou gerar código seguindo as instruções
4. Sempre mencione o arquivo de instruções nos prompts

---

# Ferramentas utilizadas

- GitHub Copilot
- Visual Studio Code
- Angular 20+
