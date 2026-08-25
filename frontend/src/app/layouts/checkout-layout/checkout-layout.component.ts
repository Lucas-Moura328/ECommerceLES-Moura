import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/** Layout enxuto do checkout: sem menu, para reduzir evasao. */
@Component({
  selector: 'app-checkout-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="checkout-header">
      <div class="container">
        <a routerLink="/">LES<span>Store</span></a>
        <small class="muted">Ambiente seguro</small>
      </div>
    </header>
    <main class="page"><router-outlet /></main>
  `,
  styles: [
    `
      .checkout-header { background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
      .checkout-header .container { display: flex; align-items: center; justify-content: space-between; min-height: var(--header-height); font-weight: 800; }
      .checkout-header span { color: var(--color-primary); }
    `,
  ],
})
export class CheckoutLayoutComponent {}
