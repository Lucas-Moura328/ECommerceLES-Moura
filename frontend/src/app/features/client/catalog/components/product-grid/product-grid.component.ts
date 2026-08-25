import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProductSummary } from '../../../../../core/models';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { SkeletonComponent } from '../../../../../shared/ui/skeleton/skeleton.component';
import { ProductCardComponent } from '../product-card/product-card.component';

/** Grade responsiva com estados de carregando/vazio. */
@Component({
  selector: 'app-product-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCardComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    @if (loading()) {
      <div class="grid-products">
        @for (item of skeletons; track $index) {
          <ui-skeleton height="320px" />
        }
      </div>
    } @else if (products().length) {
      <div class="grid-products">
        @for (product of products(); track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
    } @else {
      <ui-empty-state title="Nenhum produto encontrado" description="Ajuste os filtros e tente novamente." />
    }
  `,
})
export class ProductGridComponent {
  readonly products = input.required<readonly ProductSummary[]>();
  readonly loading = input(false);
  protected readonly skeletons = Array.from({ length: 8 });
}
