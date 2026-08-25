import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartStore } from '../../../../../core/state/cart.store';
import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';
import { CartSummaryComponent } from '../../../cart/components/cart-summary/cart-summary.component';
import { CheckoutStore } from '../../data-access/checkout.store';

/** Coluna fixa do checkout com itens + totais. */
@Component({
  selector: 'app-order-summary-aside',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CartSummaryComponent, BrlPipe],
  template: `
    <aside class="aside">
      <ul>
        @for (item of cart.items(); track item.variantId) {
          <li>
            <img [src]="item.image" [alt]="item.title" width="48" height="48" />
            <span>{{ item.quantity }}x {{ item.title }}</span>
            <strong>{{ item.unitPrice * item.quantity | brl }}</strong>
          </li>
        }
      </ul>
      <app-cart-summary [totals]="checkout.totals()" />
    </aside>
  `,
  styles: [
    `
      .aside ul { list-style: none; margin: 0 0 1rem; padding: 0; display: grid; gap: 0.6rem; }
      .aside li { display: grid; grid-template-columns: 48px 1fr auto; gap: 0.6rem; align-items: center; font-size: 0.85rem; }
      .aside img { border-radius: var(--radius-sm); }
    `,
  ],
})
export class OrderSummaryAsideComponent {
  protected readonly cart = inject(CartStore);
  protected readonly checkout = inject(CheckoutStore);
}
