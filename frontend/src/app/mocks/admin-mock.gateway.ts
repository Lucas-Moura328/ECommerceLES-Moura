import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse, PagedResult } from '../core/api/api-response.model';
import { ApiError } from '../core/api/api.error';
import { Collection, Coupon, Customer, Order, OrderStatus, Product } from '../core/models';
import { mockData, mockResponse } from '../core/utils/delay.util';
import { slugify } from '../core/utils/slug.util';
import {
  AdminCatalogGateway,
  AdminListQuery,
  AdminSalesGateway,
  DashboardMetrics,
} from '../features/admin/shared/data-access/admin.gateway';
import { MockDb } from './mock-db';

function paginate<T>(items: T[], query: AdminListQuery): PagedResult<T> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length };
}

@Injectable()
export class AdminCatalogMockGateway extends AdminCatalogGateway {
  private readonly db = inject(MockDb);

  listProducts(query: AdminListQuery): Observable<PagedResult<Product>> {
    let items = this.db.products();
    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter((product) => product.title.toLowerCase().includes(term));
    }
    if (query.status) {
      items = items.filter((product) => product.status === query.status);
    }
    return mockData(paginate(items, query));
  }

  getProduct(id: string): Observable<Product> {
    const product = this.db.products().find((item) => item.id === id);
    if (!product) {
      throw new ApiError('Produto nao encontrado.', 404);
    }
    return mockData(product);
  }

  createProduct(product: Partial<Product>): Observable<ApiResponse<Product>> {
    const created: Product = {
      ...(this.db.products()[0] as Product),
      ...product,
      id: `p${Date.now()}`,
      slug: slugify(product.title ?? 'novo-produto'),
      status: product.status ?? 'draft',
      updatedAt: new Date().toISOString(),
    };
    this.db.products.update((items) => [created, ...items]);
    return mockResponse(created, 'Produto criado com sucesso.');
  }

  updateProduct(id: string, product: Partial<Product>): Observable<ApiResponse<Product>> {
    let updated: Product | undefined;
    this.db.products.update((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        updated = { ...item, ...product, updatedAt: new Date().toISOString() };
        return updated;
      }),
    );
    if (!updated) {
      throw new ApiError('Produto nao encontrado.', 404);
    }
    return mockResponse(updated, 'Produto atualizado com sucesso.');
  }

  archiveProduct(id: string): Observable<ApiResponse<void>> {
    this.db.products.update((items) =>
      items.map((item) => (item.id === id ? { ...item, status: 'archived' } : item)),
    );
    return mockResponse<void>(undefined as unknown as void, 'Produto arquivado.');
  }

  listCollections(): Observable<Collection[]> {
    return mockData(this.db.collections());
  }

  updateStock(variantId: string, quantity: number): Observable<ApiResponse<void>> {
    this.db.products.update((items) =>
      items.map((product) => ({
        ...product,
        variants: product.variants.map((variant) =>
          variant.id === variantId ? { ...variant, stock: quantity } : variant,
        ),
      })),
    );
    return mockResponse<void>(undefined as unknown as void, 'Estoque atualizado.');
  }
}

@Injectable()
export class AdminSalesMockGateway extends AdminSalesGateway {
  private readonly db = inject(MockDb);

  listOrders(query: AdminListQuery): Observable<PagedResult<Order>> {
    let items = this.db.orders();
    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        (order) =>
          order.code.toLowerCase().includes(term) ||
          order.customer.name.toLowerCase().includes(term),
      );
    }
    if (query.status) {
      items = items.filter((order) => order.status === query.status);
    }
    return mockData(paginate(items, query));
  }

  getOrder(id: string): Observable<Order> {
    const order = this.db.orders().find((item) => item.id === id);
    if (!order) {
      throw new ApiError('Pedido nao encontrado.', 404);
    }
    return mockData(order);
  }

  changeOrderStatus(id: string, status: OrderStatus): Observable<ApiResponse<Order>> {
    let updated: Order | undefined;
    this.db.orders.update((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        updated = { ...item, status };
        return updated;
      }),
    );
    if (!updated) {
      throw new ApiError('Pedido nao encontrado.', 404);
    }
    return mockResponse(updated, 'Status do pedido atualizado.');
  }

  listCustomers(query: AdminListQuery): Observable<PagedResult<Customer>> {
    let items = this.db.customers();
    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term),
      );
    }
    return mockData(paginate(items, query));
  }

  listCoupons(): Observable<Coupon[]> {
    return mockData(this.db.coupons());
  }

  saveCoupon(coupon: Partial<Coupon>): Observable<ApiResponse<Coupon>> {
    const saved: Coupon = {
      id: coupon.id ?? `cup${Date.now()}`,
      code: (coupon.code ?? '').toUpperCase(),
      type: coupon.type ?? 'percent',
      value: coupon.value ?? 0,
      minSubtotal: coupon.minSubtotal ?? 0,
      active: coupon.active ?? true,
      expiresAt: coupon.expiresAt ?? '2026-12-31',
    };
    this.db.coupons.update((items) => [saved, ...items.filter((item) => item.id !== saved.id)]);
    return mockResponse(saved, 'Cupom salvo.');
  }

  getDashboard(): Observable<DashboardMetrics> {
    const orders = this.db.orders();
    const revenueMonth = orders.reduce((sum, order) => sum + order.total, 0);
    return mockData<DashboardMetrics>({
      revenueToday: revenueMonth / 12,
      revenueMonth,
      ordersToday: 3,
      openOrders: orders.filter((order) => ['pending', 'paid', 'packing'].includes(order.status)).length,
      lowStock: this.db
        .products()
        .filter((product) => product.variants.some((variant) => variant.stock < 6)).length,
      conversionRate: 2.4,
      salesByDay: Array.from({ length: 7 }, (_, index) => ({
        date: new Date(2026, 7, 19 + index).toISOString().slice(0, 10),
        total: 1200 + index * 430,
      })),
      topProducts: this.db
        .products()
        .slice(0, 5)
        .map((product, index) => ({
          title: product.title,
          units: 30 - index * 4,
          revenue: product.price * (30 - index * 4),
        })),
    });
  }
}
