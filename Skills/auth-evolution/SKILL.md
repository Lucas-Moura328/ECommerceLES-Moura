---
name: auth-evolution
description: Ligar JWT, login persistente e autorização real sem refatorar a aplicação.
---

# Evolução da autenticação

Hoje: **sem JWT, sem login persistente, sem sessão complexa.** Os pontos de extensão já existem e estão
desligados — nenhuma página precisa mudar quando a autenticação chegar.

| Peça | Estado atual | O que fazer no futuro |
| --- | --- | --- |
| `core/auth/token.storage.ts` | `signal<string \| null>(null)`, nada escreve | persistir no `localStorage` via `StorageService` e hidratar no bootstrap |
| `core/interceptors/auth.interceptor.ts` | só anexa `Authorization` se houver token (no-op) | nada — já funciona quando o token existir |
| `core/auth/session.store.ts` | usuário nulo, `can()` permissivo | carregar `/auth/me` no start e implementar `can(role)` de verdade |
| `core/guards/admin.guard.ts` | delega para `session.can('admin')` | passa a barrar sozinho quando o `SessionStore` for real |

## Passos quando o JWT entrar

1. Criar `features/auth/` com `login-page` e `AuthGateway` (`login`, `logout`, `me`) — mesmo padrão de
   gateway abstrato + HTTP + mock.
2. `TokenStorage.set(token)` no login bem-sucedido; `clear()` no logout.
3. Hidratar `SessionStore` no bootstrap (`provideAppInitializer`) chamando `/auth/me`.
4. Adicionar tratamento de `401` no `apiErrorInterceptor`: limpar token e redirecionar para `/login`.
5. Trocar `adminGuard` para exigir a role e adicionar `authGuard` nas rotas de conta do Cliente.
6. Refresh token (se houver): interceptor com fila de requisições pendentes.

## O que **não** fazer

- Não introduzir biblioteca de estado global só por causa da sessão — `SessionStore` com Signals basta.
- Não guardar token em componente, serviço de feature ou variável de módulo: só `TokenStorage`.
- Não exigir login para o fluxo de compra. O checkout é **guest** por decisão de produto (como o Fangamer);
  a conta é opcional.
- Não bloquear `/admin` em tempo de desenvolvimento antes de existir uma tela de login funcional.
