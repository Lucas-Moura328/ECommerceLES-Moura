import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';

import { SessionStore } from '../auth/session.store';

/**
 * Porta de entrada do Admin. Hoje sempre libera (mockup, sem login);
 * a troca para uma checagem real de claim acontece so aqui.
 */
export const adminGuard: CanMatchFn = () => inject(SessionStore).can('admin');
