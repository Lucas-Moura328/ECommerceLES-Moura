import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="ui-modal__backdrop" (click)="closed.emit()"></div>
      <div class="ui-modal" role="dialog" aria-modal="true">
        <header>
          <strong>{{ title() }}</strong>
          <button type="button" (click)="closed.emit()" aria-label="Fechar">×</button>
        </header>
        <div class="ui-modal__body"><ng-content /></div>
        <footer><ng-content select="[modalFooter]" /></footer>
      </div>
    }
  `,
  styles: [
    `
      .ui-modal__backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); z-index: 40; }
      .ui-modal { position: fixed; z-index: 41; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(560px, 92vw); background: var(--color-surface); border-radius: var(--radius-lg); }
      .ui-modal header, .ui-modal footer { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; }
      .ui-modal header { border-bottom: 1px solid var(--color-border); }
      .ui-modal__body { padding: 1.25rem; }
      .ui-modal header button { border: 0; background: transparent; font-size: 1.25rem; cursor: pointer; }
    `,
  ],
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly closed = output<void>();
}
