import { Component } from '@angular/core';

/**
 * Admin Topbar Component
 * 
 * Barra superior da área administrativa.
 * 
 * Contém:
 * - Toggle do menu mobile
 * - Identificação do operador
 * - Logout
 */
@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  templateUrl: './admin-topbar.component.html',
  styleUrl: './admin-topbar.component.scss'
})
export class AdminTopbarComponent {
  isMenuOpen = false;

  // Placeholder do toggle do menu mobile
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menu:', this.isMenuOpen ? 'aberto' : 'fechado');
    // Futuramente: comunicar com o layout para mostrar/ocultar sidebar
  }

  // Placeholder do logout
  onLogout(): void {
    console.log('Logout');
    // Futuramente: integrar com serviço de autenticação
  }
}
