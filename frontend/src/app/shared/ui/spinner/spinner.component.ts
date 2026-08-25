import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="ui-spinner" [style.width.px]="size()" [style.height.px]="size()"></span>`,
  styles: [
    `
      .ui-spinner {
        display: inline-block;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: ui-spin 0.8s linear infinite;
      }
      @keyframes ui-spin { to { transform: rotate(360deg); } }
    `,
  ],
})
export class SpinnerComponent {
  readonly size = input(24);
}
