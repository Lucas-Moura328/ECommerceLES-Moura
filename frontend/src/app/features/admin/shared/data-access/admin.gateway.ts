import { Observable } from 'rxjs';

import { ApiResponse, PagedResult } from '../../../../core/api/api-response.model';
import { Collection, Coupon, Customer, Order, OrderStatus, Product } from '../../../../core/models';

export interface AdminListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface DashboardMetrics {
  revenueToday: number;
  revenueMonth: number;
  ordersToday: number;
  openOrders: number;
  lowStock: number;
  conversionRate: number;
  salesByDay: { date: string; total: number }[];
  topProducts: { title: string; units: number; revenue: number }[];
}

/** Escrita/leitura do painel administrativo (produtos, estoque, catalogo). */
export abstract class AdminCatalogGateway {
  abstract listProducts(query: AdminListQuery): Observable<PagedResult<Product>>;
  abstract getProduct(id: string): Observable<Product>;
  abstract createProduct(product: Partial<Product>): Observable<ApiResponse<Product>>;
  abstract updateProduct(id: string, product: Partial<Product>): Observable<ApiResponse<Product>>;
  abstract archiveProduct(id: string): Observable<ApiResponse<void>>;
  abstract listCollections(): Observable<Collection[]>;
  abstract updateStock(variantId: string, quantity: number): Observable<ApiResponse<void>>;
}

export abstract class AdminSalesGateway {
  abstract listOrders(query: AdminListQuery): Observable<PagedResult<Order>>;
  abstract getOrder(id: string): Observable<Order>;
  abstract changeOrderStatus(id: string, status: OrderStatus): Observable<ApiResponse<Order>>;
  abstract listCustomers(query: AdminListQuery): Observable<PagedResult<Customer>>;
  abstract listCoupons(): Observable<Coupon[]>;
  abstract saveCoupon(coupon: Partial<Coupon>): Observable<ApiResponse<Coupon>>;
  abstract getDashboard(): Observable<DashboardMetrics>;
}
