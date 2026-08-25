import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { SeoService } from '../../../../../core/services/seo.service';
import { CatalogGateway, HomeShowcase } from '../../../catalog/data-access/catalog.gateway';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { ShowcaseRowComponent } from '../../components/showcase-row/showcase-row.component';

const EMPTY: HomeShowcase = { featured: [], newArrivals: [], onSale: [], restocked: [], collections: [] };

/** Home: composicao de vitrines, sem regra de negocio propria. */
@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HeroBannerComponent, ShowcaseRowComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly catalog = inject(CatalogGateway);

  protected readonly showcase = toSignal(this.catalog.getHomeShowcase().pipe(catchError(() => of(EMPTY))), {
    initialValue: EMPTY,
  });

  constructor() {
    inject(SeoService).set('Colecionaveis de games', 'Pelucias, vinis, camisetas e artbooks oficiais.');
  }
}
