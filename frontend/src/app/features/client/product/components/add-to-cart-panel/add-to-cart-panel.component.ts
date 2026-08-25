import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { ProductVariant, StockState } from '../../../../../core/models';
import { AlertComponent } from '../../../../../shared/ui/alert/alert.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { PriceComponent } from '../../../../../shared/ui/price/price.component';
import { QuantityStepperComponent } from '../../../../../shared/ui/quantity-stepper/quantity-stepper.component';

/** Bloco de compra: preco, quantidade e call-to-action. */
@Component({
  selector: 'app-add-to-cart-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, PriceComponent, QuantityStepperComponent, AlertComponent],
  template: `
    <div class="buy">
      <ui-price [value]="variant().price" [compareAt]="variant().compareAtPrice" />

      @if (stockState() === 'sold-out') {
        <ui-alert tone="error">Produto esgotado. Avisaremos quando voltar.</ui-alert>
      } @else {
        <div class="buy__row">
          <ui-quantity-stepper [value]="quantity()" [max]="variant().stock || 99" (valueChange)="quantity.set($event)" />
          <ui-button (clicked)="added.emit(quantity())">
            {{ stockState() === 'preorder' ? 'Pre-encomendar' : 'Adicionar ao carrinho' }}
          </ui-button>
        </div>
        <small class="muted">{{ variant().stock }} unidades disponiveis · SKU {{ variant().sku }}</small>
      }
    </div>
  `,
  styles: [
    `
      .buy { display: grid; gap: 0.75rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
      .buy__row { display: flex; gap: 0.75rem; align-items: center; }
    `,
  ],
})
export class AddToCartPanelComponent {
  readonly variant = input.required<ProductVariant>();
  readonly stockState = input<StockState>('in-stock');
  readonly added = output<number>();
  protected readonly quantity = signal(1);
}
