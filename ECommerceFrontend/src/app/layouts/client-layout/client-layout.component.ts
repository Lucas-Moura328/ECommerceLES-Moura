import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { ToastHostComponent } from '../../shared/ui/toast-host/toast-host.component';

/**
 * Client Layout Component
 * 
 * Shell visual da área cliente (Storefront).
 * 
 * Estrutura:
 * - Barra de aviso (opcional)
 * - Site Header (marca, navegação, busca, carrinho)
 * - Conteúdo roteado (RouterOutlet)
 * - Site Footer (links, contato, redes sociais)
 * - Toast Host (notificações globais)
 * 
 * Este layout é aplicado a todas as rotas da área cliente.
 */
@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    ToastHostComponent
  ],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent {
  // Lógica do layout pode ser adicionada aqui futuramente
  // Por exemplo: controle de banner de aviso, tema, etc.
}
