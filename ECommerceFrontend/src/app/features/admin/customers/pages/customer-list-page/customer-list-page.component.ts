import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../../core/services/notification.service';
import { CustomerDetailModalComponent } from '../../components/customer-detail-modal/customer-detail-modal.component';
import { CustomerStatusModalComponent } from '../../components/customer-status-modal/customer-status-modal.component';
import { CustomerStatusFilter } from '../../models/customer-filter.model';
import { ClienteResponseDto } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerDetailModalComponent, CustomerStatusModalComponent],
  templateUrl: './customer-list-page.component.html',
  styleUrl: './customer-list-page.component.scss',
})
export class CustomerListPageComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly notificationService = inject(NotificationService);

  readonly detailModal = viewChild.required(CustomerDetailModalComponent);
  readonly statusModal = viewChild.required(CustomerStatusModalComponent);

  // Estados com Signals
  readonly customers = signal<ClienteResponseDto[]>([]);
  readonly loading = signal<boolean>(false);
  readonly actionLoading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly statusFilter = signal<CustomerStatusFilter>('all');
  readonly selectedCustomer = signal<ClienteResponseDto | null>(null);
  readonly customerForStatusChange = signal<ClienteResponseDto | null>(null);

  private searchDebounceTimer?: ReturnType<typeof setTimeout>;

  // Clientes filtrados reativamente por status
  readonly filteredCustomers = computed(() => {
    const list = this.customers();
    const filter = this.statusFilter();

    if (filter === 'active') {
      return list.filter((c) => c.ativo);
    }
    if (filter === 'inactive') {
      return list.filter((c) => !c.ativo);
    }
    return list;
  });

  // Métricas computadas
  readonly totalCount = computed(() => this.customers().length);
  readonly activeCount = computed(() => this.customers().filter((c) => c.ativo).length);
  readonly inactiveCount = computed(() => this.customers().filter((c) => !c.ativo).length);

  ngOnInit(): void {
    this.loadCustomers();
  }

  /**
   * Carrega todos os clientes via GET /api/Cliente
   */
  loadCustomers(): void {
    this.loading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customers.set(response.dados ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  /**
   * Busca clientes com debounce de 300ms
   */
  onSearchInput(term: string): void {
    this.searchTerm.set(term);

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.executeSearch(term);
    }, 350);
  }

  /**
   * Executa busca na API ou recarrega se vazio
   */
  executeSearch(term: string): void {
    const trimmed = term.trim();
    if (!trimmed) {
      this.loadCustomers();
      return;
    }

    this.loading.set(true);
    this.customerService.searchCustomers(trimmed).subscribe({
      next: (response) => {
        this.customers.set(response.dados ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  /**
   * Altera filtro de status (all, active, inactive)
   */
  setStatusFilter(status: CustomerStatusFilter): void {
    this.statusFilter.set(status);
  }

  /**
   * Limpa pesquisa e filtros
   */
  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
    this.loadCustomers();
  }

  /**
   * Abre modal de visualização de detalhes do cliente
   */
  viewDetails(customer: ClienteResponseDto): void {
    this.selectedCustomer.set(customer);
    this.detailModal().open();

    // Consulta detalhes completos (incluindo endereços atualizados)
    this.customerService.getCustomerById(customer.idCliente).subscribe({
      next: (response) => {
        if (response.dados) {
          this.selectedCustomer.set(response.dados);
        }
      },
      error: () => {
        // O erro é tratado e notificado pelo errorInterceptor
      },
    });
  }

  /**
   * Abre modal de confirmação de ativação/desativação
   */
  openStatusModal(customer: ClienteResponseDto): void {
    this.customerForStatusChange.set(customer);
    this.statusModal().open();
  }

  /**
   * Confirma e envia requisição de alteração de status
   */
  onConfirmStatusChange(customer: ClienteResponseDto): void {
    this.actionLoading.set(true);

    if (customer.ativo) {
      this.customerService.deactivateCustomer(customer.idCliente).subscribe({
        next: () => {
          this.actionLoading.set(false);
          this.statusModal().close();
          this.updateCustomerLocalStatus(customer.idCliente, false);
          this.notificationService.success(
            'Cliente Desativado',
            `O cliente ${customer.nome} foi desativado com sucesso.`,
          );
        },
        error: () => {
          this.actionLoading.set(false);
        },
      });
    } else {
      this.customerService.activateCustomer(customer.idCliente).subscribe({
        next: () => {
          this.actionLoading.set(false);
          this.statusModal().close();
          this.updateCustomerLocalStatus(customer.idCliente, true);
          this.notificationService.success(
            'Cliente Ativado',
            `O cliente ${customer.nome} foi ativado com sucesso.`,
          );
        },
        error: () => {
          this.actionLoading.set(false);
        },
      });
    }
  }

  /**
   * Atualiza status no sinal local sem necessitar de novo GET completo
   */
  private updateCustomerLocalStatus(id: string, novoStatus: boolean): void {
    this.customers.update((list) =>
      list.map((c) => (c.idCliente === id ? { ...c, ativo: novoStatus } : c)),
    );
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
}
