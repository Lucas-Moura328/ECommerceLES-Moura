import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';
import { OrderStatusPipe } from '../../../../../shared/pipes/order-status.pipe';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { OrderStatusTimelineComponent } from '../../components/order-status-timeline/order-status-timeline.component';
import { OrderTrackingGateway } from '../../data-access/order-tracking.gateway';

/** Detalhe publico do pedido (codigo na rota + e-mail na query string). */
@Component({
  selector: 'app-order-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeaderComponent,
    OrderStatusTimelineComponent,
    EmptyStateComponent,
    BrlPipe,
    OrderStatusPipe,
  ],
  template: `
    <div class="container">
      @if (order(); as data) {
        <ui-section-header [title]="'Pedido ' + data.code" [subtitle]="data.status | orderStatus" />
        <app-order-status-timeline [status]="data.status" />
        <ul class="items">
          @for (item of data.items; track item.variantId) {
            <li>
              <img [src]="item.image" [alt]="item.title" width="56" height="56" />
              <span>{{ item.quantity }}x {{ item.title }} ({{ item.variantName }})</span>
              <strong>{{ item.unitPrice * item.quantity | brl }}</strong>
            </li>
          }
        </ul>
        <p class="total">Total pago <strong>{{ data.total | brl }}</strong></p>
      } @else {
        <ui-empty-state title="Pedido nao encontrado" description="Confira o codigo e o e-mail informados." />
      }
    </div>
  `,
  styles: [
    `
      .items { list-style: none; padding: 0; display: grid; gap: 0.75rem; }
      .items li { display: grid; grid-template-columns: 56px 1fr auto; gap: 0.75rem; align-items: center; }
      .total { display: flex; gap: 0.5rem; justify-content: flex-end; font-size: 1.1rem; }
    `,
  ],
})
export class OrderDetailPageComponent {
  private readonly gateway = inject(OrderTrackingGateway);

  readonly code = input.required<string>();
  readonly email = input<string | undefined>(undefined);

  private readonly params = computed(() => ({ code: this.code(), email: this.email() ?? '' }));

  protected readonly order = toSignal(
    toObservable(this.params).pipe(
      switchMap(({ code, email }) => this.gateway.findByCode(code, email).pipe(catchError(() => of(null)))),
    ),
    { initialValue: null },
  );
}
