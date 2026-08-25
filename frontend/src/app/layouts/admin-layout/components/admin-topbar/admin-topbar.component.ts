import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/** Barra superior do Admin (toggle do menu + identificacao do operador). */
@Component({
  selector: 'app-admin-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="topbar">
      <button type="button" (click)="toggleMenu.emit()" aria-label="Alternar menu">☰</button>
      <span class="muted">Modo mockup · sem autenticacao</span>
      <strong class="topbar__user">Operador</strong>
    </header>
  `,
  styles: [
    `
      .topbar { display: flex; align-items: center; gap: 1rem; background: var(--color-surface); border-bottom: 1px solid var(--color-border); padding: 0 1.25rem; min-height: var(--header-height); }
      .topbar button { border: 0; background: none; font-size: 1.1rem; cursor: pointer; }
      .topbar__user { margin-left: auto; }
    `,
  ],
})
export class AdminTopbarComponent {
  readonly toggleMenu = output<void>();
}
