import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Menu do Admin: fonte unica das secoes do back-office. */
@Component({
  selector: 'app-admin-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <a routerLink="/admin" class="sidebar__brand">{{ collapsed() ? 'LES' : 'LES Admin' }}</a>
      <nav>
        @for (item of items; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: item.exact }">
            <span aria-hidden="true">{{ item.icon }}</span>
            @if (!collapsed()) {
              <span>{{ item.label }}</span>
            }
          </a>
        }
      </nav>
      <a routerLink="/" class="sidebar__store">{{ collapsed() ? '↩' : '↩ Ver loja' }}</a>
    </aside>
  `,
  styles: [
    `
      .sidebar { background: #0f172a; color: #cbd5e1; display: flex; flex-direction: column; gap: 0.25rem; padding: 1rem 0.6rem; }
      .sidebar__brand { font-weight: 800; color: #fff; padding: 0.5rem 0.6rem 1rem; }
      .sidebar nav { display: grid; gap: 0.15rem; }
      .sidebar nav a { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.6rem; border-radius: var(--radius-md); font-size: 0.9rem; }
      .sidebar nav a.is-active { background: rgba(255, 255, 255, 0.12); color: #fff; font-weight: 600; }
      .sidebar__store { margin-top: auto; padding: 0.6rem; font-size: 0.85rem; }
    `,
  ],
})
export class AdminSidebarComponent {
  readonly collapsed = input(false);

  protected readonly items = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '▦', exact: false },
    { path: '/admin/produtos', label: 'Produtos', icon: '📦', exact: false },
    { path: '/admin/colecoes', label: 'Colecoes', icon: '🗂', exact: false },
    { path: '/admin/estoque', label: 'Estoque', icon: '🏷', exact: false },
    { path: '/admin/pedidos', label: 'Pedidos', icon: '🧾', exact: false },
    { path: '/admin/clientes', label: 'Clientes', icon: '👥', exact: false },
    { path: '/admin/cupons', label: 'Cupons', icon: '🎟', exact: false },
    { path: '/admin/relatorios', label: 'Relatorios', icon: '📈', exact: false },
    { path: '/admin/configuracoes', label: 'Configuracoes', icon: '⚙', exact: false },
  ];
}
