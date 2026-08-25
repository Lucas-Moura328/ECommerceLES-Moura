import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NotificationService } from '../../../../../core/notifications/notification.service';
import { FormFieldComponent } from '../../../../../shared/forms/form-field/form-field.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';

@Component({
  selector: 'app-contact-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SectionHeaderComponent, FormFieldComponent, ButtonComponent],
  template: `
    <div class="container narrow">
      <ui-section-header title="Fale com a gente" subtitle="Respondemos em ate 2 dias uteis" />
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ui-form-field label="Nome" [required]="true"><input formControlName="name" /></ui-form-field>
        <ui-form-field label="E-mail" [required]="true"><input type="email" formControlName="email" /></ui-form-field>
        <ui-form-field label="Mensagem" [required]="true"><textarea rows="5" formControlName="message"></textarea></ui-form-field>
        <ui-button type="submit" [disabled]="form.invalid">Enviar</ui-button>
      </form>
    </div>
  `,
  styles: ['.narrow { max-width: 560px; }'],
})
export class ContactPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.notifications.success('Mensagem enviada. Em breve retornamos!');
    this.form.reset();
  }
}
