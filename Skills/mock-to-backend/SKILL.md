---
name: mock-to-backend
description: Trocar os mocks em memória pelo backend ASP.NET Core real, total ou parcialmente.
---

# Do mock para o backend real

## Como está hoje

`src/app/app.config.ts` chama `provideGateways(environment.useMocks)`. Esse é o **único** ponto
que decide a origem dos dados:

```ts
export function provideGateways(useMocks: boolean): Provider[] {
  return useMocks
    ? [{ provide: CatalogGateway, useClass: CatalogMockGateway }, /* ... */]
    : [{ provide: CatalogGateway, useClass: CatalogHttpGateway }, /* ... */];
}
```

## Virada completa

1. `src/environments/environment.ts`: `useMocks: false` e `apiBaseUrl` apontando para a API
   (ex.: `https://localhost:7001/api`).
2. Habilite CORS no ASP.NET Core para `http://localhost:4200`.
3. `npm start` e valide os fluxos: home → produto → carrinho → checkout → pedido; e o Admin.

## Virada parcial (recomendada durante a integração)

Migre um gateway por vez, deixando os demais em mock:

```ts
{ provide: CatalogGateway, useClass: CatalogHttpGateway },   // já integrado
{ provide: CheckoutGateway, useClass: CheckoutMockGateway }, // ainda mock
```

## Rotas HTTP esperadas pelos gateways

| Gateway | Método | Rota |
| --- | --- | --- |
| `CatalogHttpGateway` | GET | `/products`, `/products/{slug}`, `/products/{id}/related`, `/collections`, `/collections/{slug}`, `/home/showcase` |
| `CheckoutHttpGateway` | GET/POST | `/shipping/quote`, `/coupons/{code}`, `/orders` |
| `OrderTrackingHttpGateway` | GET | `/orders/lookup`, `/orders/code/{code}` |
| `AdminCatalogHttpGateway` | GET/POST/PUT | `/admin/products`, `/admin/products/{id}`, `/admin/variants/{id}/stock`, `/admin/collections` |
| `AdminSalesHttpGateway` | GET/PATCH | `/admin/orders`, `/admin/orders/{id}`, `/admin/orders/{id}/status`, `/admin/customers`, `/admin/coupons`, `/admin/dashboard` |

Se o backend usar outros caminhos, ajuste **apenas** os arquivos `*-http.gateway.ts`.

## O mock não deve morrer

Ele continua útil para desenvolvimento offline, demonstração e testes. Ao adicionar um método no
contrato abstrato, implemente nos **dois** lados (mock e HTTP) — o TypeScript vai cobrar isso.
