import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

import { emptyPage } from '../../../../../core/api/api-response.model';
import { ProductSummary } from '../../../../../core/models';
import { BreadcrumbsComponent } from '../../../../../shared/ui/breadcrumbs/breadcrumbs.component';
import { PaginationComponent } from '../../../../../shared/ui/pagination/pagination.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { CatalogFiltersComponent } from '../../components/catalog-filters/catalog-filters.component';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { SortSelectComponent } from '../../components/sort-select/sort-select.component';
import { CatalogGateway, CatalogQuery } from '../../data-access/catalog.gateway';

/**
 * Listagem de produtos. Serve tanto /produtos quanto /colecoes/:slug
 * (o slug chega por component input binding).
 */
@Component({
  selector: 'app-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbsComponent,
    SectionHeaderComponent,
    CatalogFiltersComponent,
    ProductGridComponent,
    SortSelectComponent,
    PaginationComponent,
  ],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
})
export class CollectionPageComponent {
  private readonly catalog = inject(CatalogGateway);

  /** Vem da rota /colecoes/:slug; ausente em /produtos. */
  readonly slug = input<string | undefined>(undefined);

  protected readonly query = signal<CatalogQuery>({ page: 1, pageSize: 12, sort: 'relevance' });

  private readonly effectiveQuery = computed<CatalogQuery>(() => ({
    ...this.query(),
    collection: this.slug(),
  }));

  protected readonly result = toSignal(
    toObservable(this.effectiveQuery).pipe(
      switchMap((query) => this.catalog.listProducts(query).pipe(catchError(() => of(emptyPage<ProductSummary>())))),
    ),
    { initialValue: emptyPage<ProductSummary>() },
  );

  protected readonly collections = toSignal(this.catalog.listCollections().pipe(catchError(() => of([]))), {
    initialValue: [],
  });

  protected readonly title = computed(
    () => this.collections().find((collection) => collection.slug === this.slug())?.name ?? 'Todos os produtos',
  );

  protected readonly franchises = computed(() =>
    [...new Set(this.result().items.map((product) => product.franchise))].sort(),
  );

  patchQuery(change: Partial<CatalogQuery>): void {
    this.query.update((query) => ({ ...query, ...change, page: 1 }));
  }

  changePage(page: number): void {
    this.query.update((query) => ({ ...query, page }));
  }

  clearFilters(): void {
    this.query.set({ page: 1, pageSize: 12, sort: 'relevance' });
  }
}
