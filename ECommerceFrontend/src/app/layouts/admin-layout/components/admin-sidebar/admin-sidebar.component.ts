import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Admin Sidebar Component
 * 
 * Sidebar de navegação da área administrativa.
 * 
 * Contém links para as principais funcionalidades do admin:
 * - Dashboard
 * - Clientes
 * - Produtos
 * - Pedidos
 * - Estoque
 * - Relatórios
 * - Configurações
 */
@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {
  // Links de navegação do admin
  navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/admin/customers', label: 'Clientes', icon: 'users' },
    { path: '/admin/products', label: 'Produtos', icon: 'package' },
    { path: '/admin/orders', label: 'Pedidos', icon: 'shopping-cart' },
    { path: '/admin/inventory', label: 'Estoque', icon: 'box' },
    { path: '/admin/reports', label: 'Relatórios', icon: 'bar-chart' },
    { path: '/admin/settings', label: 'Configurações', icon: 'settings' }
  ];

  // Método para obter o ícone SVG baseado no nome
  getIcon(iconName: string): string {
    // Placeholder - retorna ícones estáticos
    // Futuramente: pode usar um serviço de ícones
    return iconName;
  }
}
