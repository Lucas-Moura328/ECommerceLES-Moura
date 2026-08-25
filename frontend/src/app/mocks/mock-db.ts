import { Injectable, signal } from '@angular/core';

import { Collection, Coupon, Customer, Order, Product } from '../core/models';
import { COLLECTIONS } from './data/collections.mock';
import { COUPONS, CUSTOMERS, ORDERS } from './data/orders.mock';
import { PRODUCTS } from './data/products.mock';

/**
 * Banco em memoria compartilhado pelos gateways mock: o que o Admin altera,
 * o Cliente enxerga na mesma sessao. Substituivel pelo backend real sem que
 * nenhuma feature perceba.
 */
@Injectable({ providedIn: 'root' })
export class MockDb {
  readonly products = signal<Product[]>(structuredClone(PRODUCTS));
  readonly collections = signal<Collection[]>(structuredClone(COLLECTIONS));
  readonly orders = signal<Order[]>(structuredClone(ORDERS));
  readonly customers = signal<Customer[]>(structuredClone(CUSTOMERS));
  readonly coupons = signal<Coupon[]>(structuredClone(COUPONS));
}
