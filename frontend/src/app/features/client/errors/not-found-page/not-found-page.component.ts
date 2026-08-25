import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="container notfound">
      <h1>404</h1>
      <p>Pagina nao encontrada.</p>
      <a routerLink="/">Voltar para a loja</a>
    </div>
  `,
  styles: ['.notfound { display: grid; justify-items: center; gap: 0.5rem; padding: 4rem 0; text-align: center; }'],
})
export class NotFoundPageComponent {}
