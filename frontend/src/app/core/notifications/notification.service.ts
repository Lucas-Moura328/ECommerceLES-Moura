import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  kind: NotificationKind;
  message: string;
}

/**
 * Toasts globais. As features apenas publicam a `message` que veio do
 * envelope da API; a renderizacao fica no ToastHost do shell.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  private readonly items = signal<Notification[]>([]);

  readonly notifications = this.items.asReadonly();

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
  }

  private push(kind: NotificationKind, message: string): void {
    const id = this.nextId++;
    this.items.update((list) => [...list, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
