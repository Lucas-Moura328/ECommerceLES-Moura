import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  link?: unknown[];
}

@Component({
  selector: 'ui-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav class="ui-crumbs" aria-label="Trilha">
      @for (crumb of items(); track crumb.label) {
        @if (crumb.link) {
          <a [routerLink]="crumb.link">{{ crumb.label }}</a>
        } @else {
          <span>{{ crumb.label }}</span>
        }
        @if (!$last) {
          <span aria-hidden="true">/</span>
        }
      }
    </nav>
  `,
  styles: [
    `
      .ui-crumbs { display: flex; gap: 0.5rem; font-size: 0.85rem; color: var(--color-text-muted); padding: 1rem 0; }
      .ui-crumbs a { color: inherit; }
    `,
  ],
})
export class BreadcrumbsComponent {
  readonly items = input.required<Crumb[]>();
}
