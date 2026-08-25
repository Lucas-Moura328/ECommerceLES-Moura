import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ProductVariant } from '../../../../../core/models';

/** Escolha de variante (tamanho, edicao, plataforma...). */
@Component({
  selector: 'app-variant-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="variants">
      <span class="variants__label">{{ optionName() }}</span>
      <div class="variants__options">
        @for (variant of variants(); track variant.id) {
          <button
            type="button"
            [class.is-selected]="variant.id === selectedId()"
            [disabled]="variant.stock === 0"
            (click)="selected.emit(variant)"
          >
            {{ variant.name }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .variants { display: grid; gap: 0.5rem; margin: 1rem 0; }
      .variants__label { font-weight: 600; font-size: 0.9rem; }
      .variants__options { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .variants__options button { padding: 0.5rem 0.9rem; border: 1px solid var(--color-border); background: var(--color-surface); border-radius: var(--radius-md); cursor: pointer; }
      .variants__options .is-selected { border-color: var(--color-primary); color: var(--color-primary); font-weight: 600; }
      .variants__options button:disabled { opacity: 0.45; text-decoration: line-through; cursor: not-allowed; }
    `,
  ],
})
export class VariantSelectorComponent {
  readonly optionName = input('Opcao');
  readonly variants = input.required<readonly ProductVariant[]>();
  readonly selectedId = input<string | null>(null);
  readonly selected = output<ProductVariant>();
}
