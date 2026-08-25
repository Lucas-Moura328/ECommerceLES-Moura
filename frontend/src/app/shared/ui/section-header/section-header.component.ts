import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ui-section-header">
      <div>
        <h2>{{ title() }}</h2>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
      <ng-content />
    </header>
  `,
  styles: [
    `
      .ui-section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
      .ui-section-header h2 { margin: 0; font-size: 1.35rem; }
      .ui-section-header p { margin: 0.25rem 0 0; color: var(--color-text-muted); font-size: 0.9rem; }
    `,
  ],
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
}
