import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

import { emptyPage } from '../../../../../core/api/api-response.model';
import { Product } from '../../../../../core/models';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { DataTableComponent, TableColumn } from '../../../../../shared/ui/data-table/data-table.component';
import { PaginationComponent } from '../../../../../shared/ui/pagination/pagination.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { TableToolbarComponent } from '../../../shared/components/table-toolbar/table-toolbar.component';
import { AdminCatalogGateway, AdminListQuery } from '../../../shared/data-access/admin.gateway';

/** Listagem/CRUD de produtos: padrao seguido por todas as telas de lista. */
@Component({
  selector: 'app-product-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    SectionHeaderComponent,
    TableToolbarComponent,
    DataTableComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './product-list-page.component.html',
})
export class ProductListPageComponent {
  private readonly gateway = inject(AdminCatalogGateway);
  private readonly router = inject(Router);

  protected readonly query = signal<AdminListQuery>({ page: 1, pageSize: 10 });

  protected readonly result = toSignal(
    toObservable(this.query).pipe(
      debounceTime(200),
      switchMap((query) => this.gateway.listProducts(query).pipe(catchError(() => of(emptyPage<Product>())))),
    ),
    { initialValue: emptyPage<Product>() },
  );

  protected readonly statuses = [
    { value: 'active', label: 'Ativos' },
    { value: 'draft', label: 'Rascunhos' },
    { value: 'archived', label: 'Arquivados' },
  ];

  protected readonly columns: TableColumn<Product>[] = [
    { key: 'title', header: 'Produto', value: (row) => row.title },
    { key: 'franchise', header: 'Franquia', value: (row) => row.franchise },
    { key: 'price', header: 'Preco', value: (row) => row.price.toFixed(2), align: 'right' },
    {
      key: 'stock',
      header: 'Estoque',
      value: (row) => String(row.variants.reduce((sum, variant) => sum + variant.stock, 0)),
      align: 'right',
    },
    { key: 'status', header: 'Status', value: (row) => row.status },
  ];

  patch(change: Partial<AdminListQuery>): void {
    this.query.update((query) => ({ ...query, ...change, page: 1 }));
  }

  changePage(page: number): void {
    this.query.update((query) => ({ ...query, page }));
  }

  open(product: Product): void {
    this.router.navigate(['/admin/produtos', product.id]);
  }
}
