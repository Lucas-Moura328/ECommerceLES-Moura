import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Search Bar Component
 * 
 * Barra de busca da loja.
 * 
 * Placeholder nesta etapa.
 * Integração com catálogo será implementada futuramente.
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  searchTerm = '';

  // Placeholder da função de busca
  onSearch(): void {
    console.log('Busca:', this.searchTerm);
    // Futuramente: integrar com serviço de catálogo
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
