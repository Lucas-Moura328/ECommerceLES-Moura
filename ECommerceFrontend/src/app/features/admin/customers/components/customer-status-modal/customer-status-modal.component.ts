import { Component, input, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../shared/ui/modal/modal.component';
import { ClienteResponseDto } from '../../models/customer.model';

@Component({
  selector: 'app-customer-status-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './customer-status-modal.component.html',
  styleUrl: './customer-status-modal.component.scss',
})
export class CustomerStatusModalComponent {
  readonly modal = viewChild.required(ModalComponent);
  readonly customer = input<ClienteResponseDto | null>(null);
  readonly loading = input<boolean>(false);

  readonly confirm = output<ClienteResponseDto>();

  open(): void {
    this.modal().open();
  }

  close(): void {
    this.modal().closeModalAction();
  }

  onConfirm(): void {
    const c = this.customer();
    if (c) {
      this.confirm.emit(c);
    }
  }
}
