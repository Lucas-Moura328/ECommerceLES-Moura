import { Component, input, viewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalComponent } from '../../../../../shared/ui/modal/modal.component';
import { ClienteResponseDto, Genero, GeneroLabels } from '../../models/customer.model';

@Component({
  selector: 'app-customer-detail-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, DatePipe],
  templateUrl: './customer-detail-modal.component.html',
  styleUrl: './customer-detail-modal.component.scss',
})
export class CustomerDetailModalComponent {
  readonly modal = viewChild.required(ModalComponent);
  readonly customer = input<ClienteResponseDto | null>(null);

  open(): void {
    this.modal().open();
  }

  close(): void {
    this.modal().closeModalAction();
  }

  getGeneroLabel(genero?: Genero): string {
    if (genero === undefined || genero === null) return 'Não informado';
    return GeneroLabels[genero] ?? 'Outro';
  }

  formatCpf(cpf?: string): string {
    if (!cpf) return '-';
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return cpf;
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatPhone(ddd?: string, phone?: string): string {
    if (!phone) return '-';
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanDdd = ddd ? ddd.replace(/\D/g, '') : '';
    if (cleanPhone.length === 9) {
      return cleanDdd
        ? `(${cleanDdd}) ${cleanPhone.substring(0, 5)}-${cleanPhone.substring(5)}`
        : `${cleanPhone.substring(0, 5)}-${cleanPhone.substring(5)}`;
    }
    if (cleanPhone.length === 8) {
      return cleanDdd
        ? `(${cleanDdd}) ${cleanPhone.substring(0, 4)}-${cleanPhone.substring(4)}`
        : `${cleanPhone.substring(0, 4)}-${cleanPhone.substring(4)}`;
    }
    return cleanDdd ? `(${cleanDdd}) ${phone}` : phone;
  }

  formatCep(cep?: string): string {
    if (!cep) return '-';
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) {
      return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  }
}
