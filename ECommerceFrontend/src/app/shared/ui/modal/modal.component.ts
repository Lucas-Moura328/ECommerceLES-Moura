import { Component, signal, output } from '@angular/core';

/**
 * Modal Component
 * 
 * Modal genérico para uso em toda a aplicação.
 * 
 * Estrutura:
 * - Overlay (fundo escuro com fechamento ao clicar)
 * - Container do modal
 * - Header (título + botão de fechar)
 * - Body (conteúdo via ng-content)
 * - Footer (ações via ng-content)
 * 
 * Este componente é crucial para cadastros e atualizações futuras.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  // Signal para controlar se o modal está aberto
  isOpen = signal(false);

  // Outputs para eventos do modal
  closeModal = output<void>(); // Emitido quando o modal é fechado

  // Título do modal (opcional)
  title = '';

  // Flag para verificar se há footer
  hasFooter = signal(false);

  /**
   * Abre o modal
   */
  open(): void {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden'; // Previne scroll do body
  }

  /**
   * Fecha o modal
   */
  closeModalAction(): void {
    this.isOpen.set(false);
    document.body.style.overflow = ''; // Restaura scroll do body
    this.closeModal.emit();
  }

  /**
   * Trata clique no overlay
   * Fecha o modal se clicar fora do container
   */
  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModalAction();
    }
  }

  /**
   * Trata tecla ESC
   * Fecha o modal ao pressionar ESC
   */
  onEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen()) {
      this.closeModalAction();
    }
  }
}
