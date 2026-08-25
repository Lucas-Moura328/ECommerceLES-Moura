import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../../../../core/models';
import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';
import { QuantityStepperComponent } from '../../../../../shared/ui/quantity-stepper/quantity-stepper.component';

@Component({
  selector: 'app-cart-line-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, QuantityStepperComponent, BrlPipe],
  template: `
    <li class="line">
      <img [src]="item().image" [alt]="item().title" width="88" height="88" />
      <div class="line__info">
        <a [routerLink]="['/produto', item().slug]">{{ item().title }}</a>
        <small class="muted">{{ item().variantName }}</small>
        <button type="button" class="line__remove" (click)="removed.emit()">Remover</button>
      </div>
      <ui-quantity-stepper [value]="item().quantity" (valueChange)="quantityChange.emit($event)" />
      <strong>{{ item().unitPrice * item().quantity | brl }}</strong>
    </li>
  `,
  styles: [
    `
      .line { display: grid; grid-template-columns: 88px 1fr auto auto; gap: 1rem; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--color-border); }
      .line img { border-radius: var(--radius-md); }
      .line__info { display: grid; gap: 0.2rem; }
      .line__remove { justify-self: start; border: 0; background: none; padding: 0; color: var(--color-danger); cursor: pointer; font-size: 0.82rem; }
    `,
  ],
})
export class CartLineItemComponent {
  readonly item = input.required<CartItem>();
  readonly quantityChange = output<number>();
  readonly removed = output<void>();
}
