import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartStore } from '../../../../../core/state/cart.store';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { CartLineItemComponent } from '../../components/cart-line-item/cart-line-item.component';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-cart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    SectionHeaderComponent,
    CartLineItemComponent,
    CartSummaryComponent,
    ButtonComponent,
    EmptyStateComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  protected readonly cart = inject(CartStore);
}
