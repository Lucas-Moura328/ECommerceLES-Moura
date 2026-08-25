---
name: api-response-contract
description: Consumir e evoluir o envelope Response<T> { message, dados } do backend ASP.NET Core.
---

# Contrato `Response<T>`

O backend **sempre** devolve:

```csharp
public class Response<T> { public string Message { get; set; } public T? Dados { get; set; } }
```

No front isso é `ApiResponse<T>` (nome diferente para não colidir com o `Response` do DOM):

```ts
export interface ApiResponse<T> { message: string; dados: T | null; }
```

## Regra de ouro

**Nenhum componente acessa `.dados`.** Só `core/api/api.service.ts` e os gateways conhecem o envelope.

| Situação | Método | Retorno |
| --- | --- | --- |
| Carregar dados de tela | `api.get<T>(path, params)` | `Observable<T>` (já desembrulhado; `dados: null` vira `ApiError(message)`) |
| Leitura em que a `message` importa | `api.getResponse<T>(...)` | `Observable<ApiResponse<T>>` |
| Criar / atualizar / excluir | `api.post/put/patch/delete<T>(...)` | `Observable<ApiResponse<T>>` — a tela mostra `response.message` no toast |

## Listagem paginada

`dados` carrega um `PagedResult<T>`:

```ts
{ items: T[]; page: number; pageSize: number; total: number }
```

No backend, devolva `Response<PagedResult<ProdutoDto>>`. Use `emptyPage<T>()` como `initialValue`
de `toSignal` e no `catchError`.

## Erros

`apiErrorInterceptor` transforma qualquer falha em `ApiError` usando a `message` do corpo
(cai para um texto genérico se o corpo não tiver o envelope) e dispara o toast.
Na página, trate apenas o **estado visual**:

```ts
this.gateway.salvar(payload).subscribe({
  next: (r) => { this.saving.set(false); this.notifications.success(r.message); },
  error: () => this.saving.set(false), // a mensagem já foi exibida pelo interceptor
});
```

## Checklist ao criar um endpoint novo no ASP.NET Core

- [ ] Retorna `Response<T>` mesmo em erro (`dados = null`, `message` preenchida).
- [ ] `message` em português, pronta para exibir ao usuário.
- [ ] Listagem devolve `PagedResult<T>`, nunca array cru.
- [ ] JSON em `camelCase` (padrão do `System.Text.Json`) para bater com os modelos TS.
- [ ] Modelo correspondente criado/atualizado em `src/app/core/models/`.
