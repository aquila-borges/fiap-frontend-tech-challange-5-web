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
| lint | npm run lint | Executa análise estática (ESLint) |
| lint:fix | npm run lint:fix | Corrige problemas de lint automaticamente |
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

- docs/copilot-usage-guide-readme.md
- .github/copilot-instructions.md

