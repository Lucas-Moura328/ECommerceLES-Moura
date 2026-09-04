import { Routes } from '@angular/router';

/**
 * Rotas raiz da aplicação.
 *
 * Estrutura:
 * - /: Redireciona para /home (área cliente)
 * - /home: Área cliente com ClientLayout e rotas filhas em client.routes.ts
 * - /admin: Área administrativa com AdminLayout e rotas filhas em admin.routes.ts
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./layouts/client-layout/client-layout.component').then(
        (m) => m.ClientLayoutComponent,
      ),
    loadChildren: () => import('./features/client/client.routes').then((m) => m.clientRoutes),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
