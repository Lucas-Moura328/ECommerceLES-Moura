import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OrderStatus } from '../../../../../core/models';

const FLOW: OrderStatus[] = ['pending', 'paid', 'packing', 'shipped', 'delivered'];
const LABELS: Record<OrderStatus, string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  packing: 'Em separacao',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

/** Linha do tempo do pedido (cliente e admin usam o mesmo componente). */
@Component({
  selector: 'app-order-status-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="timeline">
      @for (step of flow; track step; let i = $index) {
        <li [class.is-done]="i <= currentIndex()">{{ labels[step] }}</li>
      }
    </ol>
  `,
  styles: [
    `
      .timeline { list-style: none; display: flex; gap: 1rem; padding: 0; margin: 1rem 0; flex-wrap: wrap; font-size: 0.85rem; color: var(--color-text-muted); }
      .timeline .is-done { color: var(--color-primary); font-weight: 600; }
    `,
  ],
})
export class OrderStatusTimelineComponent {
  readonly status = input.required<OrderStatus>();
  protected readonly flow = FLOW;
  protected readonly labels = LABELS;
  protected readonly currentIndex = computed(() => FLOW.indexOf(this.status()));
}
