import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OrderStatus } from '../../../../../core/models';
import { OrderStatusPipe } from '../../../../../shared/pipes/order-status.pipe';
import { BadgeComponent, BadgeTone } from '../../../../../shared/ui/badge/badge.component';

const TONES: Record<OrderStatus, BadgeTone> = {
  pending: 'warning',
  paid: 'info',
  packing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

@Component({
  selector: 'app-order-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, OrderStatusPipe],
  template: `<ui-badge [tone]="tone()">{{ status() | orderStatus }}</ui-badge>`,
})
export class OrderStatusBadgeComponent {
  readonly status = input.required<OrderStatus>();
  protected readonly tone = computed(() => TONES[this.status()]);
}
