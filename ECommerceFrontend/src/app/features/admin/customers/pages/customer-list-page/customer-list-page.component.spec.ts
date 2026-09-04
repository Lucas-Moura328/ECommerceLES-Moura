import '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiResponse } from '../../../../../core/models/api-response.model';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ClienteResponseDto, Genero } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { CustomerListPageComponent } from './customer-list-page.component';

describe('CustomerListPageComponent', () => {
  let component: CustomerListPageComponent;
  let fixture: ComponentFixture<CustomerListPageComponent>;
  let mockCustomerService: any;
  let mockNotificationService: any;

  const mockCustomers: ClienteResponseDto[] = [
    {
      idCliente: 'uuid-1',
      nome: 'Ana Silva',
      cpf: '11122233344',
      dataNascimento: '1990-01-01T00:00:00Z',
      ativo: true,
      email: 'ana@example.com',
      genero: Genero.Feminino,
      ddd: '11',
      telefone: '988887777',
      isAdmin: false,
      enderecos: [],
    },
    {
      idCliente: 'uuid-2',
      nome: 'Carlos Souza',
      cpf: '55566677788',
      dataNascimento: '1985-06-15T00:00:00Z',
      ativo: false,
      email: 'carlos@example.com',
      genero: Genero.Masculino,
      ddd: '21',
      telefone: '977776666',
      isAdmin: false,
      enderecos: [],
    },
  ];

  beforeEach(async () => {
    mockCustomerService = {
      getCustomers: vi.fn().mockReturnValue(
        of<ApiResponse<ClienteResponseDto[]>>({
          message: 'Sucesso',
          dados: mockCustomers,
        }),
      ),
      searchCustomers: vi.fn().mockReturnValue(
        of<ApiResponse<ClienteResponseDto[]>>({
          message: 'Busca Sucesso',
          dados: [mockCustomers[0]],
        }),
      ),
      getCustomerById: vi.fn().mockReturnValue(
        of<ApiResponse<ClienteResponseDto>>({
          message: 'Detalhes',
          dados: mockCustomers[0],
        }),
      ),
      activateCustomer: vi.fn().mockReturnValue(
        of<ApiResponse<boolean>>({
          message: 'Ativado',
          dados: true,
        }),
      ),
      deactivateCustomer: vi.fn().mockReturnValue(
        of<ApiResponse<boolean>>({
          message: 'Desativado',
          dados: true,
        }),
      ),
    };

    mockNotificationService = {
      toasts: vi.fn().mockReturnValue([]),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CustomerListPageComponent],
      providers: [
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve inicializar o componente e carregar a lista de clientes', () => {
    expect(component).toBeTruthy();
    expect(mockCustomerService.getCustomers).toHaveBeenCalled();
    expect(component.customers().length).toBe(2);
    expect(component.totalCount()).toBe(2);
    expect(component.activeCount()).toBe(1);
    expect(component.inactiveCount()).toBe(1);
  });

  it('deve filtrar clientes por status ativo', () => {
    component.setStatusFilter('active');
    expect(component.filteredCustomers().length).toBe(1);
    expect(component.filteredCustomers()[0].nome).toBe('Ana Silva');
  });

  it('deve filtrar clientes por status inativo', () => {
    component.setStatusFilter('inactive');
    expect(component.filteredCustomers().length).toBe(1);
    expect(component.filteredCustomers()[0].nome).toBe('Carlos Souza');
  });

  it('deve executar busca por termo', () => {
    component.executeSearch('Ana');
    expect(mockCustomerService.searchCustomers).toHaveBeenCalledWith('Ana');
    expect(component.customers().length).toBe(1);
    expect(component.customers()[0].nome).toBe('Ana Silva');
  });

  it('deve limpar filtros e recarregar a listagem completa', () => {
    component.searchTerm.set('Ana');
    component.statusFilter.set('active');
    component.clearFilters();

    expect(component.searchTerm()).toBe('');
    expect(component.statusFilter()).toBe('all');
    expect(mockCustomerService.getCustomers).toHaveBeenCalledTimes(2);
  });

  it('deve desativar cliente ativo e emitir toast de sucesso', () => {
    const activeCustomer = mockCustomers[0];
    component.onConfirmStatusChange(activeCustomer);

    expect(mockCustomerService.deactivateCustomer).toHaveBeenCalledWith('uuid-1');
    expect(mockNotificationService.success).toHaveBeenCalledWith(
      'Cliente Desativado',
      expect.stringContaining('Ana Silva'),
    );
    const updated = component.customers().find((c) => c.idCliente === 'uuid-1');
    expect(updated?.ativo).toBe(false);
  });

  it('deve ativar cliente inativo e emitir toast de sucesso', () => {
    const inactiveCustomer = mockCustomers[1];
    component.onConfirmStatusChange(inactiveCustomer);

    expect(mockCustomerService.activateCustomer).toHaveBeenCalledWith('uuid-2');
    expect(mockNotificationService.success).toHaveBeenCalledWith(
      'Cliente Ativado',
      expect.stringContaining('Carlos Souza'),
    );
    const updated = component.customers().find((c) => c.idCliente === 'uuid-2');
    expect(updated?.ativo).toBe(true);
  });

  it('deve formatar CPF e telefone corretamente', () => {
    expect(component.formatCpf('11122233344')).toBe('111.222.333-44');
    expect(component.formatPhone('11', '988887777')).toBe('(11) 98888-7777');
  });
});
