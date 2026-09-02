import { Component, signal } from '@angular/core';

/**
 * Interface para notificações (toasts)
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // Tempo em ms, padrão 5000
}

/**
 * Toast Host Component
 * 
 * Container para notificações globais (toasts).
 * 
 * Este componente é montado uma vez em cada layout
 * e renderiza as notificações enviadas pelo NotificationService.
 * 
 * Posicionamento: top-right por padrão.
 */
@Component({
  selector: 'app-toast-host',
  standalone: true,
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.scss'
})
export class ToastHostComponent {
  // Signal com a lista de notificações ativas
  toasts = signal<ToastNotification[]>([]);

  /**
   * Adiciona uma nova notificação
   */
  addToast(toast: Omit<ToastNotification, 'id'>): void {
    const id = this.generateId();
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    this.toasts.update(current => [...current, newToast]);

    // Remove automaticamente após o duration
    setTimeout(() => {
      this.removeToast(id);
    }, newToast.duration);
  }

  /**
   * Remove uma notificação pelo ID
   */
  removeToast(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  /**
   * Remove todas as notificações
   */
  clearAll(): void {
    this.toasts.set([]);
  }

  /**
   * Gera um ID único para a notificação
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtém o ícone baseado no tipo de notificação
   */
  getIcon(type: ToastNotification['type']): string {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }
}
