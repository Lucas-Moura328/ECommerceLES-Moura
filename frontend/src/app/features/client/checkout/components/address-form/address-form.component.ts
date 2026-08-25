import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormFieldComponent } from '../../../../../shared/forms/form-field/form-field.component';

/** Formulario de endereco reaproveitado no checkout e no Admin. */
@Component({
  selector: 'app-address-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormFieldComponent],
  template: `
    <div [formGroup]="form()" class="address">
      <ui-form-field label="CEP" [required]="true">
        <input formControlName="zipCode" placeholder="00000-000" (blur)="zipCodeBlur.emit()" />
      </ui-form-field>
      <ui-form-field label="Rua" [required]="true"><input formControlName="street" /></ui-form-field>
      <ui-form-field label="Numero" [required]="true"><input formControlName="number" /></ui-form-field>
      <ui-form-field label="Complemento"><input formControlName="complement" /></ui-form-field>
      <ui-form-field label="Bairro" [required]="true"><input formControlName="district" /></ui-form-field>
      <ui-form-field label="Cidade" [required]="true"><input formControlName="city" /></ui-form-field>
      <ui-form-field label="UF" [required]="true"><input formControlName="state" maxlength="2" /></ui-form-field>
    </div>
  `,
  styles: ['.address { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0 1rem; }'],
})
export class AddressFormComponent {
  readonly form = input.required<FormGroup>();
  readonly zipCodeBlur = output<void>();
}
