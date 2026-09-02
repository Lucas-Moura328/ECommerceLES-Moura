import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Main Nav Component
 * 
 * Navegação principal da loja.
 * 
 * Este componente será alimentado pelas coleções do catálogo
 * quando a funcionalidade for implementada.
 * 
 * Por enquanto, é um placeholder com links estáticos.
 */
@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss'
})
export class MainNavComponent {
  // Links estáticos placeholder
  // Futuramente: virão do serviço de catálogo
  navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/catalog', label: 'Catálogo' },
    { path: '/promotions', label: 'Promoções' },
    { path: '/about', label: 'Sobre' }
  ];
}
