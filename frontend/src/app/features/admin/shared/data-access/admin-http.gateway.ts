import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, PagedResult } from '../../../../core/api/api-response.model';
import { ApiService } from '../../../../core/api/api.service';
import { Collection, Coupon, Customer, Order, OrderStatus, Product } from '../../../../core/models';
import {
  AdminCatalogGateway,
  AdminListQuery,
  AdminSalesGateway,
  DashboardMetrics,
} from './admin.gateway';

@Injectable()
export class AdminCatalogHttpGateway extends AdminCatalogGateway {
  private readonly api = inject(ApiService);

  listProducts(query: AdminListQuery): Observable<PagedResult<Product>> {
    return this.api.get<PagedResult<Product>>('admin/produtos', { ...query });
  }

  getProduct(id: string): Observable<Product> {
    return this.api.get<Product>(`admin/produtos/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.api.post<Product>('admin/produtos', product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.api.put<Product>(`admin/produtos/${id}`, product);
  }

  archiveProduct(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`admin/produtos/${id}`);
  }

  listCollections(): Observable<Collection[]> {
    return this.api.get<Collection[]>('admin/colecoes');
  }

  updateStock(variantId: string, quantity: number): Observable<ApiResponse<void>> {
    return this.api.patch<void>(`admin/estoque/${variantId}`, { quantity });
  }
}

@Injectable()
export class AdminSalesHttpGateway extends AdminSalesGateway {
  private readonly api = inject(ApiService);

  listOrders(query: AdminListQuery): Observable<PagedResult<Order>> {
    return this.api.get<PagedResult<Order>>('admin/pedidos', { ...query });
  }

  getOrder(id: string): Observable<Order> {
    return this.api.get<Order>(`admin/pedidos/${id}`);
  }

  changeOrderStatus(id: string, status: OrderStatus): Observable<ApiResponse<Order>> {
    return this.api.patch<Order>(`admin/pedidos/${id}/status`, { status });
  }

  listCustomers(query: AdminListQuery): Observable<PagedResult<Customer>> {
    return this.api.get<PagedResult<Customer>>('admin/clientes', { ...query });
  }

  listCoupons(): Observable<Coupon[]> {
    return this.api.get<Coupon[]>('admin/cupons');
  }

  saveCoupon(coupon: Partial<Coupon>): Observable<ApiResponse<Coupon>> {
    return this.api.post<Coupon>('admin/cupons', coupon);
  }

  getDashboard(): Observable<DashboardMetrics> {
    return this.api.get<DashboardMetrics>('admin/dashboard');
  }
}
