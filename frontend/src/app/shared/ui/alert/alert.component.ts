import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="ui-alert" [class]="'ui-alert--' + tone()"><ng-content /></div>`,
  styles: [
    `
      .ui-alert { padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.9rem; }
      .ui-alert--info { background: #eff6ff; color: #1e40af; }
      .ui-alert--success { background: #ecfdf5; color: #065f46; }
      .ui-alert--error { background: #fef2f2; color: #991b1b; }
    `,
  ],
})
export class AlertComponent {
  readonly tone = input<'info' | 'success' | 'error'>('info');
}
