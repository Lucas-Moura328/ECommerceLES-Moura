import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CartTotals } from '../../../../../core/models';
import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';

/** Resumo de valores reutilizado no carrinho e no checkout. */
@Component({
  selector: 'app-cart-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe],
  template: `
    <div class="summary">
      <h3>Resumo</h3>
      <p><span>Subtotal</span><span>{{ totals().subtotal | brl }}</span></p>
      @if (totals().discount) {
        <p><span>Desconto</span><span>-{{ totals().discount | brl }}</span></p>
      }
      <p><span>Frete</span><span>{{ totals().shipping ? (totals().shipping | brl) : 'Gratis' }}</span></p>
      <p class="summary__total"><span>Total</span><span>{{ totals().total | brl }}</span></p>
      <ng-content />
    </div>
  `,
  styles: [
    `
      .summary { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; display: grid; gap: 0.5rem; align-content: start; }
      .summary h3 { margin: 0 0 0.5rem; font-size: 1rem; }
      .summary p { display: flex; justify-content: space-between; margin: 0; font-size: 0.92rem; }
      .summary__total { border-top: 1px solid var(--color-border); padding-top: 0.6rem; margin-top: 0.4rem; font-size: 1.05rem; font-weight: 700; }
    `,
  ],
})
export class CartSummaryComponent {
  readonly totals = input.required<CartTotals>();
}
