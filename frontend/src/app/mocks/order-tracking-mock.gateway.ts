import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { ApiError } from '../core/api/api.error';
import { Order } from '../core/models';
import { mockData } from '../core/utils/delay.util';
import { OrderTrackingGateway } from '../features/client/orders/data-access/order-tracking.gateway';
import { MockDb } from './mock-db';

@Injectable()
export class OrderTrackingMockGateway extends OrderTrackingGateway {
  private readonly db = inject(MockDb);

  findByCode(code: string, email: string): Observable<Order> {
    const order = this.db
      .orders()
      .find(
        (item) =>
          item.code.toLowerCase() === code.trim().toLowerCase() &&
          item.customer.email.toLowerCase() === email.trim().toLowerCase(),
      );
    return order
      ? mockData(order)
      : throwError(() => new ApiError('Pedido nao encontrado para os dados informados.', 404));
  }
}
