import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { CartItem, CartTotals } from '../models/cart.model';
import { StorageService } from '../services/storage.service';

const STORAGE_KEY = 'les.cart.v1';
const FREE_SHIPPING_FROM = 299;
const FLAT_SHIPPING = 29.9;

/**
 * Carrinho: unico estado realmente global do Cliente.
 * Vive em signals + localStorage; quando existir backend de carrinho, este
 * store passa a sincronizar com a API sem mudar a API publica consumida
 * pelos componentes.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storage = inject(StorageService);
  private readonly state = signal<CartItem[]>(this.storage.read<CartItem[]>(STORAGE_KEY, []));

  readonly items = this.state.asReadonly();
  readonly itemCount = computed(() => this.state().reduce((sum, item) => sum + item.quantity, 0));
  readonly totals = computed<CartTotals>(() => {
    const subtotal = this.state().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : FLAT_SHIPPING;
    return { subtotal, discount: 0, shipping, total: subtotal + shipping };
  });

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this.state()));
  }

  add(item: CartItem): void {
    this.state.update((items) => {
      const existing = items.find((current) => current.variantId === item.variantId);
      return existing
        ? items.map((current) =>
            current.variantId === item.variantId
              ? { ...current, quantity: current.quantity + item.quantity }
              : current,
          )
        : [...items, item];
    });
  }

  setQuantity(variantId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(variantId);
      return;
    }
    this.state.update((items) =>
      items.map((item) => (item.variantId === variantId ? { ...item, quantity } : item)),
    );
  }

  remove(variantId: string): void {
    this.state.update((items) => items.filter((item) => item.variantId !== variantId));
  }

  clear(): void {
    this.state.set([]);
  }
}
