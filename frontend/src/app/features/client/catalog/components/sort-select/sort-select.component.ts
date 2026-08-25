import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CatalogQuery } from '../../data-access/catalog.gateway';

type Sort = NonNullable<CatalogQuery['sort']>;

@Component({
  selector: 'app-sort-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="sort">
      <span class="muted">Ordenar por</span>
      <select [value]="value()" (change)="sortChange.emit($any($event.target).value)">
        <option value="relevance">Relevancia</option>
        <option value="newest">Novidades</option>
        <option value="price-asc">Menor preco</option>
        <option value="price-desc">Maior preco</option>
      </select>
    </label>
  `,
  styles: ['.sort { display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; } .sort select { width: auto; }'],
})
export class SortSelectComponent {
  readonly value = input<Sort>('relevance');
  readonly sortChange = output<Sort>();
}
