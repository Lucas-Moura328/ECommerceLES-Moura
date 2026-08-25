import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Banner principal (campanha/lancamento) da home. */
@Component({
  selector: 'app-hero-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div>
        <small>Pre-venda aberta</small>
        <h1>Colecionaveis oficiais dos seus jogos favoritos</h1>
        <p>Pelucias, vinis, camisetas e artbooks com envio para todo o Brasil.</p>
        <a routerLink="/produtos">Ver catalogo</a>
      </div>
    </section>
  `,
  styles: [
    `
      .hero { background: linear-gradient(120deg, #0f172a, #16a34a); color: #fff; border-radius: var(--radius-lg); padding: 3rem 2rem; margin-bottom: 2.5rem; }
      .hero h1 { margin: 0.5rem 0; font-size: clamp(1.6rem, 3vw, 2.4rem); max-width: 22ch; }
      .hero small { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; }
      .hero a { display: inline-block; margin-top: 1rem; background: #fff; color: var(--color-text); padding: 0.65rem 1.2rem; border-radius: var(--radius-md); font-weight: 700; }
    `,
  ],
})
export class HeroBannerComponent {}
