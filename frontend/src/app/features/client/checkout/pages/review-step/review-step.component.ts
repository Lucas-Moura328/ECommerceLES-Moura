import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '../../../../../core/notifications/notification.service';
import { CartStore } from '../../../../../core/state/cart.store';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { CheckoutStepsComponent } from '../../components/checkout-steps/checkout-steps.component';
import { OrderSummaryAsideComponent } from '../../components/order-summary-aside/order-summary-aside.component';
import { CheckoutGateway } from '../../data-access/checkout.gateway';
import { CheckoutStore } from '../../data-access/checkout.store';

/** Passo 4 — confere os dados e envia o pedido. */
@Component({
  selector: 'app-review-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckoutStepsComponent, OrderSummaryAsideComponent, ButtonComponent],
  template: `
    <div class="container checkout-grid">
      <section>
        <app-checkout-steps [current]="3" />

        <dl class="review">
          <dt>Contato</dt>
          <dd>{{ store.customer()?.name }} · {{ store.customer()?.email }}</dd>
          <dt>Entrega</dt>
          <dd>
            {{ store.address()?.street }}, {{ store.address()?.number }} — {{ store.address()?.city }}/{{ store.address()?.state }}
          </dd>
          <dt>Frete</dt>
          <dd>{{ store.shipping()?.service }}</dd>
          <dt>Pagamento</dt>
          <dd>{{ store.paymentMethod() }}</dd>
        </dl>

        <ui-button [loading]="submitting()" (clicked)="placeOrder()">Confirmar pedido</ui-button>
      </section>
      <app-order-summary-aside />
    </div>
  `,
  styles: [
    '.checkout-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }',
    '.review { display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem 1rem; margin-bottom: 1.5rem; }',
    '.review dt { color: var(--color-text-muted); }',
    '.review dd { margin: 0; }',
    '@media (max-width: 860px) { .checkout-grid { grid-template-columns: 1fr; } }',
  ],
})
export class ReviewStepComponent {
  protected readonly store = inject(CheckoutStore);
  private readonly gateway = inject(CheckoutGateway);
  private readonly cart = inject(CartStore);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);

  placeOrder(): void {
    const customer = this.store.customer();
    const address = this.store.address();
    if (!customer || !address) {
      this.router.navigate(['/checkout/identificacao']);
      return;
    }

    this.submitting.set(true);
    this.gateway
      .placeOrder({
        customer,
        shippingAddress: address,
        items: this.cart.items(),
        paymentMethod: this.store.paymentMethod(),
      })
      .subscribe({
        next: (response) => {
          this.submitting.set(false);
          this.notifications.success(response.message);
          if (response.dados) {
            this.cart.clear();
            this.store.reset();
            this.router.navigate(['/checkout/confirmacao', response.dados.code]);
          }
        },
        error: () => this.submitting.set(false),
      });
  }
}
