import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BrlPipe } from '../../pipes/brl.pipe';

/** Preco com tratamento de promocao (de/por + % off). */
@Component({
  selector: 'ui-price',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrlPipe],
  template: `
    @if (compareAt(); as old) {
      <s class="ui-price__old">{{ old | brl }}</s>
    }
    <strong class="ui-price__value">{{ value() | brl }}</strong>
    @if (discountPercent(); as percent) {
      <span class="ui-price__off">-{{ percent }}%</span>
    }
  `,
  styles: [
    `
      :host { display: inline-flex; align-items: baseline; gap: 0.4rem; }
      .ui-price__old { color: var(--color-text-muted); font-size: 0.85rem; }
      .ui-price__off { color: var(--color-danger); font-size: 0.8rem; font-weight: 700; }
    `,
  ],
})
export class PriceComponent {
  readonly value = input.required<number>();
  readonly compareAt = input<number | undefined>(undefined);

  readonly discountPercent = computed(() => {
    const old = this.compareAt();
    if (!old || old <= this.value()) {
      return null;
    }
    return Math.round(((old - this.value()) / old) * 100);
  });
}
