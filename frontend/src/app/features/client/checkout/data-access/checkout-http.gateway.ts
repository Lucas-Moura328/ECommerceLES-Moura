import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../../core/api/api-response.model';
import { ApiService } from '../../../../core/api/api.service';
import { Order } from '../../../../core/models';
import { CheckoutGateway, PlaceOrderPayload, ShippingQuote } from './checkout.gateway';

@Injectable()
export class CheckoutHttpGateway extends CheckoutGateway {
  private readonly api = inject(ApiService);

  quoteShipping(zipCode: string): Observable<ShippingQuote[]> {
    return this.api.get<ShippingQuote[]>('checkout/frete', { cep: zipCode });
  }

  validateCoupon(code: string, subtotal: number): Observable<ApiResponse<number>> {
    return this.api.post<number>('checkout/cupom', { code, subtotal });
  }

  placeOrder(payload: PlaceOrderPayload): Observable<ApiResponse<Order>> {
    return this.api.post<Order>('checkout/pedidos', payload);
  }
}
