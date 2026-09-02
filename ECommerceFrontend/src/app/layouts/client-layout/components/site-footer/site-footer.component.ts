import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Site Footer Component
 * 
 * Rodapé da loja contendo:
 * - Links institucionais
 * - Informações de contato
 * - Redes sociais
 * - Copyright
 */
@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss'
})
export class SiteFooterComponent {
  // Lógica do footer pode ser adicionada aqui futuramente
  // Por exemplo: ano dinâmico do copyright, etc.
}
