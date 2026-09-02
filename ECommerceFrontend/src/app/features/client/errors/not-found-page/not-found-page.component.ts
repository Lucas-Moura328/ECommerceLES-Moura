import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Not Found Page Component
 * 
 * Página 404 - Página não encontrada.
 * 
 * Exibida quando o usuário acessa uma rota que não existe.
 */
@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {
  // Lógica da página 404 pode ser adicionada aqui futuramente
}
