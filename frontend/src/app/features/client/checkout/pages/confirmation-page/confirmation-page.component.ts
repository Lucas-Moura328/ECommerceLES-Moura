import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../../../shared/ui/button/button.component';

/** Pedido confirmado: entrega o codigo para consulta futura (sem login). */
@Component({
  selector: 'app-confirmation-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="container confirmation">
      <h1>Pedido confirmado!</h1>
      <p>Guarde o codigo <strong>{{ code() }}</strong> para acompanhar seu pedido.</p>
      <a [routerLink]="['/pedido', code()]"><ui-button>Acompanhar pedido</ui-button></a>
      <a routerLink="/produtos" class="muted">Voltar ao catalogo</a>
    </div>
  `,
  styles: ['.confirmation { display: grid; gap: 0.75rem; justify-items: center; text-align: center; padding: 3rem 0; }'],
})
export class ConfirmationPageComponent {
  readonly code = input.required<string>();
}
