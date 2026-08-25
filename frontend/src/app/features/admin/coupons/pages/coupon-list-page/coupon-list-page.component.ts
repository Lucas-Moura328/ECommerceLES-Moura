import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Coupon } from '../../../../../core/models';
import { NotificationService } from '../../../../../core/notifications/notification.service';
import { FormFieldComponent } from '../../../../../shared/forms/form-field/form-field.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { DataTableComponent, TableColumn } from '../../../../../shared/ui/data-table/data-table.component';
import { ModalComponent } from '../../../../../shared/ui/modal/modal.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { AdminSalesGateway } from '../../../shared/data-access/admin.gateway';

@Component({
  selector: 'app-coupon-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SectionHeaderComponent,
    DataTableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
  ],
  template: `
    <ui-section-header title="Cupons" subtitle="Descontos ativos na loja">
      <ui-button (clicked)="modalOpen.set(true)">Novo cupom</ui-button>
    </ui-section-header>

    <ui-data-table [columns]="columns" [rows]="coupons()" />

    <ui-modal [open]="modalOpen()" title="Novo cupom" (closed)="modalOpen.set(false)">
      <form [formGroup]="form">
        <ui-form-field label="Codigo" [required]="true"><input formControlName="code" /></ui-form-field>
        <ui-form-field label="Tipo">
          <select formControlName="type">
            <option value="percent">Percentual</option>
            <option value="fixed">Valor fixo</option>
          </select>
        </ui-form-field>
        <ui-form-field label="Valor" [required]="true"><input type="number" formControlName="value" /></ui-form-field>
        <ui-form-field label="Subtotal minimo"><input type="number" formControlName="minSubtotal" /></ui-form-field>
      </form>
      <div modalFooter><ui-button (clicked)="save()">Salvar</ui-button></div>
    </ui-modal>
  `,
})
export class CouponListPageComponent {
  private readonly gateway = inject(AdminSalesGateway);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  protected readonly coupons = signal<Coupon[]>([]);
  protected readonly modalOpen = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    type: ['percent'],
    value: [10, [Validators.required, Validators.min(1)]],
    minSubtotal: [0],
  });

  protected readonly columns: TableColumn<Coupon>[] = [
    { key: 'code', header: 'Codigo', value: (row) => row.code },
    { key: 'type', header: 'Tipo', value: (row) => (row.type === 'percent' ? 'Percentual' : 'Fixo') },
    { key: 'value', header: 'Valor', value: (row) => String(row.value), align: 'right' },
    { key: 'min', header: 'Minimo', value: (row) => row.minSubtotal.toFixed(2), align: 'right' },
    { key: 'active', header: 'Ativo', value: (row) => (row.active ? 'Sim' : 'Nao') },
  ];

  constructor() {
    this.load();
  }

  private load(): void {
    this.gateway.listCoupons().subscribe((coupons) => this.coupons.set(coupons));
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    this.gateway
      .saveCoupon({ ...value, type: value.type as 'percent' | 'fixed' })
      .subscribe((response) => {
        this.notifications.success(response.message);
        this.modalOpen.set(false);
        this.form.reset({ type: 'percent', value: 10, minSubtotal: 0 });
        this.load();
      });
  }
}
