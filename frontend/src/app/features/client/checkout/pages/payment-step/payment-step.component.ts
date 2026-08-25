import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '../../../../../core/notifications/notification.service';
import { CartStore } from '../../../../../core/state/cart.store';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { CheckoutStepsComponent } from '../../components/checkout-steps/checkout-steps.component';
import { OrderSummaryAsideComponent } from '../../components/order-summary-aside/order-summary-aside.component';
import { CheckoutGateway } from '../../data-access/checkout.gateway';
import { CheckoutStore } from '../../data-access/checkout.store';

type Method = 'pix' | 'credit-card' | 'boleto';

/** Passo 3 — forma de pagamento e cupom. */
@Component({
  selector: 'app-payment-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckoutStepsComponent, OrderSummaryAsideComponent, ButtonComponent],
  template: `
    <div class="container checkout-grid">
      <section>
        <app-checkout-steps [current]="2" />

        <div class="methods">
          @for (method of methods; track method.id) {
            <label>
              <input type="radio" name="payment" [checked]="store.paymentMethod() === method.id" (change)="store.paymentMethod.set(method.id)" />
              <span>{{ method.label }}</span>
            </label>
          }
        </div>

        <div class="coupon">
          <input placeholder="Cupom de desconto" [value]="coupon()" (input)="coupon.set($any($event.target).value)" />
          <ui-button variant="secondary" (clicked)="applyCoupon()">Aplicar</ui-button>
        </div>

        <ui-button (clicked)="next()">Revisar pedido</ui-button>
      </section>
      <app-order-summary-aside />
    </div>
  `,
  styles: [
    '.checkout-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }',
    '.methods { display: grid; gap: 0.5rem; margin-bottom: 1.25rem; }',
    '.methods label { display: flex; gap: 0.5rem; align-items: center; }',
    '.methods input { width: auto; }',
    '.coupon { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }',
    '@media (max-width: 860px) { .checkout-grid { grid-template-columns: 1fr; } }',
  ],
})
export class PaymentStepComponent {
  protected readonly store = inject(CheckoutStore);
  private readonly gateway = inject(CheckoutGateway);
  private readonly cart = inject(CartStore);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly coupon = signal('');
  protected readonly methods: { id: Method; label: string }[] = [
    { id: 'pix', label: 'PIX (5% de desconto)' },
    { id: 'credit-card', label: 'Cartao de credito' },
    { id: 'boleto', label: 'Boleto bancario' },
  ];

  applyCoupon(): void {
    const code = this.coupon().trim();
    if (!code) {
      return;
    }
    this.gateway.validateCoupon(code, this.cart.totals().subtotal).subscribe((response) => {
      this.store.discount.set(response.dados ?? 0);
      this.notifications.info(response.message);
    });
  }

  next(): void {
    this.router.navigate(['/checkout/revisao']);
  }
}
