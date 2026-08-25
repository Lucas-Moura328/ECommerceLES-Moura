import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer__grid">
        <div>
          <strong>LES Store</strong>
          <p class="muted">Loja de colecionaveis de games — projeto academico LES.</p>
        </div>
        <nav>
          <strong>Loja</strong>
          <a routerLink="/produtos">Todos os produtos</a>
          <a routerLink="/colecoes">Colecoes</a>
          <a routerLink="/favoritos">Favoritos</a>
        </nav>
        <nav>
          <strong>Ajuda</strong>
          <a routerLink="/meus-pedidos">Rastrear pedido</a>
          <a routerLink="/institucional/faq">Perguntas frequentes</a>
          <a routerLink="/institucional/trocas">Trocas e devolucoes</a>
          <a routerLink="/contato">Contato</a>
        </nav>
        <nav>
          <strong>Institucional</strong>
          <a routerLink="/institucional/sobre">Sobre</a>
          <a routerLink="/institucional/privacidade">Privacidade</a>
        </nav>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer { background: var(--color-surface); border-top: 1px solid var(--color-border); padding: 2.5rem 0; margin-top: 3rem; }
      .footer__grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
      .footer nav { display: grid; gap: 0.35rem; font-size: 0.9rem; }
    `,
  ],
})
export class SiteFooterComponent {}
