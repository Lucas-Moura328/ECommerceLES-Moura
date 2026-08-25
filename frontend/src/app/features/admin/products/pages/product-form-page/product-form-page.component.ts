import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService } from '../../../../../core/notifications/notification.service';
import { FormFieldComponent } from '../../../../../shared/forms/form-field/form-field.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { SectionHeaderComponent } from '../../../../../shared/ui/section-header/section-header.component';
import { AdminCatalogGateway } from '../../../shared/data-access/admin.gateway';
import { ProductVariantsEditorComponent } from '../../components/product-variants-editor/product-variants-editor.component';

/** Formulario de criacao/edicao de produto (rota /novo e /:id). */
@Component({
  selector: 'app-product-form-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SectionHeaderComponent,
    CardComponent,
    FormFieldComponent,
    ButtonComponent,
    ProductVariantsEditorComponent,
  ],
  template: `
    <ui-section-header [title]="id() ? 'Editar produto' : 'Novo produto'" />

    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <ui-card title="Dados basicos">
        <ui-form-field label="Titulo" [required]="true"><input formControlName="title" /></ui-form-field>
        <ui-form-field label="Franquia" [required]="true"><input formControlName="franchise" /></ui-form-field>
        <ui-form-field label="Preco" [required]="true"><input type="number" step="0.01" formControlName="price" /></ui-form-field>
        <ui-form-field label="Preco de comparacao"><input type="number" step="0.01" formControlName="compareAtPrice" /></ui-form-field>
        <ui-form-field label="Descricao"><textarea rows="5" formControlName="description"></textarea></ui-form-field>
        <ui-form-field label="Status">
          <select formControlName="status">
            <option value="draft">Rascunho</option>
            <option value="active">Ativo</option>
            <option value="archived">Arquivado</option>
          </select>
        </ui-form-field>
      </ui-card>

      <ui-card title="Variantes e estoque">
        <app-product-variants-editor [variants]="variants()" (stockChange)="updateStock($event)" />
      </ui-card>

      <div class="form__actions">
        <ui-button type="submit" [loading]="saving()">Salvar</ui-button>
        <ui-button variant="ghost" (clicked)="cancel()">Cancelar</ui-button>
      </div>
    </form>
  `,
  styles: ['.form { display: grid; gap: 1rem; max-width: 760px; }', '.form__actions { display: flex; gap: 0.75rem; }'],
})
export class ProductFormPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly gateway = inject(AdminCatalogGateway);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  /** Presente apenas na rota de edicao. */
  readonly id = input<string | undefined>(undefined);

  protected readonly saving = signal(false);
  protected readonly variants = signal<{ id: string; name: string; sku: string; stock: number }[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    franchise: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    compareAtPrice: [0],
    description: [''],
    status: ['draft'],
  });

  constructor() {
    queueMicrotask(() => {
      const id = this.id();
      if (!id) {
        return;
      }
      this.gateway.getProduct(id).subscribe((product) => {
        this.form.patchValue({
          title: product.title,
          franchise: product.franchise,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? 0,
          description: product.description,
          status: product.status,
        });
        this.variants.set(
          product.variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            sku: variant.sku,
            stock: variant.stock,
          })),
        );
      });
    });
  }

  updateStock(change: { id: string; stock: number }): void {
    this.gateway.updateStock(change.id, change.stock).subscribe((response) => {
      this.notifications.success(response.message);
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();
    const payload = { ...value, status: value.status as 'draft' | 'active' | 'archived' };
    const id = this.id();
    const request = id ? this.gateway.updateProduct(id, payload) : this.gateway.createProduct(payload);

    request.subscribe({
      next: (response) => {
        this.saving.set(false);
        this.notifications.success(response.message);
        this.router.navigate(['/admin/produtos']);
      },
      error: () => this.saving.set(false),
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/produtos']);
  }
}
