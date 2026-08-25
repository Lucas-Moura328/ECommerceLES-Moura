# Arquitetura do front-end (Angular 20)

E-commerce inspirado no [Fangamer](https://www.fangamer.com), com **duas aplicações lógicas** (Cliente e Admin)
dentro de um único projeto Angular, standalone components, lazy loading por rota e **mock 100% em memória**
enquanto o backend ASP.NET Core + SQL Server não existe.

---

## 1. O que foi observado no Fangamer

| Área | Observação | Como foi traduzido para a arquitetura |
| --- | --- | --- |
| Topo | Barra de aviso (frete/novidades) + header fixo com busca, conta, favoritos e carrinho | `announcement-bar`, `site-header`, `search-bar`, `mini-cart` |
| Navegação | Menu por **coleções/franquias** (não por categoria genérica) | `Collection` como entidade de 1ª classe; rota `/colecoes/:slug` |
| Listagem | Grid de cards com selos (Novo, Pré-venda, Esgotado, Promoção), filtros e ordenação | `product-card` + `product-grid` + `catalog-filters` + `sort-select` |
| Produto | Galeria, variantes (tamanho/plataforma/edição), estoque por variante, pré-venda, relacionados | `product-gallery`, `variant-selector`, `add-to-cart-panel`, `product-tabs` |
| Carrinho | Mini-cart em drawer + página completa com cupom e frete | `mini-cart`, `cart-page`, `cart-summary` |
| Checkout | Fluxo linear em passos, sem menu, **guest checkout** (sem conta obrigatória) | `checkout-layout` + 4 passos + confirmação |
| Pós-venda | Consulta de pedido por código + e-mail, sem login | `/meus-pedidos` (`order-lookup-page`) |
| Conteúdo | Páginas institucionais (FAQ, envio, devolução) e contato | `content/pages/static-page`, `contact-page` |

O Admin não existe publicamente no Fangamer; foi modelado como um back-office padrão de e-commerce
(dashboard, catálogo, estoque, pedidos, clientes, cupons, relatórios).

---

## 2. Princípios da estrutura

1. **Standalone components** em tudo. Nenhum `NgModule`, nenhum `SharedModule`, nenhum barrel gigante.
2. **Feature-first**: cada domínio (`catalog`, `cart`, `checkout`, `orders`, `products`, ...) contém
   suas `pages/`, `components/` e `data-access/`. Nada de pastas globais por tipo técnico.
3. **Lazy loading em dois níveis**: `/admin` e `/` carregam bundles distintos; dentro de cada um,
   cada página é `loadComponent`.
4. **Gateways abstratos** (`abstract class`) entre página e transporte. A página injeta `CatalogGateway`
   e nunca sabe se a origem é mock ou HTTP.
5. **O envelope `Response<T>` fica em uma única camada** (`core/api`). Nenhum componente acessa `.dados`.
6. **Estado com Signals**, sem NgRx: carrinho, favoritos e checkout são pequenos stores `@Injectable`.
7. **Sem padrões legados**: sem `any`, sem `subscribe` em cascata para dados de tela (usa `toSignal`),
   sem `@Input()/@Output()` decorators (usa `input()`/`output()`), sem `*ngIf/*ngFor` (usa `@if/@for`),
   `ChangeDetectionStrategy.OnPush` em todos os componentes.

---

## 3. Árvore completa

```text
ECommerceLES-Moura/
|-- Skills/                 # habilidades do projeto (guias executáveis para humanos e agentes)
|-- docs/
|   `-- ARQUITETURA.md      # este documento
`-- frontend/
    |-- angular.json
    |-- package.json
    |-- tsconfig*.json
    `-- src/
        |-- app/
        |   |-- core/
        |   |   |-- api/
        |   |   |   |-- api-response.model.ts
        |   |   |   |-- api.error.ts
        |   |   |   |-- api.service.ts
        |   |   |   `-- api.tokens.ts
        |   |   |-- auth/
        |   |   |   |-- session.store.ts
        |   |   |   `-- token.storage.ts
        |   |   |-- guards/
        |   |   |   |-- admin.guard.ts
        |   |   |   `-- cart-not-empty.guard.ts
        |   |   |-- interceptors/
        |   |   |   |-- api-error.interceptor.ts
        |   |   |   |-- auth.interceptor.ts
        |   |   |   `-- loading.interceptor.ts
        |   |   |-- models/
        |   |   |   |-- cart.model.ts
        |   |   |   |-- collection.model.ts
        |   |   |   |-- coupon.model.ts
        |   |   |   |-- index.ts
        |   |   |   |-- money.ts
        |   |   |   |-- order.model.ts
        |   |   |   `-- product.model.ts
        |   |   |-- notifications/
        |   |   |   `-- notification.service.ts
        |   |   |-- services/
        |   |   |   |-- loading.service.ts
        |   |   |   |-- seo.service.ts
        |   |   |   `-- storage.service.ts
        |   |   |-- state/
        |   |   |   |-- cart.store.ts
        |   |   |   `-- wishlist.store.ts
        |   |   `-- utils/
        |   |       |-- delay.util.ts
        |   |       `-- slug.util.ts
        |   |-- features/
        |   |   |-- admin/
        |   |   |   |-- collections/
        |   |   |   |   `-- pages/
        |   |   |   |       `-- collection-list-page/
        |   |   |   |           `-- collection-list-page.component.ts
        |   |   |   |-- coupons/
        |   |   |   |   `-- pages/
        |   |   |   |       `-- coupon-list-page/
        |   |   |   |           `-- coupon-list-page.component.ts
        |   |   |   |-- customers/
        |   |   |   |   `-- pages/
        |   |   |   |       `-- customer-list-page/
        |   |   |   |           `-- customer-list-page.component.ts
        |   |   |   |-- dashboard/
        |   |   |   |   `-- pages/
        |   |   |   |       `-- dashboard-page/
        |   |   |   |           |-- dashboard-page.component.html
        |   |   |   |           |-- dashboard-page.component.scss
        |   |   |   |           `-- dashboard-page.component.ts
        |   |   |   |-- inventory/
        |   |   |   |   `-- pages/
        |   |   |   |       `-- inventory-page/
        |   |   |   |           `-- inventory-page.component.ts
        |   |   |   |-- orders/
        |   |   |   |   `-- pages/
        |   |   |   |       |-- order-detail-page/
        |   |   |   |       |   `-- order-detail-page.component.ts
        |   |   |   |       `-- order-list-page/
        |   |   |   |           `-- order-list-page.component.ts
        |   |   |   |-- products/
        |   |   |   |   |-- components/
        |   |   |   |   |   `-- product-variants-editor/
        |   |   |   |   |       `-- product-variants-editor.component.ts
        |   |   |   |   `-- pages/
        |   |   |   |       |-- product-form-page/
        |   |   |   |       |   `-- product-form-page.component.ts
        |   |   |   |       `-- product-list-page/
        |   |   |   |           |-- product-list-page.component.html
        |   |   |   |           `-- product-list-page.component.ts
        |   |   |   |-- reports/
        |   |   |   |   `-- pages/
        |   |   |   |       `-- reports-page/
        |   |   |   |           `-- reports-page.component.ts
        |   |   |   |-- settings/
        |   |   |   |   `-- pages/
        |   |   |   |       `-- settings-page/
        |   |   |   |           `-- settings-page.component.ts
        |   |   |   |-- shared/
        |   |   |   |   |-- components/
        |   |   |   |   |   |-- order-status-badge/
        |   |   |   |   |   |   `-- order-status-badge.component.ts
        |   |   |   |   |   |-- stat-card/
        |   |   |   |   |   |   `-- stat-card.component.ts
        |   |   |   |   |   `-- table-toolbar/
        |   |   |   |   |       `-- table-toolbar.component.ts
        |   |   |   |   `-- data-access/
        |   |   |   |       |-- admin-http.gateway.ts
        |   |   |   |       `-- admin.gateway.ts
        |   |   |   `-- admin.routes.ts
        |   |   `-- client/
        |   |       |-- cart/
        |   |       |   |-- components/
        |   |       |   |   |-- cart-line-item/
        |   |       |   |   |   `-- cart-line-item.component.ts
        |   |       |   |   `-- cart-summary/
        |   |       |   |       `-- cart-summary.component.ts
        |   |       |   `-- pages/
        |   |       |       `-- cart-page/
        |   |       |           |-- cart-page.component.html
        |   |       |           |-- cart-page.component.scss
        |   |       |           `-- cart-page.component.ts
        |   |       |-- catalog/
        |   |       |   |-- components/
        |   |       |   |   |-- catalog-filters/
        |   |       |   |   |   `-- catalog-filters.component.ts
        |   |       |   |   |-- product-card/
        |   |       |   |   |   `-- product-card.component.ts
        |   |       |   |   |-- product-grid/
        |   |       |   |   |   `-- product-grid.component.ts
        |   |       |   |   `-- sort-select/
        |   |       |   |       `-- sort-select.component.ts
        |   |       |   |-- data-access/
        |   |       |   |   |-- catalog-http.gateway.ts
        |   |       |   |   `-- catalog.gateway.ts
        |   |       |   `-- pages/
        |   |       |       |-- collection-list-page/
        |   |       |       |   `-- collection-list-page.component.ts
        |   |       |       |-- collection-page/
        |   |       |       |   |-- collection-page.component.html
        |   |       |       |   |-- collection-page.component.scss
        |   |       |       |   `-- collection-page.component.ts
        |   |       |       `-- search-page/
        |   |       |           `-- search-page.component.ts
        |   |       |-- checkout/
        |   |       |   |-- components/
        |   |       |   |   |-- address-form/
        |   |       |   |   |   `-- address-form.component.ts
        |   |       |   |   |-- checkout-steps/
        |   |       |   |   |   `-- checkout-steps.component.ts
        |   |       |   |   `-- order-summary-aside/
        |   |       |   |       `-- order-summary-aside.component.ts
        |   |       |   |-- data-access/
        |   |       |   |   |-- checkout-http.gateway.ts
        |   |       |   |   |-- checkout.gateway.ts
        |   |       |   |   `-- checkout.store.ts
        |   |       |   |-- pages/
        |   |       |   |   |-- confirmation-page/
        |   |       |   |   |   `-- confirmation-page.component.ts
        |   |       |   |   |-- identification-step/
        |   |       |   |   |   `-- identification-step.component.ts
        |   |       |   |   |-- payment-step/
        |   |       |   |   |   `-- payment-step.component.ts
        |   |       |   |   |-- review-step/
        |   |       |   |   |   `-- review-step.component.ts
        |   |       |   |   `-- shipping-step/
        |   |       |   |       `-- shipping-step.component.ts
        |   |       |   `-- checkout.routes.ts
        |   |       |-- content/
        |   |       |   `-- pages/
        |   |       |       |-- contact-page/
        |   |       |       |   `-- contact-page.component.ts
        |   |       |       `-- static-page/
        |   |       |           `-- static-page.component.ts
        |   |       |-- errors/
        |   |       |   `-- not-found-page/
        |   |       |       `-- not-found-page.component.ts
        |   |       |-- home/
        |   |       |   |-- components/
        |   |       |   |   |-- hero-banner/
        |   |       |   |   |   `-- hero-banner.component.ts
        |   |       |   |   `-- showcase-row/
        |   |       |   |       `-- showcase-row.component.ts
        |   |       |   `-- pages/
        |   |       |       `-- home-page/
        |   |       |           |-- home-page.component.html
        |   |       |           |-- home-page.component.scss
        |   |       |           `-- home-page.component.ts
        |   |       |-- orders/
        |   |       |   |-- components/
        |   |       |   |   `-- order-status-timeline/
        |   |       |   |       `-- order-status-timeline.component.ts
        |   |       |   |-- data-access/
        |   |       |   |   |-- order-tracking-http.gateway.ts
        |   |       |   |   `-- order-tracking.gateway.ts
        |   |       |   `-- pages/
        |   |       |       |-- order-detail-page/
        |   |       |       |   `-- order-detail-page.component.ts
        |   |       |       `-- order-lookup-page/
        |   |       |           `-- order-lookup-page.component.ts
        |   |       |-- product/
        |   |       |   |-- components/
        |   |       |   |   |-- add-to-cart-panel/
        |   |       |   |   |   `-- add-to-cart-panel.component.ts
        |   |       |   |   |-- product-gallery/
        |   |       |   |   |   `-- product-gallery.component.ts
        |   |       |   |   |-- product-tabs/
        |   |       |   |   |   `-- product-tabs.component.ts
        |   |       |   |   `-- variant-selector/
        |   |       |   |       `-- variant-selector.component.ts
        |   |       |   `-- pages/
        |   |       |       `-- product-detail-page/
        |   |       |           |-- product-detail-page.component.html
        |   |       |           |-- product-detail-page.component.scss
        |   |       |           `-- product-detail-page.component.ts
        |   |       |-- wishlist/
        |   |       |   `-- pages/
        |   |       |       `-- wishlist-page/
        |   |       |           `-- wishlist-page.component.ts
        |   |       `-- client.routes.ts
        |   |-- layouts/
        |   |   |-- admin-layout/
        |   |   |   |-- components/
        |   |   |   |   |-- admin-sidebar/
        |   |   |   |   |   `-- admin-sidebar.component.ts
        |   |   |   |   `-- admin-topbar/
        |   |   |   |       `-- admin-topbar.component.ts
        |   |   |   `-- admin-layout.component.ts
        |   |   |-- checkout-layout/
        |   |   |   `-- checkout-layout.component.ts
        |   |   `-- client-layout/
        |   |       |-- components/
        |   |       |   |-- announcement-bar/
        |   |       |   |   `-- announcement-bar.component.ts
        |   |       |   |-- main-nav/
        |   |       |   |   `-- main-nav.component.ts
        |   |       |   |-- mini-cart/
        |   |       |   |   `-- mini-cart.component.ts
        |   |       |   |-- search-bar/
        |   |       |   |   `-- search-bar.component.ts
        |   |       |   |-- site-footer/
        |   |       |   |   `-- site-footer.component.ts
        |   |       |   `-- site-header/
        |   |       |       `-- site-header.component.ts
        |   |       `-- client-layout.component.ts
        |   |-- mocks/
        |   |   |-- data/
        |   |   |   |-- collections.mock.ts
        |   |   |   |-- orders.mock.ts
        |   |   |   `-- products.mock.ts
        |   |   |-- admin-mock.gateway.ts
        |   |   |-- catalog-mock.gateway.ts
        |   |   |-- checkout-mock.gateway.ts
        |   |   |-- mock-db.ts
        |   |   |-- mocks.providers.ts
        |   |   `-- order-tracking-mock.gateway.ts
        |   |-- shared/
        |   |   |-- directives/
        |   |   |   |-- click-outside.directive.ts
        |   |   |   `-- lazy-img.directive.ts
        |   |   |-- forms/
        |   |   |   |-- form-field/
        |   |   |   |   `-- form-field.component.ts
        |   |   |   `-- validation-messages.ts
        |   |   |-- pipes/
        |   |   |   |-- brl.pipe.ts
        |   |   |   |-- order-status.pipe.ts
        |   |   |   `-- truncate.pipe.ts
        |   |   `-- ui/
        |   |       |-- alert/
        |   |       |   `-- alert.component.ts
        |   |       |-- badge/
        |   |       |   `-- badge.component.ts
        |   |       |-- breadcrumbs/
        |   |       |   `-- breadcrumbs.component.ts
        |   |       |-- button/
        |   |       |   |-- button.component.scss
        |   |       |   `-- button.component.ts
        |   |       |-- card/
        |   |       |   `-- card.component.ts
        |   |       |-- data-table/
        |   |       |   `-- data-table.component.ts
        |   |       |-- drawer/
        |   |       |   `-- drawer.component.ts
        |   |       |-- empty-state/
        |   |       |   `-- empty-state.component.ts
        |   |       |-- loading-bar/
        |   |       |   `-- loading-bar.component.ts
        |   |       |-- modal/
        |   |       |   `-- modal.component.ts
        |   |       |-- pagination/
        |   |       |   `-- pagination.component.ts
        |   |       |-- price/
        |   |       |   `-- price.component.ts
        |   |       |-- quantity-stepper/
        |   |       |   `-- quantity-stepper.component.ts
        |   |       |-- rating/
        |   |       |   `-- rating.component.ts
        |   |       |-- section-header/
        |   |       |   `-- section-header.component.ts
        |   |       |-- skeleton/
        |   |       |   `-- skeleton.component.ts
        |   |       |-- spinner/
        |   |       |   `-- spinner.component.ts
        |   |       `-- toast-host/
        |   |           `-- toast-host.component.ts
        |   |-- app.config.ts
        |   |-- app.routes.ts
        |   `-- app.ts
        |-- environments/
        |   |-- environment.production.ts
        |   `-- environment.ts
        |-- styles/
        |   |-- _reset.scss
        |   |-- _tokens.scss
        |   `-- _utilities.scss
        |-- index.html
        |-- main.ts
        `-- styles.scss
```

---

## 4. Responsabilidade de cada pasta

### 4.1 `src/app/core/` — infraestrutura e domínio (singleton, sem UI)

| Caminho | Responsabilidade |
| --- | --- |
| `api/api-response.model.ts` | Contrato `ApiResponse<T> { message, dados }` (o `Response<T>` do backend) e `PagedResult<T>`. |
| `api/api.service.ts` | Único ponto que fala HTTP. `get<T>` já desembrulha `dados`; `getResponse/post/put/patch/delete` devolvem o envelope para quem precisa da `message`. |
| `api/api.error.ts` | `ApiError` normalizado, sempre com a `message` vinda do backend. |
| `api/api.tokens.ts` | `API_BASE_URL` injetável (vem do `environment`). |
| `auth/token.storage.ts` | Guarda o token. **Hoje começa `null` e nada o escreve** — é o ponto de entrada do JWT futuro. |
| `auth/session.store.ts` | Usuário atual + `can(role)`. No mockup responde permissivo. |
| `guards/admin.guard.ts` | `CanMatchFn` de `/admin`. Já existe, só passa a barrar quando a sessão real chegar. |
| `guards/cart-not-empty.guard.ts` | Impede entrar no checkout com carrinho vazio. |
| `interceptors/auth.interceptor.ts` | Anexa `Authorization: Bearer` **apenas se houver token** (no-op hoje). |
| `interceptors/loading.interceptor.ts` | Alimenta a barra de progresso global. |
| `interceptors/api-error.interceptor.ts` | Converte falha HTTP em `ApiError` + toast, usando a `message` do envelope. |
| `models/` | Tipos do domínio: `Product`, `ProductVariant`, `Collection`, `CartItem`, `Order`, `Customer`, `Address`, `Coupon`. Espelham o que o backend vai retornar dentro de `dados`. |
| `state/cart.store.ts` | Carrinho com Signals + persistência em `localStorage` (`les.cart.v1`). Totais são `computed`. |
| `state/wishlist.store.ts` | Favoritos (mesma estratégia). |
| `services/` | `LoadingService`, `StorageService` (acesso seguro ao `localStorage`), `SeoService` (title/meta). |
| `notifications/` | `NotificationService` — fila de toasts consumida pelo `toast-host`. |
| `utils/` | `slug.util.ts`, `delay.util.ts` (latência simulada dos mocks). |

### 4.2 `src/app/shared/` — reutilizável e **sem regra de negócio**

- `ui/` — design system: `button`, `badge`, `card`, `alert`, `price`, `rating`, `spinner`, `skeleton`,
  `empty-state`, `quantity-stepper`, `pagination`, `modal`, `drawer`, `breadcrumbs`, `section-header`,
  `data-table` (tabela genérica que sustenta **todas** as listagens do Admin).
- `ui/toast-host` e `ui/loading-bar` — **componentes globais**, renderizados uma única vez no `app.ts`,
  fora de qualquer rota.
- `forms/` — `form-field` (label + conteúdo + erro) e `validation-messages` (texto único por tipo de erro).
- `pipes/` — `brl` (moeda), `truncate`, `orderStatus` (enum → rótulo em português).
- `directives/` — `clickOutside` (fechar dropdown/drawer), `lazyImg` (`loading="lazy"` + fallback).

### 4.3 `src/app/layouts/` — molduras

| Layout | Onde é usado | Conteúdo |
| --- | --- | --- |
| `client-layout` | todas as rotas da loja | announcement bar, header (nav de coleções, busca, favoritos, carrinho), mini-cart drawer, `router-outlet`, footer |
| `checkout-layout` | `/checkout/**` | header mínimo sem navegação, para não tirar o usuário do fluxo |
| `admin-layout` | `/admin/**` | sidebar colapsável, topbar, área de conteúdo |

### 4.4 `src/app/features/client/` — componentes específicos do Cliente

| Feature | Páginas | Componentes próprios |
| --- | --- | --- |
| `home` | `home-page` | `hero-banner`, `showcase-row` |
| `catalog` | `collection-list-page`, `collection-page`, `search-page` | `product-card`, `product-grid`, `catalog-filters`, `sort-select` |
| `product` | `product-detail-page` | `product-gallery`, `variant-selector`, `add-to-cart-panel`, `product-tabs` |
| `cart` | `cart-page` | `cart-line-item`, `cart-summary` |
| `checkout` | `identification-step`, `shipping-step`, `payment-step`, `review-step`, `confirmation-page` | `checkout-steps`, `address-form`, `order-summary-aside` |
| `orders` | `order-lookup-page`, `order-detail-page` | `order-status-timeline` |
| `wishlist` | `wishlist-page` | — (reaproveita `product-card`) |
| `content` | `static-page`, `contact-page` | — |
| `errors` | `not-found-page` | — |

Cada feature com origem de dados tem `data-access/` com o par **gateway abstrato + implementação HTTP**
(`catalog.gateway.ts` / `catalog-http.gateway.ts`). O checkout ainda tem o `checkout.store.ts`,
que guarda os dados dos passos em memória (nada de sessão persistente).

### 4.5 `src/app/features/admin/` — componentes específicos do Admin

| Feature | Páginas | Componentes próprios |
| --- | --- | --- |
| `dashboard` | `dashboard-page` | usa `stat-card` |
| `products` | `product-list-page`, `product-form-page` (novo e edição) | `product-variants-editor` |
| `collections` | `collection-list-page` | — |
| `inventory` | `inventory-page` | reusa `product-variants-editor` |
| `orders` | `order-list-page`, `order-detail-page` | usa `order-status-badge` + reusa `order-status-timeline` do Cliente |
| `customers` | `customer-list-page` | — |
| `coupons` | `coupon-list-page` (com modal de criação) | — |
| `reports` | `reports-page` | — |
| `settings` | `settings-page` | — |
| `shared` | — | `stat-card`, `table-toolbar`, `order-status-badge` + `data-access/admin.gateway.ts` (`AdminCatalogGateway`, `AdminSalesGateway`) |

Toda listagem do Admin segue o mesmo padrão: `signal<AdminListQuery>` → `toObservable` → `debounceTime`
→ `switchMap(gateway)` → `toSignal`, renderizando `ui-data-table` + `ui-pagination`.

### 4.6 `src/app/mocks/` — o backend falso

- `data/` — catálogo inspirado no Fangamer (pelúcias, vinis, camisetas, artbooks, pins, desk mats),
  coleções, pedidos e clientes.
- `mock-db.ts` — “banco” em Signals **compartilhado**: o que o Admin altera (estoque, status de pedido,
  novo produto) aparece imediatamente na loja, na mesma sessão.
- `*-mock.gateway.ts` — implementam os mesmos contratos abstratos dos gateways HTTP, com latência simulada
  e devolvendo o mesmo envelope `{ message, dados }`.
- `mocks.providers.ts` — `provideGateways(useMocks)`: **um único lugar** troca mock por HTTP real.

### 4.7 `src/environments/`

```ts
export const environment = { production: false, useMocks: true, apiBaseUrl: 'https://localhost:7001/api', mockLatencyMs: 250 };
```

Ligar o backend real = trocar `useMocks` para `false`. Nenhum componente muda.

---

## 5. Rotas

### Cliente (`features/client/client.routes.ts`, dentro de `client-layout`)

| Rota | Página |
| --- | --- |
| `/` | Home |
| `/produtos` | Catálogo completo |
| `/colecoes` | Lista de coleções |
| `/colecoes/:slug` | Coleção |
| `/busca?q=` | Resultados |
| `/produto/:slug` | Detalhe do produto |
| `/carrinho` | Carrinho |
| `/favoritos` | Lista de desejos |
| `/meus-pedidos` | Consulta de pedido (código + e-mail, sem login) |
| `/pedido/:code` | Detalhe público do pedido |
| `/contato` | Contato |
| `/institucional/:slug` | FAQ, envio, trocas, privacidade |
| `/checkout/identificacao` | Passo 1 (`checkout-layout`, `cartNotEmptyGuard`) |
| `/checkout/entrega` | Passo 2 |
| `/checkout/pagamento` | Passo 3 |
| `/checkout/revisao` | Passo 4 |
| `/checkout/confirmacao/:code` | Confirmação |
| `**` | 404 |

### Admin (`features/admin/admin.routes.ts`, dentro de `admin-layout`, atrás de `adminGuard`)

`/admin/dashboard` · `/admin/produtos` · `/admin/produtos/novo` · `/admin/produtos/:id` ·
`/admin/colecoes` · `/admin/estoque` · `/admin/pedidos` · `/admin/pedidos/:id` ·
`/admin/clientes` · `/admin/cupons` · `/admin/relatorios` · `/admin/configuracoes`

Parâmetros de rota chegam nos componentes como `input()` graças a `withComponentInputBinding()`.

---

## 6. Contrato com o backend ASP.NET Core

Toda resposta é

```json
{ "message": "Produto atualizado com sucesso.", "dados": { } }
```

Regras:

- Leitura de tela usa `api.get<T>(path)` — já devolve `dados` e lança `ApiError(message)` se vier `null`.
- Escrita usa `api.post/put/patch/delete`, que devolvem `ApiResponse<T>` **porque a tela precisa mostrar
  a `message`** no toast.
- Listagens paginadas: `dados` é um `PagedResult<T>`.
- Nenhum componente faz `response.dados` na mão; quem precisa desembrulha via `unwrap()`.

---

## 7. Caminho de evolução (JWT, login, sessão)

Tudo já tem lugar reservado, **desligado**:

| Futuro | O que muda | O que **não** muda |
| --- | --- | --- |
| JWT | `TokenStorage` passa a persistir o token; `authInterceptor` já envia o header | nenhum componente |
| Login persistente | `SessionStore` carrega o usuário no bootstrap; nasce `features/client/account/` | rotas atuais |
| Autorização real | `adminGuard` passa a exigir a role | `admin.routes.ts` |
| Backend real | `environment.useMocks = false` | todas as páginas |
| Carrinho no servidor | `CartStore` ganha sincronização | a API pública do store |
