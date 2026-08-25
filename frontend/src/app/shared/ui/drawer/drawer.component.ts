import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Painel lateral: mini-cart, filtros no mobile, menu do Admin. */
@Component({
  selector: 'ui-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="ui-drawer__backdrop" (click)="closed.emit()"></div>
      <aside class="ui-drawer" [class.ui-drawer--left]="side() === 'left'">
        <header>
          <strong>{{ title() }}</strong>
          <button type="button" (click)="closed.emit()" aria-label="Fechar">×</button>
        </header>
        <div class="ui-drawer__body"><ng-content /></div>
      </aside>
    }
  `,
  styles: [
    `
      .ui-drawer__backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); z-index: 40; }
      .ui-drawer { position: fixed; z-index: 41; top: 0; right: 0; bottom: 0; width: min(420px, 92vw); background: var(--color-surface); display: flex; flex-direction: column; }
      .ui-drawer--left { right: auto; left: 0; }
      .ui-drawer header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--color-border); }
      .ui-drawer header button { border: 0; background: transparent; font-size: 1.25rem; cursor: pointer; }
      .ui-drawer__body { padding: 1.25rem; overflow: auto; flex: 1; }
    `,
  ],
})
export class DrawerComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly side = input<'left' | 'right'>('right');
  readonly closed = output<void>();
}
