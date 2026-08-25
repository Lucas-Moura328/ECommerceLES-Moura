import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CartStore } from '../../../../core/state/cart.store';
import { WishlistStore } from '../../../../core/state/wishlist.store';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { MiniCartComponent } from '../mini-cart/mini-cart.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

/** Header da loja: marca, navegacao, busca, favoritos e mini-carrinho. */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MainNavComponent, SearchBarComponent, MiniCartComponent],
  template: `
    <header class="header">
      <div class="container header__row">
        <a routerLink="/" class="header__brand">LES<span>Store</span></a>
        <app-main-nav />
        <app-search-bar class="header__search" (search)="onSearch($event)" />
        <div class="header__actions">
          <a routerLink="/favoritos" routerLinkActive="is-active">♥ {{ wishlist.count() }}</a>
          <button type="button" (click)="cartOpen.set(true)">Carrinho ({{ cart.itemCount() }})</button>
        </div>
      </div>
    </header>
    <app-mini-cart [open]="cartOpen()" (closed)="cartOpen.set(false)" />
  `,
  styles: [
    `
      .header { position: sticky; top: 0; z-index: 30; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
      .header__row { display: flex; align-items: center; gap: 1.5rem; min-height: var(--header-height); }
      .header__brand { font-weight: 800; font-size: 1.2rem; }
      .header__brand span { color: var(--color-primary); }
      .header__search { flex: 1; max-width: 420px; }
      .header__actions { display: flex; align-items: center; gap: 1rem; margin-left: auto; }
      .header__actions button { border: 0; background: var(--color-primary); color: #fff; padding: 0.5rem 0.9rem; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; }
    `,
  ],
})
export class SiteHeaderComponent {
  protected readonly cart = inject(CartStore);
  protected readonly wishlist = inject(WishlistStore);
  private readonly router = inject(Router);

  protected readonly cartOpen = signal(false);

  onSearch(term: string): void {
    this.router.navigate(['/busca'], { queryParams: { q: term } });
  }
}
