import { Injectable, signal } from '@angular/core';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // Tempo em ms, padrão 5000
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly toastsSignal = signal<ToastNotification[]>([]);
  public readonly toasts = this.toastsSignal.asReadonly();

  /**
   * Adiciona um toast genérico
   */
  addToast(toast: Omit<ToastNotification, 'id'>): string {
    const id = this.generateId();
    const duration = toast.duration ?? 5000;
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration,
    };

    this.toastsSignal.update((current) => [...current, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }

    return id;
  }

  /**
   * Atalho para toast de sucesso
   */
  success(title: string, message?: string, duration = 4000): string {
    return this.addToast({ type: 'success', title, message, duration });
  }

  /**
   * Atalho para toast de erro
   */
  error(title: string, message?: string, duration = 6000): string {
    return this.addToast({ type: 'error', title, message, duration });
  }

  /**
   * Atalho para toast de alerta
   */
  warning(title: string, message?: string, duration = 5000): string {
    return this.addToast({ type: 'warning', title, message, duration });
  }

  /**
   * Atalho para toast informativo
   */
  info(title: string, message?: string, duration = 4000): string {
    return this.addToast({ type: 'info', title, message, duration });
  }

  /**
   * Remove uma notificação por ID
   */
  removeToast(id: string): void {
    this.toastsSignal.update((current) => current.filter((t) => t.id !== id));
  }

  /**
   * Remove todas as notificações ativas
   */
  clearAll(): void {
    this.toastsSignal.set([]);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
