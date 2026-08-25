import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BrlPipe } from '../../../../../shared/pipes/brl.pipe';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import { CheckoutStepsComponent } from '../../components/checkout-steps/checkout-steps.component';
import { OrderSummaryAsideComponent } from '../../components/order-summary-aside/order-summary-aside.component';
import { CheckoutGateway, ShippingQuote } from '../../data-access/checkout.gateway';
import { CheckoutStore } from '../../data-access/checkout.store';

/** Passo 2 — endereco e escolha do frete. */
@Component({
  selector: 'app-shipping-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CheckoutStepsComponent,
    AddressFormComponent,
    OrderSummaryAsideComponent,
    ButtonComponent,
    BrlPipe,
  ],
  template: `
    <div class="container checkout-grid">
      <section>
        <app-checkout-steps [current]="1" />
        <form [formGroup]="form" (ngSubmit)="next()">
          <app-address-form [form]="form" (zipCodeBlur)="quote()" />

          @if (quotes().length) {
            <div class="quotes">
              @for (option of quotes(); track option.service) {
                <label>
                  <input type="radio" name="shipping" [checked]="selected()?.service === option.service" (change)="select(option)" />
                  <span>{{ option.service }} — {{ option.price | brl }} · ate {{ option.estimatedDays }} dias uteis</span>
                </label>
              }
            </div>
          }

          <ui-button type="submit" [disabled]="form.invalid || !selected()">Continuar para pagamento</ui-button>
        </form>
      </section>
      <app-order-summary-aside />
    </div>
  `,
  styles: [
    '.checkout-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }',
    '.quotes { display: grid; gap: 0.5rem; margin: 1rem 0; }',
    '.quotes label { display: flex; gap: 0.5rem; align-items: center; }',
    '.quotes input { width: auto; }',
    '@media (max-width: 860px) { .checkout-grid { grid-template-columns: 1fr; } }',
  ],
})
export class ShippingStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly gateway = inject(CheckoutGateway);
  private readonly store = inject(CheckoutStore);
  private readonly router = inject(Router);

  protected readonly quotes = signal<ShippingQuote[]>([]);
  protected readonly selected = signal<ShippingQuote | null>(this.store.shipping());

  protected readonly form = this.fb.nonNullable.group({
    zipCode: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    complement: [''],
    district: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });

  constructor() {
    const saved = this.store.address();
    if (saved) {
      this.form.patchValue(saved);
    }
  }

  quote(): void {
    const zipCode = this.form.controls.zipCode.value;
    if (zipCode.length < 8) {
      return;
    }
    this.gateway.quoteShipping(zipCode).subscribe((quotes) => this.quotes.set(quotes));
  }

  select(option: ShippingQuote): void {
    this.selected.set(option);
  }

  next(): void {
    const option = this.selected();
    if (this.form.invalid || !option) {
      return;
    }
    this.store.address.set(this.form.getRawValue());
    this.store.shipping.set(option);
    this.router.navigate(['/checkout/pagamento']);
  }
}
