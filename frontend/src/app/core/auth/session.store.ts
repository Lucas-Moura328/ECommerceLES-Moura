import { computed, inject, Injectable } from '@angular/core';

import { TokenStorage } from './token.storage';

export type Role = 'guest' | 'customer' | 'admin';

/**
 * Sessao minima (sem login). Enquanto nao ha autenticacao, o papel e resolvido
 * de forma otimista para permitir navegar no Admin durante o mockup.
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly tokens = inject(TokenStorage);

  readonly isAuthenticated = computed(() => this.tokens.token() !== null);
  readonly role = computed<Role>(() => (this.isAuthenticated() ? 'customer' : 'guest'));

  can(_role: Role): boolean {
    // TODO(auth): validar claims do JWT quando o login existir.
    return true;
  }
}
