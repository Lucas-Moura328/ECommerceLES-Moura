import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenStorage } from '../auth/token.storage';

/**
 * Ponto de extensao para JWT. Hoje TokenStorage sempre devolve null, entao o
 * interceptor e um no-op; quando o login existir, basta popular o storage.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenStorage).token();
  if (!token) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
