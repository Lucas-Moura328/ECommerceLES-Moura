import { Routes } from '@angular/router';

import { cartNotEmptyGuard } from '../../core/guards/cart-not-empty.guard';
import { CheckoutLayoutComponent } from '../../layouts/checkout-layout/checkout-layout.component';
import { ClientLayoutComponent } from '../../layouts/client-layout/client-layout.component';

/** Rotas publicas da loja. Todas standalone e lazy por pagina. */
export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: '',
        title: 'LES Store',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'produtos',
        title: 'Produtos',
        loadComponent: () =>
          import('./catalog/pages/collection-page/collection-page.component').then((m) => m.CollectionPageComponent),
      },
      {
        path: 'colecoes',
        title: 'Colecoes',
        loadComponent: () =>
          import('./catalog/pages/collection-list-page/collection-list-page.component').then(
            (m) => m.CollectionListPageComponent,
          ),
      },
      {
        path: 'colecoes/:slug',
        loadComponent: () =>
          import('./catalog/pages/collection-page/collection-page.component').then((m) => m.CollectionPageComponent),
      },
      {
        path: 'busca',
        title: 'Busca',
        loadComponent: () =>
          import('./catalog/pages/search-page/search-page.component').then((m) => m.SearchPageComponent),
      },
      {
        path: 'produto/:slug',
        loadComponent: () =>
          import('./product/pages/product-detail-page/product-detail-page.component').then(
            (m) => m.ProductDetailPageComponent,
          ),
      },
      {
        path: 'carrinho',
        title: 'Carrinho',
        loadComponent: () => import('./cart/pages/cart-page/cart-page.component').then((m) => m.CartPageComponent),
      },
      {
        path: 'favoritos',
        title: 'Favoritos',
        loadComponent: () =>
          import('./wishlist/pages/wishlist-page/wishlist-page.component').then((m) => m.WishlistPageComponent),
      },
      {
        path: 'meus-pedidos',
        title: 'Meus pedidos',
        loadComponent: () =>
          import('./orders/pages/order-lookup-page/order-lookup-page.component').then((m) => m.OrderLookupPageComponent),
      },
      {
        path: 'pedido/:code',
        loadComponent: () =>
          import('./orders/pages/order-detail-page/order-detail-page.component').then((m) => m.OrderDetailPageComponent),
      },
      {
        path: 'contato',
        title: 'Contato',
        loadComponent: () =>
          import('./content/pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent),
      },
      {
        path: 'institucional/:slug',
        loadComponent: () =>
          import('./content/pages/static-page/static-page.component').then((m) => m.StaticPageComponent),
      },
    ],
  },
  {
    path: 'checkout',
    component: CheckoutLayoutComponent,
    canActivate: [cartNotEmptyGuard],
    loadChildren: () => import('./checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
  },
  {
    path: '**',
    loadComponent: () => import('./errors/not-found-page/not-found-page.component').then((m) => m.NotFoundPageComponent),
  },
];
