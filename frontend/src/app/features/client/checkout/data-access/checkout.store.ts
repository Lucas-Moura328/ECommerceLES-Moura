import { computed, inject, Injectable, signal } from '@angular/core';

import { Address, CartTotals } from '../../../../core/models';
import { CartStore } from '../../../../core/state/cart.store';
import { ShippingQuote } from './checkout.gateway';

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  document: string;
}

/**
 * Estado do fluxo de checkout enquanto o usuario navega entre os passos.
 * Fica em memoria de proposito: sem login e sem sessao persistente por ora.
 */
@Injectable({ providedIn: 'root' })
export class CheckoutStore {
  private readonly cart = inject(CartStore);

  readonly customer = signal<CheckoutCustomer | null>(null);
  readonly address = signal<Address | null>(null);
  readonly shipping = signal<ShippingQuote | null>(null);
  readonly paymentMethod = signal<'pix' | 'credit-card' | 'boleto'>('pix');
  readonly discount = signal(0);

  readonly totals = computed<CartTotals>(() => {
    const base = this.cart.totals();
    const shipping = this.shipping()?.price ?? base.shipping;
    const discount = this.discount();
    return {
      subtotal: base.subtotal,
      discount,
      shipping,
      total: Math.max(0, base.subtotal - discount + shipping),
    };
  });

  reset(): void {
    this.customer.set(null);
    this.address.set(null);
    this.shipping.set(null);
    this.discount.set(0);
  }
}
