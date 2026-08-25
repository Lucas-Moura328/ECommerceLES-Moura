import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FormFieldComponent } from '../../../../../shared/forms/form-field/form-field.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';

/** Consulta de pedido sem conta: codigo + e-mail. */
@Component({
  selector: 'app-order-lookup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SectionHeaderComponent, FormFieldComponent, ButtonComponent],
  template: `
    <div class="container narrow">
      <ui-section-header title="Acompanhar pedido" subtitle="Informe o codigo recebido por e-mail" />
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ui-form-field label="Codigo do pedido" [required]="true">
          <input formControlName="code" placeholder="LES-2026-1000" />
        </ui-form-field>
        <ui-form-field label="E-mail do pedido" [required]="true">
          <input type="email" formControlName="email" />
        </ui-form-field>
        <ui-button type="submit" [disabled]="form.invalid">Consultar</ui-button>
      </form>
    </div>
  `,
  styles: ['.narrow { max-width: 480px; }'],
})
export class OrderLookupPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    const { code, email } = this.form.getRawValue();
    this.router.navigate(['/pedido', code], { queryParams: { email } });
  }
}
