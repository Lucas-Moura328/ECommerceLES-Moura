import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface EditableVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
}

/** Edicao inline do estoque de cada variante. */
@Component({
  selector: 'app-product-variants-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="variants">
      <thead>
        <tr><th>Variante</th><th>SKU</th><th>Estoque</th></tr>
      </thead>
      <tbody>
        @for (variant of variants(); track variant.id) {
          <tr>
            <td>{{ variant.name }}</td>
            <td class="muted">{{ variant.sku }}</td>
            <td>
              <input
                type="number"
                min="0"
                [value]="variant.stock"
                (change)="stockChange.emit({ id: variant.id, stock: +$any($event.target).value })"
              />
            </td>
          </tr>
        } @empty {
          <tr><td colspan="3" class="muted">Nenhuma variante cadastrada.</td></tr>
        }
      </tbody>
    </table>
  `,
  styles: [
    `
      .variants { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
      .variants th, .variants td { padding: 0.5rem 0.4rem; border-bottom: 1px solid var(--color-border); text-align: left; }
      .variants input { max-width: 110px; }
    `,
  ],
})
export class ProductVariantsEditorComponent {
  readonly variants = input.required<readonly EditableVariant[]>();
  readonly stockChange = output<{ id: string; stock: number }>();
}
