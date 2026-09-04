import { Routes } from '@angular/router';

/**
 * Rotas da área pública e do cliente.
 */
export const clientRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
    title: 'Home | MouraCamiseta',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./home/pages/home-page/home-page.component').then((m) => m.HomePageComponent), // Placeholder
    title: 'Meu Perfil | MouraCamiseta',
  },
  {
    path: 'profile/addresses',
    loadComponent: () =>
      import('./home/pages/home-page/home-page.component').then((m) => m.HomePageComponent), // Placeholder
    title: 'Meus Endereços | MouraCamiseta',
  },
  {
    path: 'profile/password',
    loadComponent: () =>
      import('./home/pages/home-page/home-page.component').then((m) => m.HomePageComponent), // Placeholder
    title: 'Alterar Senha | MouraCamiseta',
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./errors/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent,
      ),
    title: 'Página não encontrada',
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
