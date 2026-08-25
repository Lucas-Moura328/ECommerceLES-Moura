import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Container visual generico (superficie + borda + padding). */
@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (title()) {
      <header class="ui-card__header">
        <h3>{{ title() }}</h3>
        <ng-content select="[cardActions]" />
      </header>
    }
    <div class="ui-card__body"><ng-content /></div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
      }
      .ui-card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--color-border);
      }
      .ui-card__header h3 { margin: 0; font-size: 1rem; }
      .ui-card__body { padding: 1.25rem; }
    `,
  ],
})
export class CardComponent {
  readonly title = input<string | null>(null);
}
