import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ClienteResponseDto } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/Cliente`;

  /**
   * Obtém a lista completa de clientes cadastrados.
   * Endpoint: GET /api/Cliente
   */
  getCustomers(): Observable<ApiResponse<ClienteResponseDto[]>> {
    return this.http.get<ApiResponse<ClienteResponseDto[]>>(this.baseUrl);
  }

  /**
   * Busca clientes por termo livre (nome, cpf, email, etc.).
   * Endpoint: GET /api/Cliente/search?termo={termo}
   */
  searchCustomers(termo: string): Observable<ApiResponse<ClienteResponseDto[]>> {
    const params = new HttpParams().set('termo', termo.trim());
    return this.http.get<ApiResponse<ClienteResponseDto[]>>(`${this.baseUrl}/search`, { params });
  }

  /**
   * Obtém os detalhes completos de um cliente por ID.
   * Endpoint: GET /api/Cliente/{id}
   */
  getCustomerById(id: string): Observable<ApiResponse<ClienteResponseDto>> {
    return this.http.get<ApiResponse<ClienteResponseDto>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Ativa o cadastro de um cliente.
   * Endpoint: PUT /api/Cliente/{id}/ativar
   */
  activateCustomer(id: string): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/${id}/ativar`, null);
  }

  /**
   * Desativa o cadastro de um cliente.
   * Endpoint: PUT /api/Cliente/{id}/desativar
   */
  deactivateCustomer(id: string): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/${id}/desativar`, null);
  }
}
