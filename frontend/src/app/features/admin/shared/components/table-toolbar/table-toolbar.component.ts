import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Barra de busca/filtro reutilizada por todas as listagens do Admin. */
@Component({
  selector: 'app-table-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toolbar">
      <input
        type="search"
        [placeholder]="placeholder()"
        (input)="searchChange.emit($any($event.target).value)"
      />
      @if (statuses().length) {
        <select (change)="statusChange.emit($any($event.target).value)">
          <option value="">Todos os status</option>
          @for (status of statuses(); track status.value) {
            <option [value]="status.value">{{ status.label }}</option>
          }
        </select>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .toolbar { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1rem; }
      .toolbar input { max-width: 320px; }
      .toolbar select { max-width: 200px; }
    `,
  ],
})
export class TableToolbarComponent {
  readonly placeholder = input('Buscar...');
  readonly statuses = input<{ value: string; label: string }[]>([]);
  readonly searchChange = output<string>();
  readonly statusChange = output<string>();
}
