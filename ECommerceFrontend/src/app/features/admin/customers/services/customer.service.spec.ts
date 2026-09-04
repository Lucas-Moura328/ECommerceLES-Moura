import '@angular/compiler';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ClienteResponseDto, Genero } from '../models/customer.model';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/Cliente`;

  const mockCustomer: ClienteResponseDto = {
    idCliente: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    nome: 'Lucas Moura',
    cpf: '12345678901',
    dataNascimento: '1995-05-20T00:00:00Z',
    ativo: true,
    email: 'lucas@example.com',
    genero: Genero.Masculino,
    ddd: '11',
    telefone: '987654321',
    isAdmin: false,
    enderecos: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('deve listar todos os clientes (GET /api/Cliente)', () => {
    const mockResponse: ApiResponse<ClienteResponseDto[]> = {
      message: 'Clientes recuperados com sucesso',
      dados: [mockCustomer],
    };

    service.getCustomers().subscribe((res) => {
      expect(res.message).toBe('Clientes recuperados com sucesso');
      expect(res.dados.length).toBe(1);
      expect(res.dados[0].nome).toBe('Lucas Moura');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve buscar clientes por termo (GET /api/Cliente/search?termo=...) ', () => {
    const mockResponse: ApiResponse<ClienteResponseDto[]> = {
      message: 'Busca realizada com sucesso',
      dados: [mockCustomer],
    };

    service.searchCustomers('Lucas').subscribe((res) => {
      expect(res.dados.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/search?termo=Lucas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve obter cliente por ID (GET /api/Cliente/{id})', () => {
    const mockResponse: ApiResponse<ClienteResponseDto> = {
      message: 'Cliente encontrado',
      dados: mockCustomer,
    };

    service.getCustomerById('3fa85f64-5717-4562-b3fc-2c963f66afa6').subscribe((res) => {
      expect(res.dados.idCliente).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
    });

    const req = httpMock.expectOne(`${baseUrl}/3fa85f64-5717-4562-b3fc-2c963f66afa6`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve ativar cliente (PUT /api/Cliente/{id}/ativar)', () => {
    const mockResponse: ApiResponse<boolean> = {
      message: 'Cliente ativado com sucesso',
      dados: true,
    };

    service.activateCustomer('3fa85f64-5717-4562-b3fc-2c963f66afa6').subscribe((res) => {
      expect(res.dados).toBe(true);
    });

    const req = httpMock.expectOne(`${baseUrl}/3fa85f64-5717-4562-b3fc-2c963f66afa6/ativar`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('deve desativar cliente (PUT /api/Cliente/{id}/desativar)', () => {
    const mockResponse: ApiResponse<boolean> = {
      message: 'Cliente desativado com sucesso',
      dados: true,
    };

    service.deactivateCustomer('3fa85f64-5717-4562-b3fc-2c963f66afa6').subscribe((res) => {
      expect(res.dados).toBe(true);
    });

    const req = httpMock.expectOne(`${baseUrl}/3fa85f64-5717-4562-b3fc-2c963f66afa6/desativar`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});
