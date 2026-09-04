# Implementation Plan: Gestão de Clientes na Área Administrativa

**Branch**: `001-admin-customer-management` | **Date**: 2026-09-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-admin-customer-management/spec.md`

---

## Summary

Implementação do módulo administrativo de Gestão de Clientes do e-commerce MouraCamiseta, permitindo a visualização de clientes em tabela, pesquisa por termo, filtros por status (ativo/inativo), inspeção de cadastro completo com endereços em modal e ativação/desativação com confirmação explícita. A solução estabelece a camada `core` da aplicação (com `NotificationService`, `errorInterceptor` e modelos do envelope `ApiResponse<T>`), conecta o sistema de feedback ao componente visual `ToastHostComponent` pré-existente e desacopla as rotas da aplicação em módulos dedicados (`admin.routes.ts` e `client.routes.ts`), preservando estritamente a arquitetura brownfield e os contratos estabelecidos em `docs/api/swagger.json` e `contrato.md`.

---

## Technical Context

**Language/Version**: TypeScript ~5.9.2, Node 20+, Angular 21 (v21.2.x)

**Primary Dependencies**: `@angular/core`, `@angular/router`, `@angular/common/http`, `rxjs` ~7.8.0, `@tailwindcss/postcss` ^4.1.12, `tailwindcss` ^4.1.12

**Storage**: In-memory reactive state (Signals) / Sem login persistente / Sem JWT (Mandato da Constituição e `contrato.md`)

**Testing**: Vitest 4.0.8 (`ng test`), jsdom

**Target Platform**: Navegadores Web Modernos (Evergreen browsers: Chrome, Edge, Firefox, Safari)

**Project Type**: Aplicação Web Single-Page (SPA - Angular Standalone)

**Performance Goals**:
- Renderização inicial da tabela de clientes em < 1s
- Debounce na pesquisa por termo em 300ms
- Abertura de modal de detalhes em < 100ms
- Atualização reativa de status no grid em < 500ms

**Constraints**:
- Conformidade estrita com o envelope `ApiResponse<T> { message: string; dados: T; }` de `contrato.md`
- Portas e endpoints de desenvolvimento configuradas em `environment.ts` (`https://localhost:7094` ou `http://localhost:5134`)
- Erros capturados e apresentados através do componente `ToastHostComponent` já existente
- Preservação não-destrutiva de layouts (`AdminLayoutComponent`, `ClientLayoutComponent`), estilos e componentes compartilhados

**Scale/Scope**:
- Módulo backoffice administrativo de clientes (1 página mestre, 2 modais, 2 serviços, 1 interceptor)
- Suporte a listagens e pesquisas de clientes (~1k a 10k registros)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio da Constituição | Status | Avaliação / Evidência |
| :--- | :---: | :--- |
| **I. Preservação de Estrutura e Código Existente** | **PASS** | Mantém todas as pastas existentes (`features/`, `layouts/`, `shared/`, `environments/`, `styles/`). Constrói aditivamente sobre a página de clientes e layouts pré-existentes. |
| **II. Conformidade com o Contrato de API (contrato.md)** | **PASS** | Todos os endpoints espelham `docs/api/swagger.json` e o envelope `ApiResponse<T>` de `contrato.md`. Sem endpoints inventados. |
| **III. Autenticação e Sessão Simplificadas** | **PASS** | Zero uso de tokens JWT, sem cabeçalhos `Bearer`, sem persistência de sessão complexa em `localStorage`. |
| **IV. Padronização da Stack Tecnológica** | **PASS** | Angular 21, standalone components, Signals nativos, control flow `@if`/`@for`, injeção com `inject()`, Tailwind CSS v4 e SCSS design tokens. |
| **V. Garantia de Qualidade e Testes (Vitest)** | **PASS** | Suíte de testes unitários e de integração com Vitest (`ng test`), validando serviços, interceptores e componentes. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-admin-customer-management/
├── plan.md              # Este plano de implementação
├── research.md          # Decisões arquiteturais e justificativas (Fase 0)
├── data-model.md        # Entidades, DTOs e modelo de estado (Fase 1)
├── quickstart.md        # Roteiro de validação ponta a ponta (Fase 1)
├── contracts/           # Especificação formal dos contratos de API
│   └── admin-customer-api.md
└── checklists/
    └── requirements.md  # Checklist de qualidade da especificação
```

### Source Code (repository layout)

```text
src/
├── app/
│   ├── core/                                     # Infraestrutura global e singleton
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts              # Captura erros HTTP e emite toasts
│   │   ├── models/
│   │   │   ├── domain/
│   │   │   │   └── customer.model.ts             # DTOs ClienteResponseDto, Endereco, Genero (será compartilhado para o client, por isso ficará no core)
│   │   │   ├── api-response.model.ts             # Envelope ApiResponse<T>
│   │   │   └── problem-details.model.ts          # RFC 7807 ProblemDetails
│   │   ├── services/
│   │   │   └── notification.service.ts           # Serviço global de toasts com Signals
│   │   └── index.ts                              # Barrel export do core
│   │
│   ├── features/
│   │   ├── admin/
│   │   │   ├── admin.routes.ts                   # Rotas administrativas desacopladas
│   │   │   ├── customers/                        # Domínio de clientes
│   │   │   │   ├── components/
│   │   │   │   │   ├── customer-detail-modal/    # Modal de detalhes com endereços
│   │   │   │   │   │   ├── customer-detail-modal.component.ts
│   │   │   │   │   │   ├── customer-detail-modal.component.html
│   │   │   │   │   │   └── customer-detail-modal.component.scss
│   │   │   │   │   └── customer-status-modal/    # Modal de confirmação ativar/desativar
│   │   │   │   │       ├── customer-status-modal.component.ts
│   │   │   │   │       ├── customer-status-modal.component.html
│   │   │   │   │       └── customer-status-modal.component.scss
│   │   │   │   ├── filters/
│   │   │   │   │   └── customer-filter.model.ts  # Estado de filtros e busca
│   │   │   │   ├── pages/
│   │   │   │   │   └── customer-list-page/       # Página principal da tabela de clientes
│   │   │   │   │       ├── customer-list-page.component.ts
│   │   │   │   │       ├── customer-list-page.component.html
│   │   │   │   │       ├── customer-list-page.component.scss
│   │   │   │   │       └── customer-list-page.component.spec.ts
│   │   │   │   └── services/
│   │   │   │       ├── customer.service.ts       # Chamadas HTTP para /api/Cliente
│   │   │   │       └── customer.service.spec.ts  # Testes com Vitest do serviço
│   │   │   └── dashboard/                        # Dashboard administrativo existente
│   │   │       └── pages/dashboard-page/
│   │   │
│   │   └── client/
│   │       ├── client.routes.ts                  # Rotas de cliente desacopladas
│   │       ├── errors/not-found-page/
│   │       └── home/pages/home-page/
│   │
│   ├── layouts/
│   │   ├── admin-layout/                         # Layout shell admin com ToastHost
│   │   │   ├── components/
│   │   │   │   ├── admin-sidebar/
│   │   │   │   └── admin-topbar/
│   │   │   ├── admin-layout.component.ts
│   │   │   ├── admin-layout.component.html
│   │   │   └── admin-layout.component.scss
│   │   └── client-layout/                        # Layout shell cliente com ToastHost
│   │
│   ├── shared/
│   │   └── ui/
│   │       ├── modal/                            # Primitiva de modal existente (reutilizada)
│   │       │   ├── modal.component.ts
│   │       │   ├── modal.component.html
│   │       │   └── modal.component.scss
│   │       └── toast-host/                       # Componente visual de toasts existente
│   │           ├── toast-host.component.ts       # Integrado ao NotificationService
│   │           ├── toast-host.component.html
│   │           └── toast-host.component.scss
│   │
│   ├── environments/                             # Configurações de ambiente
│   │   ├── environment.ts                        # apiBaseUrl (localhost:7094/5134)
│   │   └── environment.production.ts
│   │
│   ├── app.config.ts                             # Provedores (HTTP com errorInterceptor)
│   └── app.routes.ts                             # Rotas raiz delegando para módulos
```

**Structure Decision**: A estrutura adota a separação rigorosa entre `core` (serviços de infraestrutura e singleton), `features` (páginas e componentes de negócio separados em `admin` e `client`), `layouts` (shells de composição) e `shared/ui` (primitivas visuais reutilizáveis). As rotas filhas são delegadas para `admin.routes.ts` e `client.routes.ts`.

---

## Complexity Tracking

> **Sem violações da Constituição. Todas as verificações de conformidade foram aprovadas.**

| Item | Complexidade | Justificativa | Alternativa Rejeitada |
| :--- | :--- | :--- | :--- |
| **NotificationService com Signals** | Baixa | Permite que qualquer parte do app (inclusive interceptor) publique toasts | Duplicação manual de toasts em cada componente |
| **ErrorInterceptor Global** | Baixa | Garante que nenhuma falha de backend passe silenciosa | `catchError` em cada chamada HTTP individualmente |
| **Modais de Detalhes e Status** | Média | Permite inspeção e ação ágil sem perder o contexto do grid | Navegação para páginas filhas avulsas |
