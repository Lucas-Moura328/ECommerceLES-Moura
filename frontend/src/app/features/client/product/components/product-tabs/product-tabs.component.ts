import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { Product } from '../../../../../core/models';

/** Abas de descricao, caracteristicas e avaliacoes. */
@Component({
  selector: 'app-product-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="tabs">
      <nav>
        @for (tab of tabs; track tab) {
          <button type="button" [class.is-active]="tab === active()" (click)="active.set(tab)">{{ tab }}</button>
        }
      </nav>

      @switch (active()) {
        @case ('Descricao') {
          <p>{{ product().description }}</p>
        }
        @case ('Caracteristicas') {
          <ul>
            @for (feature of product().features; track feature) {
              <li>{{ feature }}</li>
            }
          </ul>
        }
        @default {
          <p class="muted">{{ product().reviewCount }} avaliacoes · nota media {{ product().rating.toFixed(1) }}.</p>
        }
      }
    </section>
  `,
  styles: [
    `
      .tabs { margin-top: 2.5rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; }
      .tabs nav { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1rem; }
      .tabs nav button { border: 0; background: none; padding: 0.6rem 0.4rem; cursor: pointer; color: var(--color-text-muted); }
      .tabs nav .is-active { color: var(--color-text); font-weight: 700; box-shadow: inset 0 -2px 0 var(--color-primary); }
    `,
  ],
})
export class ProductTabsComponent {
  readonly product = input.required<Product>();
  protected readonly tabs = ['Descricao', 'Caracteristicas', 'Avaliacoes'] as const;
  protected readonly active = signal<(typeof this.tabs)[number]>('Descricao');
}
