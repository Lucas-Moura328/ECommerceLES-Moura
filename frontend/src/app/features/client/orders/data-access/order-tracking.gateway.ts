import { Observable } from 'rxjs';

import { Order } from '../../../../core/models';

/** Consulta de pedido por codigo + e-mail (nao exige conta). */
export abstract class OrderTrackingGateway {
  abstract findByCode(code: string, email: string): Observable<Order>;
}
