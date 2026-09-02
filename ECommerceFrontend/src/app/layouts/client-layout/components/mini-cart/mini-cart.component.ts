import { Component, signal } from '@angular/core';

/**
 * Mini Cart Component
 * 
 * Resumo lateral do carrinho de compras.
 * 
 * Placeholder nesta etapa.
 * Integração com carrinho será implementada futuramente.
 */
@Component({
  selector: 'app-mini-cart',
  standalone: true,
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.scss'
})
export class MiniCartComponent {
  // Placeholder - contador de itens no carrinho
  itemCount = signal(0);
  isOpen = signal(false);

  // Placeholder da função de abrir/fechar carrinho
  toggleCart(): void {
    this.isOpen.update(v => !v);
    console.log('Carrinho:', this.isOpen() ? 'aberto' : 'fechado');
    // Futuramente: integrar com serviço de carrinho
  }
}
