import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FormFieldComponent } from '../../../../../shared/forms/form-field/form-field.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { CheckoutStepsComponent } from '../../components/checkout-steps/checkout-steps.component';
import { OrderSummaryAsideComponent } from '../../components/order-summary-aside/order-summary-aside.component';
import { CheckoutStore } from '../../data-access/checkout.store';

/** Passo 1 — dados de contato (guest checkout, sem conta). */
@Component({
  selector: 'app-identification-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CheckoutStepsComponent,
    OrderSummaryAsideComponent,
    FormFieldComponent,
    ButtonComponent,
  ],
  template: `
    <div class="container checkout-grid">
      <section>
        <app-checkout-steps [current]="0" />
        <form [formGroup]="form" (ngSubmit)="next()">
          <ui-form-field label="Nome completo" [required]="true"><input formControlName="name" /></ui-form-field>
          <ui-form-field label="E-mail" [required]="true" hint="Enviaremos o codigo do pedido para este e-mail.">
            <input type="email" formControlName="email" />
          </ui-form-field>
          <ui-form-field label="Telefone" [required]="true"><input formControlName="phone" /></ui-form-field>
          <ui-form-field label="CPF" [required]="true"><input formControlName="document" /></ui-form-field>
          <ui-button type="submit" [disabled]="form.invalid">Continuar para entrega</ui-button>
        </form>
      </section>
      <app-order-summary-aside />
    </div>
  `,
  styles: [
    '.checkout-grid { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }',
    '@media (max-width: 860px) { .checkout-grid { grid-template-columns: 1fr; } }',
  ],
})
export class IdentificationStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(CheckoutStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    document: ['', Validators.required],
  });

  constructor() {
    const saved = this.store.customer();
    if (saved) {
      this.form.patchValue(saved);
    }
  }

  next(): void {
    if (this.form.invalid) {
      return;
    }
    this.store.customer.set(this.form.getRawValue());
    this.router.navigate(['/checkout/entrega']);
  }
}
