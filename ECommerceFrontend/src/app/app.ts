import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AppComponent
 * 
 * Componente raiz da aplicação.
 * 
 * Contém apenas o RouterOutlet, que renderiza os layouts
 * (ClientLayout ou AdminLayout) baseado na rota atual.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // O componente raiz não precisa de lógica adicional
  // Toda a estrutura é definida pelas rotas e layouts
}

