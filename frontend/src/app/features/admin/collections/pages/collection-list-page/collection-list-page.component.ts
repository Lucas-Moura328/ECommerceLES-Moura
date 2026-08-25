import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { Collection } from '../../../../../core/models';
import { DataTableComponent, TableColumn } from '../../../../../shared/ui/data-table/data-table.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { AdminCatalogGateway } from '../../../shared/data-access/admin.gateway';

@Component({
  selector: 'app-admin-collection-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, DataTableComponent],
  template: `
    <ui-section-header title="Colecoes" subtitle="Agrupamentos exibidos na loja" />
    <ui-data-table [columns]="columns" [rows]="collections()" />
  `,
})
export class AdminCollectionListPageComponent {
  private readonly gateway = inject(AdminCatalogGateway);
  protected readonly collections = toSignal(this.gateway.listCollections().pipe(catchError(() => of([]))), {
    initialValue: [],
  });

  protected readonly columns: TableColumn<Collection>[] = [
    { key: 'name', header: 'Colecao', value: (row) => row.name },
    { key: 'slug', header: 'Slug', value: (row) => row.slug },
    { key: 'count', header: 'Produtos', value: (row) => String(row.productCount), align: 'right' },
    { key: 'featured', header: 'Destaque', value: (row) => (row.featured ? 'Sim' : 'Nao') },
  ];
}
