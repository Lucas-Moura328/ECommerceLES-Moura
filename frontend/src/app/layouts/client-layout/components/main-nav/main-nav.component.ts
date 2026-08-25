import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, of } from 'rxjs';

import { CatalogGateway } from '../../../../features/client/catalog/data-access/catalog.gateway';

/** Navegacao principal alimentada pelas colecoes do catalogo. */
@Component({
  selector: 'app-main-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <a routerLink="/produtos" routerLinkActive="is-active">Tudo</a>
      @for (collection of collections(); track collection.id) {
        <a [routerLink]="['/colecoes', collection.slug]" routerLinkActive="is-active">{{ collection.name }}</a>
      }
    </nav>
  `,
  styles: [
    `
      .nav { display: flex; gap: 1rem; font-size: 0.92rem; }
      .nav a.is-active { color: var(--color-primary); font-weight: 600; }
    `,
  ],
})
export class MainNavComponent {
  private readonly catalog = inject(CatalogGateway);
  protected readonly collections = toSignal(
    this.catalog.listCollections().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );
}
