import { Routes } from '@angular/router';

/**
 * Rotas raiz da aplicação.
 * 
 * Estrutura:
 * - /: Redireciona para /home (área cliente)
 * - /home*: Rotas da área cliente com ClientLayout
 * - /admin*: Rotas da área administrativa com AdminLayout
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./layouts/client-layout/client-layout.component')
      .then(m => m.ClientLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/client/home/pages/home-page/home-page.component')
          .then(m => m.HomePageComponent),
        title: 'Home'
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/client/home/pages/home-page/home-page.component')
          .then(m => m.HomePageComponent), // Placeholder
        title: 'Meu Perfil'
      },
      {
        path: 'profile/addresses',
        loadComponent: () => import('./features/client/home/pages/home-page/home-page.component')
          .then(m => m.HomePageComponent), // Placeholder
        title: 'Meus Endereços'
      },
      {
        path: 'profile/password',
        loadComponent: () => import('./features/client/home/pages/home-page/home-page.component')
          .then(m => m.HomePageComponent), // Placeholder
        title: 'Alterar Senha'
      },
      {
        path: 'not-found',
        loadComponent: () => import('./features/client/errors/not-found-page/not-found-page.component')
          .then(m => m.NotFoundPageComponent),
        title: 'Página não encontrada'
      },
      {
        path: '**',
        redirectTo: 'not-found'
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/pages/dashboard-page/dashboard-page.component')
          .then(m => m.DashboardPageComponent),
        title: 'Dashboard'
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/admin/customers/pages/customer-list-page/customer-list-page.component')
          .then(m => m.CustomerListPageComponent),
        title: 'Clientes'
      },
      {
        path: 'not-found',
        loadComponent: () => import('./features/client/errors/not-found-page/not-found-page.component')
          .then(m => m.NotFoundPageComponent),
        title: 'Página não encontrada'
      },
      {
        path: '**',
        redirectTo: 'not-found'
      }
    ]
  }
];
