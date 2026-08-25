import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartStore } from '../../../../core/state/cart.store';
import { BrlPipe } from '../../../../shared/pipes/brl.pipe';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { DrawerComponent } from '../../../../shared/ui/drawer/drawer.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

/** Resumo lateral do carrinho, aberto pelo header. */
@Component({
  selector: 'app-mini-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DrawerComponent, ButtonComponent, EmptyStateComponent, BrlPipe],
  template: `
    <ui-drawer [open]="open()" title="Seu carrinho" (closed)="closed.emit()">
      @if (cart.items().length) {
        <ul class="mini-cart">
          @for (item of cart.items(); track item.variantId) {
            <li>
              <img [src]="item.image" [alt]="item.title" width="56" height="56" />
              <div>
                <strong>{{ item.title }}</strong>
                <small class="muted">{{ item.variantName }} · {{ item.quantity }}x</small>
              </div>
              <span>{{ item.unitPrice * item.quantity | brl }}</span>
            </li>
          }
        </ul>
        <p class="mini-cart__total">Subtotal <strong>{{ cart.totals().subtotal | brl }}</strong></p>
        <a routerLink="/carrinho" (click)="closed.emit()">
          <ui-button>Ver carrinho</ui-button>
        </a>
      } @else {
        <ui-empty-state title="Carrinho vazio" description="Explore as colecoes e adicione itens." />
      }
    </ui-drawer>
  `,
  styles: [
    `
      .mini-cart { list-style: none; margin: 0 0 1rem; padding: 0; display: grid; gap: 0.75rem; }
      .mini-cart li { display: grid; grid-template-columns: 56px 1fr auto; gap: 0.75rem; align-items: center; }
      .mini-cart li img { border-radius: var(--radius-sm); }
      .mini-cart li strong { display: block; font-size: 0.9rem; }
      .mini-cart__total { display: flex; justify-content: space-between; border-top: 1px solid var(--color-border); padding-top: 0.75rem; }
    `,
  ],
})
export class MiniCartComponent {
  protected readonly cart = inject(CartStore);
  readonly open = input(false);
  readonly closed = output<void>();
}
