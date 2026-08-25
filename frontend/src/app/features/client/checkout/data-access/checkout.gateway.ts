import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../core/api/api-response.model';
import { Address, CartItem, Order } from '../../../../core/models';

export interface ShippingQuote {
  service: string;
  price: number;
  estimatedDays: number;
}

export interface PlaceOrderPayload {
  customer: { name: string; email: string; phone: string; document: string };
  shippingAddress: Address;
  items: CartItem[];
  paymentMethod: 'pix' | 'credit-card' | 'boleto';
  couponCode?: string;
}

/** Fechamento de pedido (guest checkout: sem login). */
export abstract class CheckoutGateway {
  abstract quoteShipping(zipCode: string): Observable<ShippingQuote[]>;
  abstract validateCoupon(code: string, subtotal: number): Observable<ApiResponse<number>>;
  abstract placeOrder(payload: PlaceOrderPayload): Observable<ApiResponse<Order>>;
}
