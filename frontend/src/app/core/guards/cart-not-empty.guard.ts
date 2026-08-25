import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CartStore } from '../state/cart.store';

/** Impede entrar no checkout com carrinho vazio. */
export const cartNotEmptyGuard: CanActivateFn = () => {
  const cart = inject(CartStore);
  const router = inject(Router);
  return cart.itemCount() > 0 ? true : router.createUrlTree(['/carrinho']);
};
