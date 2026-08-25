import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ui-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ui-rating" [attr.aria-label]="value() + ' de 5'">
      @for (star of stars(); track $index) {
        <span [class.is-on]="star">★</span>
      }
      @if (count(); as total) {
        <small>({{ total }})</small>
      }
    </span>
  `,
  styles: [
    `
      .ui-rating { color: #d1d5db; font-size: 0.9rem; }
      .ui-rating .is-on { color: #f59e0b; }
      .ui-rating small { color: var(--color-text-muted); margin-left: 0.25rem; }
    `,
  ],
})
export class RatingComponent {
  readonly value = input(0);
  readonly count = input<number | null>(null);
  readonly stars = computed(() => [1, 2, 3, 4, 5].map((index) => index <= Math.round(this.value())));
}
