import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../core/api/api.service';
import { Order } from '../../../../core/models';
import { OrderTrackingGateway } from './order-tracking.gateway';

@Injectable()
export class OrderTrackingHttpGateway extends OrderTrackingGateway {
  private readonly api = inject(ApiService);

  findByCode(code: string, email: string): Observable<Order> {
    return this.api.get<Order>(`pedidos/${code}`, { email });
  }
}
