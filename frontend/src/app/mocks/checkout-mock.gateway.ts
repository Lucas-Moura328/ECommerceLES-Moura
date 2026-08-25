import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../core/api/api-response.model';
import { Order } from '../core/models';
import { mockData, mockResponse } from '../core/utils/delay.util';
import {
  CheckoutGateway,
  PlaceOrderPayload,
  ShippingQuote,
} from '../features/client/checkout/data-access/checkout.gateway';
import { MockDb } from './mock-db';

@Injectable()
export class CheckoutMockGateway extends CheckoutGateway {
  private readonly db = inject(MockDb);

  quoteShipping(zipCode: string): Observable<ShippingQuote[]> {
    const base = Number(zipCode.replace(/\D/g, '').slice(0, 2)) || 10;
    return mockData<ShippingQuote[]>([
      { service: 'Economico', price: 19.9 + base / 10, estimatedDays: 9 },
      { service: 'Expresso', price: 39.9 + base / 5, estimatedDays: 3 },
    ]);
  }

  validateCoupon(code: string, subtotal: number): Observable<ApiResponse<number>> {
    const coupon = this.db.coupons().find((item) => item.code === code.toUpperCase() && item.active);
    if (!coupon) {
      return mockResponse<number>(0, 'Cupom invalido ou expirado.');
    }
    if (subtotal < coupon.minSubtotal) {
      return mockResponse<number>(0, `Cupom valido a partir de R$ ${coupon.minSubtotal}.`);
    }
    const discount = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
    return mockResponse(discount, 'Cupom aplicado.');
  }

  placeOrder(payload: PlaceOrderPayload): Observable<ApiResponse<Order>> {
    const subtotal = payload.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shipping = subtotal >= 299 ? 0 : 29.9;
    const order: Order = {
      id: `o${this.db.orders().length + 1}`,
      code: `LES-2026-${String(2000 + this.db.orders().length)}`,
      status: 'pending',
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
        phone: payload.customer.phone,
      },
      shippingAddress: payload.shippingAddress,
      items: payload.items,
      subtotal,
      discount: 0,
      shipping,
      total: subtotal + shipping,
      paymentMethod: payload.paymentMethod,
      createdAt: new Date().toISOString(),
    };
    this.db.orders.update((orders) => [order, ...orders]);
    return mockResponse(order, 'Pedido criado com sucesso.');
  }
}
