import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './components/admin-topbar/admin-topbar.component';
import { ToastHostComponent } from '../../shared/ui/toast-host/toast-host.component';

/**
 * Admin Layout Component
 * 
 * Shell visual da área administrativa (Backoffice).
 * 
 * Estrutura:
 * - Sidebar (navegação do admin)
 * - Topbar (toggle menu, identificação do operador)
 * - Conteúdo roteado (RouterOutlet)
 * - Toast Host (notificações globais)
 * 
 * Este layout é aplicado a todas as rotas da área administrativa.
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AdminSidebarComponent,
    AdminTopbarComponent,
    ToastHostComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  // Lógica do layout pode ser adicionada aqui futuramente
  // Por exemplo: controle do sidebar mobile, tema, etc.
}
