import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificationService } from '../../../core/notifications/notification.service';

/** Renderiza os toasts globais. Montado uma unica vez em cada layout. */
@Component({
  selector: 'ui-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-toasts" role="status" aria-live="polite">
      @for (toast of notifications.notifications(); track toast.id) {
        <div class="ui-toast" [class]="'ui-toast--' + toast.kind" (click)="notifications.dismiss(toast.id)">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ui-toasts { position: fixed; z-index: 60; right: 1rem; bottom: 1rem; display: grid; gap: 0.5rem; }
      .ui-toast { padding: 0.75rem 1rem; border-radius: var(--radius-md); color: #fff; cursor: pointer; box-shadow: var(--shadow-md); }
      .ui-toast--success { background: #16a34a; }
      .ui-toast--error { background: #dc2626; }
      .ui-toast--info { background: #2563eb; }
    `,
  ],
})
export class ToastHostComponent {
  protected readonly notifications = inject(NotificationService);
}
