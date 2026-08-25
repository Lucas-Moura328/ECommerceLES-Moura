import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

import { emptyPage } from '../../../../../core/api/api-response.model';
import { ProductSummary } from '../../../../../core/models';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { CatalogGateway } from '../../data-access/catalog.gateway';

/** Resultado de busca (?q=). */
@Component({
  selector: 'app-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, ProductGridComponent],
  template: `
    <div class="container">
      <ui-section-header [title]="title()" [subtitle]="result().total + ' produtos'" />
      <app-product-grid [products]="result().items" />
    </div>
  `,
})
export class SearchPageComponent {
  private readonly catalog = inject(CatalogGateway);

  /** Query string ?q= ligada via withComponentInputBinding(). */
  readonly q = input<string | undefined>(undefined);

  private readonly term = computed(() => this.q() ?? '');

  protected readonly title = computed(() => `Resultados para "${this.term()}"`);

  protected readonly result = toSignal(
    toObservable(this.term).pipe(
      switchMap((search) =>
        this.catalog
          .listProducts({ search, pageSize: 24 })
          .pipe(catchError(() => of(emptyPage<ProductSummary>()))),
      ),
    ),
    { initialValue: emptyPage<ProductSummary>() },
  );
}
