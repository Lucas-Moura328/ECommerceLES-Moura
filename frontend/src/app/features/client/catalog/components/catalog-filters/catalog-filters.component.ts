import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CatalogQuery } from '../../data-access/catalog.gateway';

/** Filtros laterais do catalogo (franquia, faixa de preco, promocoes). */
@Component({
  selector: 'app-catalog-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="filters">
      <h3>Filtros</h3>
      <label>
        <span>Franquia</span>
        <select [value]="query().franchise ?? ''" (change)="patch({ franchise: value($event) || undefined })">
          <option value="">Todas</option>
          @for (franchise of franchises(); track franchise) {
            <option [value]="franchise">{{ franchise }}</option>
          }
        </select>
      </label>
      <label>
        <span>Preco maximo</span>
        <input type="number" min="0" [value]="query().maxPrice ?? ''" (change)="patch({ maxPrice: number($event) })" />
      </label>
      <label class="filters__check">
        <input type="checkbox" [checked]="query().onSale ?? false" (change)="patch({ onSale: checked($event) })" />
        <span>Somente promocoes</span>
      </label>
      <button type="button" (click)="cleared.emit()">Limpar filtros</button>
    </aside>
  `,
  styles: [
    `
      .filters { display: grid; gap: 1rem; align-content: start; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.1rem; }
      .filters h3 { margin: 0; font-size: 1rem; }
      .filters label { display: grid; gap: 0.35rem; font-size: 0.88rem; }
      .filters__check { display: flex; align-items: center; gap: 0.5rem; }
      .filters__check input { width: auto; }
      .filters button { border: 1px solid var(--color-border); background: transparent; padding: 0.5rem; border-radius: var(--radius-md); cursor: pointer; }
    `,
  ],
})
export class CatalogFiltersComponent {
  readonly query = input.required<CatalogQuery>();
  readonly franchises = input<readonly string[]>([]);
  readonly queryChange = output<Partial<CatalogQuery>>();
  readonly cleared = output<void>();

  patch(change: Partial<CatalogQuery>): void {
    this.queryChange.emit(change);
  }

  value(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  number(event: Event): number | undefined {
    const raw = (event.target as HTMLInputElement).value;
    return raw ? Number(raw) : undefined;
  }

  checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
