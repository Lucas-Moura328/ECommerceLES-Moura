import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

import { emptyPage } from '../../../../../core/api/api-response.model';
import { Order } from '../../../../../core/models';
import { DataTableComponent, TableColumn } from '../../../../../shared/ui/data-table/data-table.component';
import { PaginationComponent } from '../../../../../shared/ui/pagination/pagination.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { TableToolbarComponent } from '../../../shared/components/table-toolbar/table-toolbar.component';
import { AdminListQuery, AdminSalesGateway } from '../../../shared/data-access/admin.gateway';

@Component({
  selector: 'app-admin-order-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, TableToolbarComponent, DataTableComponent, PaginationComponent],
  template: `
    <ui-section-header title="Pedidos" [subtitle]="result().total + ' pedidos'" />

    <app-table-toolbar
      placeholder="Buscar por codigo ou cliente"
      [statuses]="statuses"
      (searchChange)="patch({ search: $event })"
      (statusChange)="patch({ status: $event })"
    />

    <ui-data-table [columns]="columns" [rows]="result().items" (rowClick)="open($event)" />

    <ui-pagination
      [page]="result().page"
      [pageSize]="result().pageSize"
      [total]="result().total"
      (pageChange)="changePage($event)"
    />
  `,
})
export class AdminOrderListPageComponent {
  private readonly gateway = inject(AdminSalesGateway);
  private readonly router = inject(Router);

  protected readonly query = signal<AdminListQuery>({ page: 1, pageSize: 10 });

  protected readonly result = toSignal(
    toObservable(this.query).pipe(
      debounceTime(200),
      switchMap((query) => this.gateway.listOrders(query).pipe(catchError(() => of(emptyPage<Order>())))),
    ),
    { initialValue: emptyPage<Order>() },
  );

  protected readonly statuses = [
    { value: 'pending', label: 'Aguardando pagamento' },
    { value: 'paid', label: 'Pago' },
    { value: 'packing', label: 'Em separacao' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  protected readonly columns: TableColumn<Order>[] = [
    { key: 'code', header: 'Codigo', value: (row) => row.code },
    { key: 'customer', header: 'Cliente', value: (row) => row.customer.name },
    { key: 'date', header: 'Data', value: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR') },
    { key: 'total', header: 'Total', value: (row) => row.total.toFixed(2), align: 'right' },
    { key: 'status', header: 'Status', value: (row) => row.status },
  ];

  patch(change: Partial<AdminListQuery>): void {
    this.query.update((query) => ({ ...query, ...change, page: 1 }));
  }

  changePage(page: number): void {
    this.query.update((query) => ({ ...query, page }));
  }

  open(order: Order): void {
    this.router.navigate(['/admin/pedidos', order.id]);
  }
}
