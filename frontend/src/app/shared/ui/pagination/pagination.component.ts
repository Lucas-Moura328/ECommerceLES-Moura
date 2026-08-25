import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'ui-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="ui-pagination">
        <button type="button" [disabled]="page() === 1" (click)="go(page() - 1)">Anterior</button>
        <span>{{ page() }} / {{ totalPages() }}</span>
        <button type="button" [disabled]="page() === totalPages()" (click)="go(page() + 1)">Proxima</button>
      </nav>
    }
  `,
  styles: [
    `
      .ui-pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; padding: 1.5rem 0; }
      .ui-pagination button { padding: 0.45rem 0.9rem; border: 1px solid var(--color-border); background: var(--color-surface); border-radius: var(--radius-md); cursor: pointer; }
    `,
  ],
})
export class PaginationComponent {
  readonly page = input(1);
  readonly pageSize = input(12);
  readonly total = input(0);
  readonly pageChange = output<number>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  go(page: number): void {
    this.pageChange.emit(page);
  }
}
