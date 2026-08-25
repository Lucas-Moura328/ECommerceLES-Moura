import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-empty">
      <strong>{{ title() }}</strong>
      @if (description()) {
        <p>{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .ui-empty {
        display: grid;
        gap: 0.5rem;
        justify-items: center;
        padding: 3rem 1rem;
        text-align: center;
        color: var(--color-text-muted);
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
}
