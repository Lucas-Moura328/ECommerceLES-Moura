import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MiniCartComponent } from '../mini-cart/mini-cart.component';

/**
 * Site Header Component
 * 
 * Header da loja contendo:
 * - Marca/logo
 * - Navegação principal (via MainNav)
 * - Barra de busca (via SearchBar)
 * - Ícone de favoritos
 * - Mini-carrinho (via MiniCart)
 * 
 * Este componente é fixo no topo da página e faz parte do Client Layout.
 */
@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [
    RouterLink,
    MainNavComponent,
    SearchBarComponent,
    MiniCartComponent
  ],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss'
})
export class SiteHeaderComponent {
  // Lógica do header pode ser adicionada aqui futuramente
  // Por exemplo: contador de itens no carrinho, toggle de menu mobile, etc.
}
