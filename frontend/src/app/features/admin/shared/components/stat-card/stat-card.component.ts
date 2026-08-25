import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** KPI do dashboard. */
@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat">
      <small class="muted">{{ label() }}</small>
      <strong>{{ value() }}</strong>
      @if (hint()) {
        <small class="muted">{{ hint() }}</small>
      }
    </div>
  `,
  styles: [
    `
      .stat { display: grid; gap: 0.2rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1rem 1.15rem; }
      .stat strong { font-size: 1.5rem; }
    `,
  ],
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input<string | null>(null);
}
