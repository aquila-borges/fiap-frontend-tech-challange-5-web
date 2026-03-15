# FIAP Frontend Tech Challenge 5 Web

Aplicação web em Angular para autenticação, gestão de tarefas e fluxo Pomodoro, com foco em acessibilidade e arquitetura escalável.

## Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Qualidade e Testes](#qualidade-e-testes)
- [Acessibilidade](#acessibilidade)
- [Deploy e Operações](#deploy-e-operações)
- [Convenções de Desenvolvimento](#convenções-de-desenvolvimento)

## Visão Geral

O projeto utiliza Angular 21 com componentes standalone, organização por features e princípios de Clean Architecture.

Principais capacidades atuais:

- Login e autenticação com Firebase
- Dashboard de tarefas
- Fluxo Pomodoro com etapas guiadas
- Tema de alto contraste e recursos de acessibilidade
- Cobertura de testes unitários e de acessibilidade automatizada

## Stack Tecnológica

- Angular 21
- TypeScript
- RxJS
- Angular Material + Bootstrap
- Firebase (Auth e Firestore)
- ESLint + angular-eslint
- Vitest (via builder de testes do Angular)
- axe-core para validações de acessibilidade automatizadas

## Arquitetura

O projeto segue arquitetura baseada em features com separação de responsabilidades por camadas:

- domain: regras de negócio e contratos
- usecases: orquestração da aplicação
- infrastructure: integrações externas, serviços e repositórios
- components: blocos de interface reutilizáveis
- pages: containers de rota

Também há camadas transversais:

- core: guardas e serviços globais
- shared: componentes e diretivas compartilhadas

## Estrutura de Pastas

```text
src/
	app/
		core/
		shared/
		features/
			auth/
				domain/
				usecases/
				infrastructure/
				pages/
			dashboard/
			pomodoro/
			tasks/
			accessibility/
	environments/
	styles/
```

## Pré-requisitos

- Node.js 20+
- npm 11+
- Angular CLI 21+

## Configuração do Ambiente

1. Instale as dependências:

```bash
npm install
```

2. Verifique as configurações de ambiente:

- Desenvolvimento: src/environments/environment.ts
- Produção: src/environments/environment.prod.ts

3. Preencha as credenciais reais de produção no arquivo de ambiente de produção antes do build/deploy.

4. Para o avaliador: as credenciais não estão incluídas no projeto por motivo de segurança e serão compartilhadas via Google Drive; após acessar o link, basta baixar o arquivo disponibilizado e substituir o arquivo src/environments/environment.ts do projeto.

## Como Rodar Localmente

```bash
npm start
```

A aplicação sobe em http://localhost:4200.

## Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| start | npm start | Sobe servidor local de desenvolvimento |
| build | npm run build | Gera build de produção |
| watch | npm run watch | Build em modo watch para desenvolvimento |
| test | npm test | Executa testes unitários |
| test:ci | npm run test:ci | Executa testes unitários em modo CI (sem watch e com ChromeHeadless) |
| test:axe | npm run test:axe | Executa testes de acessibilidade (*.a11y.spec.ts) sem watch |
| test:axe:ci | npm run test:axe:ci | Executa testes de acessibilidade em modo CI (ChromeHeadless) |
| lint | npm run lint | Executa análise estática (ESLint) |
| lint:fix | npm run lint:fix | Corrige problemas de lint automaticamente |
| ci:lint | npm run ci:lint | Atalho de lint para pipeline CI |
| ci:build | npm run ci:build | Atalho de build para pipeline CI |
| ci:test | npm run ci:test | Executa testes de CI (unitários + acessibilidade) |
| ci | npm run ci | Executa o fluxo completo de CI local (lint + build + testes) |
| deploy:indexes | npm run deploy:indexes | Publica índices do Firestore |

## Rotas da Aplicação

Rotas principais:

- /login
- /dashboard (protegida por autenticação)
- /pomodoro (protegida por autenticação)
- /pomodoro/intro
- /pomodoro/task
- /pomodoro/mode

## Qualidade e Testes

### CI no GitHub Actions

O projeto possui pipeline de CI em [`.github/workflows/ci.yml`](.github/workflows/ci.yml), executado automaticamente em:

- push para `main` e `master`
- pull requests

Etapas executadas no CI:

- lint (`npm run ci:lint`)
- build de produção (`npm run ci:build`)
- testes unitários em modo não interativo (`npm run test:ci`)
- testes de acessibilidade (`npm run test:axe:ci`)

O pipeline usa Node.js 20 LTS e instala dependências com `npm ci`.

Para reproduzir localmente o mesmo fluxo do CI com um único comando:

```bash
npm run ci
```

### Testes Unitários

```bash
npm test -- --watch=false
```

Padrão adotado:

- Arquivos .spec.ts ao lado do código testado
- Cobertura de regras de negócio em domain e usecases
- Sem dependência de testes snapshot para regras críticas

### Testes de Acessibilidade

O projeto possui testes automatizados com axe-core para cenários de alto contraste, incluindo:

- verificação de contraste de cor
- foco e navegação por teclado

```bash
npm run test:axe
```

### Lint

```bash
npm run lint
```

## Acessibilidade

Diretrizes aplicadas no projeto:

- conformidade com WCAG AA
- suporte a tema de alto contraste
- foco visível em elementos interativos
- validações automatizadas com axe-core

## Deploy e Operações

### Build de produção

```bash
npm run build
```

### Publicação de índices Firestore

```bash
npm run deploy:indexes
```

## Convenções de Desenvolvimento

- Preferir componentes standalone
- Usar signals para estado local
- Seguir separação domain/usecases/infrastructure/components/pages
- Evitar lógica de negócio em componentes
- Manter testes junto ao código da feature

Documentações auxiliares:

- docs/copilot-usage-guide-readme.md: guia de uso do GitHub Copilot neste repositório, com orientações práticas para contexto, produtividade e manutenção.
- .github/copilot-instructions.md: instruções oficiais do projeto para agentes de IA, incluindo padrões de arquitetura, regras de código, acessibilidade e convenções de implementação.