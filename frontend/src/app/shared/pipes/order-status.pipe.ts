import { Pipe, PipeTransform } from '@angular/core';

import { OrderStatus } from '../../core/models/order.model';

const LABELS: Record<OrderStatus, string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  packing: 'Em separacao',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

@Pipe({ name: 'orderStatus' })
export class OrderStatusPipe implements PipeTransform {
  transform(value: OrderStatus): string {
    return LABELS[value] ?? value;
  }
}
