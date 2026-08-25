import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

import { Product, ProductVariant } from '../../../../../core/models';
import { NotificationService } from '../../../../../core/notifications/notification.service';
import { SeoService } from '../../../../../core/services/seo.service';
import { CartStore } from '../../../../../core/state/cart.store';
import { BreadcrumbsComponent } from '../../../../../shared/ui/breadcrumbs/breadcrumbs.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { ProductGridComponent } from '../../../catalog/components/product-grid/product-grid.component';
import { CatalogGateway } from '../../../catalog/data-access/catalog.gateway';
import { AddToCartPanelComponent } from '../../components/add-to-cart-panel/add-to-cart-panel.component';
import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery.component';
import { ProductTabsComponent } from '../../components/product-tabs/product-tabs.component';
import { VariantSelectorComponent } from '../../components/variant-selector/variant-selector.component';

/** Pagina de produto: orquestra galeria, variantes, compra e relacionados. */
@Component({
  selector: 'app-product-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbsComponent,
    SectionHeaderComponent,
    ProductGalleryComponent,
    VariantSelectorComponent,
    AddToCartPanelComponent,
    ProductTabsComponent,
    ProductGridComponent,
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  private readonly catalog = inject(CatalogGateway);
  private readonly cart = inject(CartStore);
  private readonly notifications = inject(NotificationService);
  private readonly seo = inject(SeoService);

  readonly slug = input.required<string>();

  protected readonly product = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) => this.catalog.getProductBySlug(slug).pipe(catchError(() => of(null)))),
    ),
    { initialValue: null },
  );

  protected readonly related = toSignal(
    toObservable(this.product).pipe(
      switchMap((product) =>
        product ? this.catalog.listRelated(product.id).pipe(catchError(() => of([]))) : of([]),
      ),
    ),
    { initialValue: [] },
  );

  private readonly selectedVariantId = signal<string | null>(null);

  protected readonly variant = computed<ProductVariant | null>(() => {
    const product = this.product();
    if (!product) {
      return null;
    }
    return product.variants.find((item) => item.id === this.selectedVariantId()) ?? product.variants[0];
  });

  constructor() {
    effect(() => {
      const product = this.product();
      if (product) {
        this.selectedVariantId.set(product.variants[0]?.id ?? null);
        this.seo.set(product.title, product.description);
      }
    });
  }

  selectVariant(variant: ProductVariant): void {
    this.selectedVariantId.set(variant.id);
  }

  addToCart(quantity: number): void {
    const product = this.product();
    const variant = this.variant();
    if (!product || !variant) {
      return;
    }
    this.cart.add({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      title: product.title,
      variantName: variant.name,
      image: product.image,
      unitPrice: variant.price,
      quantity,
    });
    this.notifications.success('Produto adicionado ao carrinho.');
  }

  protected optionName(product: Product): string {
    return product.options[0]?.name ?? 'Opcao';
  }
}
