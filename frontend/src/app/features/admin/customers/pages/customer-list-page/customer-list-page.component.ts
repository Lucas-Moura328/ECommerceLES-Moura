import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

import { emptyPage } from '../../../../../core/api/api-response.model';
import { Customer } from '../../../../../core/models';
import { DataTableComponent, TableColumn } from '../../../../../shared/ui/data-table/data-table.component';
import { PaginationComponent } from '../../../../../shared/ui/pagination/pagination.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { TableToolbarComponent } from '../../../shared/components/table-toolbar/table-toolbar.component';
import { AdminListQuery, AdminSalesGateway } from '../../../shared/data-access/admin.gateway';

@Component({
  selector: 'app-customer-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, TableToolbarComponent, DataTableComponent, PaginationComponent],
  template: `
    <ui-section-header title="Clientes" [subtitle]="result().total + ' cadastros'" />
    <app-table-toolbar placeholder="Buscar por nome ou e-mail" (searchChange)="patch({ search: $event })" />
    <ui-data-table [columns]="columns" [rows]="result().items" />
    <ui-pagination
      [page]="result().page"
      [pageSize]="result().pageSize"
      [total]="result().total"
      (pageChange)="changePage($event)"
    />
  `,
})
export class CustomerListPageComponent {
  private readonly gateway = inject(AdminSalesGateway);

  protected readonly query = signal<AdminListQuery>({ page: 1, pageSize: 10 });

  protected readonly result = toSignal(
    toObservable(this.query).pipe(
      debounceTime(200),
      switchMap((query) => this.gateway.listCustomers(query).pipe(catchError(() => of(emptyPage<Customer>())))),
    ),
    { initialValue: emptyPage<Customer>() },
  );

  protected readonly columns: TableColumn<Customer>[] = [
    { key: 'name', header: 'Cliente', value: (row) => row.name },
    { key: 'email', header: 'E-mail', value: (row) => row.email },
    { key: 'orders', header: 'Pedidos', value: (row) => String(row.ordersCount), align: 'right' },
    { key: 'spent', header: 'Total gasto', value: (row) => row.totalSpent.toFixed(2), align: 'right' },
  ];

  patch(change: Partial<AdminListQuery>): void {
    this.query.update((query) => ({ ...query, ...change, page: 1 }));
  }

  changePage(page: number): void {
    this.query.update((query) => ({ ...query, page }));
  }
}
