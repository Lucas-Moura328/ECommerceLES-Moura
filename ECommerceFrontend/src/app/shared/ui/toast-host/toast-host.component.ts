import { Component, inject } from '@angular/core';
import {
  NotificationService,
  ToastNotification,
} from '../../../core/services/notification.service';

export type { ToastNotification };

/**
 * Toast Host Component
 *
 * Container para notificações globais (toasts).
 *
 * Este componente é montado uma vez em cada layout
 * e renderiza as notificações emitidas pelo NotificationService.
 *
 * Posicionamento: top-right por padrão.
 */
@Component({
  selector: 'app-toast-host',
  standalone: true,
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.scss',
})
export class ToastHostComponent {
  private readonly notificationService = inject(NotificationService);

  // Signal com a lista de notificações ativas compartilhada pelo NotificationService
  readonly toasts = this.notificationService.toasts;

  /**
   * Adiciona uma nova notificação através do serviço
   */
  addToast(toast: Omit<ToastNotification, 'id'>): void {
    this.notificationService.addToast(toast);
  }

  /**
   * Remove uma notificação pelo ID
   */
  removeToast(id: string): void {
    this.notificationService.removeToast(id);
  }

  /**
   * Remove todas as notificações
   */
  clearAll(): void {
    this.notificationService.clearAll();
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
