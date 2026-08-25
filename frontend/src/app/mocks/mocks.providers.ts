import { Provider } from '@angular/core';

import {
  AdminCatalogGateway,
  AdminSalesGateway,
} from '../features/admin/shared/data-access/admin.gateway';
import {
  AdminCatalogHttpGateway,
  AdminSalesHttpGateway,
} from '../features/admin/shared/data-access/admin-http.gateway';
import { CatalogGateway } from '../features/client/catalog/data-access/catalog.gateway';
import { CatalogHttpGateway } from '../features/client/catalog/data-access/catalog-http.gateway';
import { CheckoutGateway } from '../features/client/checkout/data-access/checkout.gateway';
import { CheckoutHttpGateway } from '../features/client/checkout/data-access/checkout-http.gateway';
import { OrderTrackingGateway } from '../features/client/orders/data-access/order-tracking.gateway';
import { OrderTrackingHttpGateway } from '../features/client/orders/data-access/order-tracking-http.gateway';
import { AdminCatalogMockGateway, AdminSalesMockGateway } from './admin-mock.gateway';
import { CatalogMockGateway } from './catalog-mock.gateway';
import { CheckoutMockGateway } from './checkout-mock.gateway';
import { OrderTrackingMockGateway } from './order-tracking-mock.gateway';

/**
 * Unico ponto que decide entre mock e HTTP real.
 * Ao ligar o backend: environment.useMocks = false (nada mais muda).
 */
export function provideGateways(useMocks: boolean): Provider[] {
  return useMocks
    ? [
        { provide: CatalogGateway, useClass: CatalogMockGateway },
        { provide: CheckoutGateway, useClass: CheckoutMockGateway },
        { provide: OrderTrackingGateway, useClass: OrderTrackingMockGateway },
        { provide: AdminCatalogGateway, useClass: AdminCatalogMockGateway },
        { provide: AdminSalesGateway, useClass: AdminSalesMockGateway },
      ]
    : [
        { provide: CatalogGateway, useClass: CatalogHttpGateway },
        { provide: CheckoutGateway, useClass: CheckoutHttpGateway },
        { provide: OrderTrackingGateway, useClass: OrderTrackingHttpGateway },
        { provide: AdminCatalogGateway, useClass: AdminCatalogHttpGateway },
        { provide: AdminSalesGateway, useClass: AdminSalesHttpGateway },
      ];
}
