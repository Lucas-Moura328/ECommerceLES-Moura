import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { StorageService } from '../services/storage.service';

const STORAGE_KEY = 'les.wishlist.v1';

/** Lista de desejos anonima (localStorage) ate existir conta de usuario. */
@Injectable({ providedIn: 'root' })
export class WishlistStore {
  private readonly storage = inject(StorageService);
  private readonly state = signal<string[]>(this.storage.read<string[]>(STORAGE_KEY, []));

  readonly productIds = this.state.asReadonly();
  readonly count = computed(() => this.state().length);

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this.state()));
  }

  has(productId: string): boolean {
    return this.state().includes(productId);
  }

  toggle(productId: string): void {
    this.state.update((ids) =>
      ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
    );
  }
}
