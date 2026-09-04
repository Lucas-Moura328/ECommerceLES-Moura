<!--
Sync Impact Report:
- Version change: Unratified Template -> 1.0.0 (Initial Ratification)
- Modified principles:
  - PRINCIPLE_1: "I. Preservação de Estrutura e Código Existente (Brownfield First)" (Defined)
  - PRINCIPLE_2: "II. Conformidade Rigorosa com o Contrato de API (contrato.md)" (Defined)
  - PRINCIPLE_3: "III. Autenticação e Sessão Simplificadas (No-JWT / No-Session)" (Defined)
  - PRINCIPLE_4: "IV. Padronização da Stack Tecnológica (Angular 21 + Tailwind CSS)" (Defined)
  - PRINCIPLE_5: "V. Garantia de Qualidade e Testes Automatizados (Vitest)" (Defined)
- Added sections:
  - Estrutura de Diretórios e Restrições Arquiteturais
  - Fluxo de Desenvolvimento e Portões de Qualidade
- Removed sections: None
- Follow-up TODOs: None (all placeholders resolved)
-->

# MouraCamiseta E-Commerce Frontend Constitution

## Core Principles

### I. Preservação de Estrutura e Código Existente (Brownfield First)
O desenvolvimento no projeto opera sob modelo brownfield, onde o código já implementado e a organização de pastas pré-estabelecida são ativos fundamentais e imutáveis por padrão:
- A estrutura de diretórios existente em `src/app/` (`features/`, `layouts/`, `shared/`, `environments/`, `styles/`) DEVE ser rigorosamente preservada.
- Código pré-existente (layouts de cliente e administrador, páginas, componentes de navegação, modais e tokens de estilo) NÃO DEVE ser reescrito, deletado ou substituído sumariamente.
- Toda nova funcionalidade DEVE ser construída de forma incremental e aditiva, integrando-se organicamente aos layouts (`ClientLayoutComponent`, `AdminLayoutComponent`) e roteamentos existentes em `app.routes.ts`.
- Refatorações em código existente DEVEM ser estritamente justificadas e manter 100% de compatibilidade retroativa com os fluxos já entregues.

### II. Conformidade Rigorosa com o Contrato de API (contrato.md)
Toda interação entre o frontend e a API backend DEVE obedecer fielmente ao contrato formal documentado em `contrato.md`:
- Envelope de Resposta: Toda requisição HTTP DEVE esperar e tipar a resposta sob o padrão genérico:
  ```typescript
  interface ApiResponse<T> {
    message: string;
    dados: T;
  }
  ```
- Endpoints e Portas: As URLs base da API em ambiente de desenvolvimento DEVEM apontar para as portas oficiais acordadas (`https://localhost:7094` ou `http://localhost:5134`), configuradas centralizadamente via `src/environments/environment.ts`.
- Escopo de Entidades e Ações:
  - **Área Cliente**: Home, Meu Perfil (com subseções: Dados Pessoais, Endereços, Alteração de Senha).
  - **Área Admin**: Gestão de Clientes (Listagem, Filtro, Busca, Ativar, Desativar e Visualização de Detalhes).
- Nenhuma rota ou serviço HTTP do frontend pode assumir campos de resposta ou payloads que divirjam das definições em `contrato.md`.

### III. Autenticação e Sessão Simplificadas (No-JWT / No-Session)
Conforme explicitamente vetado nas premissas de arquitetura de `contrato.md`:
- NÃO HAVERÁ uso de JSON Web Tokens (JWT). Nenhuma lógica de interceptor, cabeçalho `Authorization: Bearer` ou decodificação de token DEVE ser introduzida.
- NÃO HAVERÁ persistência de login complexa ou armazenamento persistente de credenciais em `localStorage`/`sessionStorage` para fluxos de autenticação.
- NÃO HAVERÁ gerenciamento complexo de sessões. O estado de autenticação ou identificação do usuário em tela DEVE ser direto, minimalista e desacoplado de frameworks complexos de segurança.

### IV. Padronização da Stack Tecnológica (Angular 21 + Tailwind CSS)
O frontend DEVE se manter estritamente alinhado com as tecnologias e versões oficiais configuradas no projeto:
- **Framework**: Angular v21 (v21.2.x), utilizando componentes autônomos (`standalone: true`), injeção moderna com `inject()`, Signals (`signal()`, `computed()`, `input()`, `output()`) e a sintaxe nativa de fluxo de controle (`@if`, `@for`, `@switch`).
- **Linguagem**: TypeScript (~5.9.x) com checagem estrita de tipos ativada. O uso de `any` sem justificativa prévia é proibido.
- **Estilização**: Tailwind CSS (v4) integrado via `@tailwindcss/postcss`, combinado com o sistema de design tokens e reset em SCSS localizados em `src/styles/` (`_tokens.scss`, `_reset.scss`, `_utilities.scss`). Estilos específicos de componentes devem residir nos arquivos `.component.scss` correspondentes.
- **Ecossistema**: Nenhuma biblioteca externa ou pacote npm adicional DEVE ser introduzido sem validação de impacto arquitetural e justificativa expressa.


## Estrutura de Diretórios e Restrições Arquiteturais

A organização do código-fonte em `src/app/` segue o padrão de separação por responsabilidades e domínios de negócio:

- `src/app/features/`: Módulos de domínio divididos por perfil de acesso:
  - `client/`: Páginas e componentes do cliente final (`home/`, `profile/`, `errors/`, etc.).
  - `admin/`: Telas e componentes administrativos (`dashboard/`, `customers/`, etc.).
- `src/app/layouts/`: Componentes estruturais de casca da aplicação:
  - `client-layout/`: Cabeçalho (`site-header`), navegação (`main-nav`), carrinho rápido (`mini-cart`), barra de busca (`search-bar`) e rodapé (`site-footer`).
  - `admin-layout/`: Barra lateral (`admin-sidebar`) e barra superior (`admin-topbar`).
- `src/app/shared/`: Componentes visuais utilitários e reutilizáveis entre features (ex: `ui/modal`, `ui/toast-host`), pipes e diretivas compartilhadas.
- `src/environments/`: Configurações de conexão e parâmetros de ambiente (`environment.ts`, `environment.production.ts`).
- `src/styles/`: Centralização da identidade visual, com variáveis CSS nativas em `_tokens.scss`, regras de normalização em `_reset.scss` e extensões de utilitários em `_utilities.scss`.
- `src/core/`: Serviços globais e interceptores (`services/`, `interceptors/`, `models/`).

## Fluxo de Desenvolvimento e Portões de Qualidade

Antes de concluir qualquer tarefa ou submeter alterações de código, os seguintes portões de qualidade (Quality Gates) DEVEM ser obrigatoriamente satisfeitos:

1. **Validação de Compilação**: Execução de `npm run build` com saída limpa, sem erros de compilação do TypeScript ou do compilador Angular.
2. **Validação de Testes**: Execução de `npm test` com todos os testes passando com sucesso.
3. **Formatação e Consistência**: Respeito estrito às configurações de formatação do `.prettierrc` (single quotes, 2 espaços de indentação, trailing comma 'es5') e `.editorconfig`.
4. **Verificação de Regressão**: Nenhuma alteração pode quebrar layouts ou rotas já configuradas em `app.routes.ts`.

## Governance

- Esta Constituição atua como a autoridade suprema para decisões de design, arquitetura e implementação no projeto MouraCamiseta E-Commerce Frontend.
- Todas as especificações funcionais geradas via Spec Kit (`spec.md`), planos técnicos (`plan.md`) e tarefas (`tasks.md`) DEVEM verificar e referenciar a conformidade com estes princípios.
- Qualquer alteração ou emenda aos princípios aqui dispostos requer:
  1. Justificativa documentada demonstrando a necessidade técnica ou negocial da mudança.
  2. Incremento de versão semântica da Constituição:
     - **MAJOR**: Alteração ou revogação de princípios pétreos (ex: adoção de JWT, reestruturação completa de pastas).
     - **MINOR**: Inclusão de novas diretrizes, novos domínios ou expansão de regras de qualidade.
     - **PATCH**: Correções tipográficas, refinamento de texto ou melhorias sem alteração de escopo técnico.
  3. Atualização das datas de ratificação e emenda correspondentes.

**Version**: 1.0.0 | **Ratified**: 2026-09-04 | **Last Amended**: 2026-09-04

