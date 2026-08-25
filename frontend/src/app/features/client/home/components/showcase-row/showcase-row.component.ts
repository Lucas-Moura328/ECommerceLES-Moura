import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductSummary } from '../../../../../core/models';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { ProductCardComponent } from '../../../catalog/components/product-card/product-card.component';

/** Faixa de vitrine da home ("Novidades", "Promocoes", "Repostos"). */
@Component({
  selector: 'app-showcase-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHeaderComponent, ProductCardComponent],
  template: `
    <section class="showcase">
      <ui-section-header [title]="title()" [subtitle]="subtitle()">
        <a routerLink="/produtos" class="muted">Ver tudo</a>
      </ui-section-header>
      <div class="grid-products">
        @for (product of products().slice(0, limit()); track product.id) {
          <app-product-card [product]="product" />
        }
      </div>
    </section>
  `,
  styles: ['.showcase { margin-bottom: 2.5rem; }'],
})
export class ShowcaseRowComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly products = input.required<readonly ProductSummary[]>();
  readonly limit = input(6);
}
