import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './components/admin-topbar/admin-topbar.component';

/** Moldura do back-office: sidebar fixa + topbar + area de conteudo. */
@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AdminSidebarComponent, AdminTopbarComponent],
  template: `
    <div class="admin" [class.admin--collapsed]="collapsed()">
      <app-admin-sidebar [collapsed]="collapsed()" />
      <div class="admin__main">
        <app-admin-topbar (toggleMenu)="collapsed.set(!collapsed())" />
        <main class="admin__content"><router-outlet /></main>
      </div>
    </div>
  `,
  styles: [
    `
      .admin { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; background: var(--color-bg); }
      .admin--collapsed { grid-template-columns: 68px 1fr; }
      .admin__content { padding: 1.5rem; }
    `,
  ],
})
export class AdminLayoutComponent {
  protected readonly collapsed = signal(false);
}
