import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AlertComponent } from '../../../../../shared/ui/alert/alert.component';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';

/** Configuracoes da loja (frete, politicas, integracoes). */
@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeaderComponent, CardComponent, AlertComponent],
  template: `
    <ui-section-header title="Configuracoes" subtitle="Parametros gerais da loja" />
    <ui-card title="Autenticacao">
      <ui-alert tone="info">
        Modo mockup: o Admin ainda nao exige login. Quando o JWT entrar, o adminGuard passa a validar a claim
        de administrador e o TokenStorage armazena o token.
      </ui-alert>
    </ui-card>
  `,
})
export class SettingsPageComponent {}
