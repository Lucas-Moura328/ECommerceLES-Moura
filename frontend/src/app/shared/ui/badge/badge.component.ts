import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Selo curto: "Novo", "Pre-venda", status de pedido, etc. */
@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="ui-badge" [class]="'ui-badge--' + tone()"><ng-content /></span>`,
  styles: [
    `
      .ui-badge {
        display: inline-block;
        padding: 0.15rem 0.55rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .ui-badge--neutral { background: var(--color-surface-2); color: var(--color-text-muted); }
      .ui-badge--success { background: #dcfce7; color: #166534; }
      .ui-badge--warning { background: #fef3c7; color: #92400e; }
      .ui-badge--danger { background: #fee2e2; color: #991b1b; }
      .ui-badge--info { background: #dbeafe; color: #1e40af; }
    `,
  ],
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
}
