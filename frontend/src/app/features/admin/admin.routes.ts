import { Routes } from '@angular/router';

import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';

/** Back-office. Todo o bundle e carregado sob demanda em /admin. */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Admin · Dashboard',
        loadComponent: () =>
          import('./dashboard/pages/dashboard-page/dashboard-page.component').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'produtos',
        title: 'Admin · Produtos',
        loadComponent: () =>
          import('./products/pages/product-list-page/product-list-page.component').then((m) => m.ProductListPageComponent),
      },
      {
        path: 'produtos/novo',
        title: 'Admin · Novo produto',
        loadComponent: () =>
          import('./products/pages/product-form-page/product-form-page.component').then((m) => m.ProductFormPageComponent),
      },
      {
        path: 'produtos/:id',
        title: 'Admin · Editar produto',
        loadComponent: () =>
          import('./products/pages/product-form-page/product-form-page.component').then((m) => m.ProductFormPageComponent),
      },
      {
        path: 'colecoes',
        title: 'Admin · Colecoes',
        loadComponent: () =>
          import('./collections/pages/collection-list-page/collection-list-page.component').then(
            (m) => m.AdminCollectionListPageComponent,
          ),
      },
      {
        path: 'estoque',
        title: 'Admin · Estoque',
        loadComponent: () =>
          import('./inventory/pages/inventory-page/inventory-page.component').then((m) => m.InventoryPageComponent),
      },
      {
        path: 'pedidos',
        title: 'Admin · Pedidos',
        loadComponent: () =>
          import('./orders/pages/order-list-page/order-list-page.component').then((m) => m.AdminOrderListPageComponent),
      },
      {
        path: 'pedidos/:id',
        title: 'Admin · Pedido',
        loadComponent: () =>
          import('./orders/pages/order-detail-page/order-detail-page.component').then((m) => m.AdminOrderDetailPageComponent),
      },
      {
        path: 'clientes',
        title: 'Admin · Clientes',
        loadComponent: () =>
          import('./customers/pages/customer-list-page/customer-list-page.component').then((m) => m.CustomerListPageComponent),
      },
      {
        path: 'cupons',
        title: 'Admin · Cupons',
        loadComponent: () =>
          import('./coupons/pages/coupon-list-page/coupon-list-page.component').then((m) => m.CouponListPageComponent),
      },
      {
        path: 'relatorios',
        title: 'Admin · Relatorios',
        loadComponent: () =>
          import('./reports/pages/reports-page/reports-page.component').then((m) => m.ReportsPageComponent),
      },
      {
        path: 'configuracoes',
        title: 'Admin · Configuracoes',
        loadComponent: () =>
          import('./settings/pages/settings-page/settings-page.component').then((m) => m.SettingsPageComponent),
      },
    ],
  },
];
