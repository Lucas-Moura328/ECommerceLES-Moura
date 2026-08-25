import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface TableColumn<T> {
  key: string;
  header: string;
  value: (row: T) => string;
  align?: 'left' | 'right';
}

/**
 * Tabela generica usada por todas as listagens do Admin.
 * Recebe colunas declarativas para nao replicar markup em cada CRUD.
 */
@Component({
  selector: 'ui-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="ui-table">
      <thead>
        <tr>
          @for (column of columns(); track column.key) {
            <th [style.text-align]="column.align ?? 'left'">{{ column.header }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track $index) {
          <tr (click)="rowClick.emit(row)">
            @for (column of columns(); track column.key) {
              <td [style.text-align]="column.align ?? 'left'">{{ column.value(row) }}</td>
            }
          </tr>
        } @empty {
          <tr>
            <td [attr.colspan]="columns().length" class="ui-table__empty">Nenhum registro.</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [
    `
      .ui-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
      .ui-table th, .ui-table td { padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--color-border); }
      .ui-table th { color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.04em; }
      .ui-table tbody tr:hover { background: var(--color-surface-2); cursor: pointer; }
      .ui-table__empty { text-align: center; color: var(--color-text-muted); padding: 2rem; }
    `,
  ],
})
export class DataTableComponent<T> {
  readonly columns = input.required<TableColumn<T>[]>();
  readonly rows = input.required<readonly T[]>();
  readonly rowClick = output<T>();
}
