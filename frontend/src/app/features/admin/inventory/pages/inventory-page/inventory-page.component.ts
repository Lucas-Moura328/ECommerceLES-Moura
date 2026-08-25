import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { emptyPage } from '../../../../../core/api/api-response.model';
import { Product } from '../../../../../core/models';
import { NotificationService } from '../../../../../core/notifications/notification.service';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { ProductVariantsEditorComponent } from '../../../products/components/product-variants-editor/product-variants-editor.component';
import { AdminCatalogGateway } from '../../../shared/data-access/admin.gateway';

/** Visao consolidada de estoque por variante, com edicao inline. */
@Component({
  selector: 'app-inventory-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, ProductVariantsEditorComponent],
  template: `
    <ui-section-header title="Estoque" subtitle="Ajuste rapido por variante" />
    @for (product of products(); track product.id) {
      <section class="product">
        <h3>{{ product.title }}</h3>
        <app-product-variants-editor
          [variants]="toEditable(product)"
          (stockChange)="updateStock($event)"
        />
      </section>
    }
  `,
  styles: ['.product { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1rem 1.25rem; margin-bottom: 1rem; } .product h3 { margin: 0 0 0.5rem; font-size: 1rem; }'],
})
export class InventoryPageComponent {
  private readonly gateway = inject(AdminCatalogGateway);
  private readonly notifications = inject(NotificationService);

  private readonly page = toSignal(
    this.gateway.listProducts({ pageSize: 100 }).pipe(catchError(() => of(emptyPage<Product>()))),
    { initialValue: emptyPage<Product>() },
  );

  protected readonly products = computed(() => this.page().items);

  toEditable(product: Product) {
    return product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      sku: variant.sku,
      stock: variant.stock,
    }));
  }

  updateStock(change: { id: string; stock: number }): void {
    this.gateway.updateStock(change.id, change.stock).subscribe((response) =>
      this.notifications.success(response.message),
    );
  }
}
