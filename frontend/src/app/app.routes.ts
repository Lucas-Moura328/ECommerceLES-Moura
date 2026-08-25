import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';

/**
 * Raiz do roteamento: separa as DUAS aplicacoes logicas.
 *  - /admin -> back-office (lazy, protegido por guard)
 *  - /      -> loja (lazy)
 * Nenhum bundle do Admin e baixado por quem so navega na loja.
 */
export const routes: Routes = [
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('./features/client/client.routes').then((m) => m.CLIENT_ROUTES),
  },
];
