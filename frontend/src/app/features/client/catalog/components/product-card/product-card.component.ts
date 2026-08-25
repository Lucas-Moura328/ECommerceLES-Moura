import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductSummary } from '../../../../../core/models';
import { WishlistStore } from '../../../../../core/state/wishlist.store';
import { LazyImgDirective } from '../../../../../shared/directives/lazy-img.directive';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { PriceComponent } from '../../../../../shared/ui/price/price.component';
import { RatingComponent } from '../../../../../shared/ui/rating/rating.component';

/**
 * Cartao de produto: unico formato de vitrine usado em home, colecoes, busca,
 * relacionados e favoritos. Componente de apresentacao (sem chamadas de API).
 */
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LazyImgDirective, BadgeComponent, PriceComponent, RatingComponent],
  template: `
    <article class="card">
      <a [routerLink]="['/produto', product().slug]" class="card__media">
        <img appLazyImg [src]="product().image" [alt]="product().title" />
        <div class="card__flags">
          @if (product().isNew) {
            <ui-badge tone="info">Novo</ui-badge>
          }
          @if (product().stockState === 'preorder') {
            <ui-badge tone="warning">Pre-venda</ui-badge>
          }
          @if (product().stockState === 'sold-out') {
            <ui-badge tone="danger">Esgotado</ui-badge>
          }
        </div>
      </a>
      <div class="card__body">
        <small class="muted">{{ product().franchise }}</small>
        <a [routerLink]="['/produto', product().slug]" class="card__title">{{ product().title }}</a>
        <ui-rating [value]="product().rating" [count]="product().reviewCount" />
        <ui-price [value]="product().price" [compareAt]="product().compareAtPrice" />
      </div>
      <button type="button" class="card__wish" (click)="wishlist.toggle(product().id)" aria-label="Favoritar">
        {{ wishlist.has(product().id) ? '♥' : '♡' }}
      </button>
    </article>
  `,
  styles: [
    `
      .card { position: relative; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column; }
      .card__media { position: relative; display: block; aspect-ratio: 1; background: var(--color-surface-2); }
      .card__media img { width: 100%; height: 100%; object-fit: cover; }
      .card__flags { position: absolute; top: 0.6rem; left: 0.6rem; display: grid; gap: 0.3rem; justify-items: start; }
      .card__body { display: grid; gap: 0.3rem; padding: 0.85rem; }
      .card__title { font-weight: 600; font-size: 0.95rem; }
      .card__wish { position: absolute; top: 0.5rem; right: 0.5rem; border: 0; background: rgba(255, 255, 255, 0.9); border-radius: 999px; width: 2rem; height: 2rem; cursor: pointer; }
    `,
  ],
})
export class ProductCardComponent {
  readonly product = input.required<ProductSummary>();
  protected readonly wishlist = inject(WishlistStore);
}
