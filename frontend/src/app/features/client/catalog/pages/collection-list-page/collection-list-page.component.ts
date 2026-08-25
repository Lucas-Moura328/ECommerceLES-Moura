import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';

import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { CatalogGateway } from '../../data-access/catalog.gateway';

/** Vitrine de colecoes (equivalente ao "Game Collections" do Fangamer). */
@Component({
  selector: 'app-collection-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHeaderComponent],
  template: `
    <div class="container">
      <ui-section-header title="Colecoes" subtitle="Explore por franquia e tipo de produto" />
      <div class="collections">
        @for (collection of collections(); track collection.id) {
          <a class="collection" [routerLink]="['/colecoes', collection.slug]">
            <img [src]="collection.image" [alt]="collection.name" />
            <div>
              <strong>{{ collection.name }}</strong>
              <small class="muted">{{ collection.productCount }} produtos</small>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .collections { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
      .collection { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
      .collection img { aspect-ratio: 16 / 9; object-fit: cover; width: 100%; }
      .collection div { padding: 0.85rem; display: grid; }
    `,
  ],
})
export class CollectionListPageComponent {
  private readonly catalog = inject(CatalogGateway);
  protected readonly collections = toSignal(this.catalog.listCollections().pipe(catchError(() => of([]))), {
    initialValue: [],
  });
}
