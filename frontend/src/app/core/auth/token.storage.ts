import { Injectable, signal } from '@angular/core';

/**
 * Guarda o access token. Hoje em memoria e sempre vazio (sem login).
 * Quando houver JWT + login persistente, trocar a fonte por localStorage /
 * cookie httpOnly sem tocar em nenhum outro arquivo.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly value = signal<string | null>(null);

  readonly token = this.value.asReadonly();

  set(token: string | null): void {
    this.value.set(token);
  }

  clear(): void {
    this.value.set(null);
  }
}
