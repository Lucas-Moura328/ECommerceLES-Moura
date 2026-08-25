import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AnnouncementBarComponent } from './components/announcement-bar/announcement-bar.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';

/** Moldura da loja: barra de aviso + header + conteudo roteado + rodape. */
@Component({
  selector: 'app-client-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AnnouncementBarComponent, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <app-announcement-bar />
    <app-site-header />
    <main class="page"><router-outlet /></main>
    <app-site-footer />
  `,
})
export class ClientLayoutComponent {}
