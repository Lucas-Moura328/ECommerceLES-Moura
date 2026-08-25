import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Placeholder de carregamento (evita layout shift nas grades). */
@Component({
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="ui-skeleton" [style.height]="height()" [style.width]="width()"></span>`,
  styles: [
    `
      .ui-skeleton {
        display: block;
        border-radius: var(--radius-sm);
        background: linear-gradient(90deg, #eceff3 25%, #f6f8fa 37%, #eceff3 63%);
        background-size: 400% 100%;
        animation: ui-skeleton 1.2s ease infinite;
      }
      @keyframes ui-skeleton { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
    `,
  ],
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1rem');
}
