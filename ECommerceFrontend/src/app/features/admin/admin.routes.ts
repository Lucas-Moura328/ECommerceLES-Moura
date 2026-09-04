import { Routes } from '@angular/router';

/**
 * Rotas do módulo de administração (Backoffice).
 */
export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent,
      ),
    title: 'Dashboard | Admin',
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./customers/pages/customer-list-page/customer-list-page.component').then(
        (m) => m.CustomerListPageComponent,
      ),
    title: 'Gestão de Clientes | Admin',
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('../client/errors/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
    title: 'Página não encontrada | Admin',
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
