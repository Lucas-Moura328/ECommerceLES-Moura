import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

import { Order, OrderStatus } from '../../../../../core/models';
import { NotificationService } from '../../../../../core/notifications/notification.service';
import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { OrderStatusTimelineComponent } from '../../../../client/orders/components/order-status-timeline/order-status-timeline.component';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge/order-status-badge.component';
import { AdminSalesGateway } from '../../../shared/data-access/admin.gateway';

/** Detalhe do pedido no Admin, com mudanca de status. */
@Component({
  selector: 'app-admin-order-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeaderComponent,
    CardComponent,
    ButtonComponent,
    OrderStatusBadgeComponent,
    OrderStatusTimelineComponent,
    BrlPipe,
  ],
  template: `
    @if (order(); as data) {
      <ui-section-header [title]="'Pedido ' + data.code" [subtitle]="data.customer.name">
        <app-order-status-badge [status]="data.status" />
      </ui-section-header>

      <app-order-status-timeline [status]="data.status" />

      <div class="grid">
        <ui-card title="Itens">
          <ul class="items">
            @for (item of data.items; track item.variantId) {
              <li>
                <span>{{ item.quantity }}x {{ item.title }} ({{ item.variantName }})</span>
                <strong>{{ item.unitPrice * item.quantity | brl }}</strong>
              </li>
            }
          </ul>
          <p class="total">Total <strong>{{ data.total | brl }}</strong></p>
        </ui-card>

        <ui-card title="Entrega">
          <p>{{ data.shippingAddress.street }}, {{ data.shippingAddress.number }}</p>
          <p>{{ data.shippingAddress.district }} — {{ data.shippingAddress.city }}/{{ data.shippingAddress.state }}</p>
          <p class="muted">CEP {{ data.shippingAddress.zipCode }}</p>
        </ui-card>

        <ui-card title="Alterar status">
          <select [value]="data.status" (change)="changeStatus(data.id, $any($event.target).value)">
            @for (status of statuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
          <ui-button variant="secondary" (clicked)="reload()">Recarregar</ui-button>
        </ui-card>
      </div>
    }
  `,
  styles: [
    '.grid { display: grid; gap: 1rem; grid-template-columns: 2fr 1fr 1fr; }',
    '.items { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem; }',
    '.items li { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.9rem; }',
    '.total { display: flex; justify-content: space-between; border-top: 1px solid var(--color-border); margin-top: 0.75rem; padding-top: 0.5rem; }',
    '@media (max-width: 1000px) { .grid { grid-template-columns: 1fr; } }',
  ],
})
export class AdminOrderDetailPageComponent {
  private readonly gateway = inject(AdminSalesGateway);
  private readonly notifications = inject(NotificationService);

  readonly id = input.required<string>();

  private readonly reloadToken = signal(0);

  protected readonly order = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.gateway.getOrder(id).pipe(catchError(() => of(null as Order | null)))),
    ),
    { initialValue: null },
  );

  protected readonly statuses: OrderStatus[] = [
    'pending',
    'paid',
    'packing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  changeStatus(id: string, status: OrderStatus): void {
    this.gateway.changeOrderStatus(id, status).subscribe((response) =>
      this.notifications.success(response.message),
    );
  }

  reload(): void {
    this.reloadToken.update((value) => value + 1);
  }
}
