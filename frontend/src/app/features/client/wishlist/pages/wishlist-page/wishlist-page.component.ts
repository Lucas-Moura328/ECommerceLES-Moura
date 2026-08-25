import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { emptyPage } from '../../../../../core/api/api-response.model';
import { ProductSummary } from '../../../../../core/models';
import { WishlistStore } from '../../../../../core/state/wishlist.store';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { ProductGridComponent } from '../../../catalog/components/product-grid/product-grid.component';
import { CatalogGateway } from '../../../catalog/data-access/catalog.gateway';

/** Favoritos guardados no dispositivo (sem conta de usuario). */
@Component({
  selector: 'app-wishlist-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, ProductGridComponent],
  template: `
    <div class="container">
      <ui-section-header title="Favoritos" [subtitle]="wishlist.count() + ' itens salvos neste dispositivo'" />
      <app-product-grid [products]="products()" />
    </div>
  `,
})
export class WishlistPageComponent {
  private readonly catalog = inject(CatalogGateway);
  protected readonly wishlist = inject(WishlistStore);

  private readonly all = toSignal(
    this.catalog.listProducts({ pageSize: 100 }).pipe(catchError(() => of(emptyPage<ProductSummary>()))),
    { initialValue: emptyPage<ProductSummary>() },
  );

  protected readonly products = computed(() =>
    this.all().items.filter((product) => this.wishlist.productIds().includes(product.id)),
  );
}
