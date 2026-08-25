import { Routes } from '@angular/router';

/**
 * Fluxo linear de checkout (guest). Cada passo e uma rota para permitir
 * voltar/avancar pelo navegador e medir abandono por etapa.
 */
export const CHECKOUT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'identificacao' },
  {
    path: 'identificacao',
    title: 'Identificacao',
    loadComponent: () =>
      import('./pages/identification-step/identification-step.component').then((m) => m.IdentificationStepComponent),
  },
  {
    path: 'entrega',
    title: 'Entrega',
    loadComponent: () =>
      import('./pages/shipping-step/shipping-step.component').then((m) => m.ShippingStepComponent),
  },
  {
    path: 'pagamento',
    title: 'Pagamento',
    loadComponent: () =>
      import('./pages/payment-step/payment-step.component').then((m) => m.PaymentStepComponent),
  },
  {
    path: 'revisao',
    title: 'Revisao do pedido',
    loadComponent: () => import('./pages/review-step/review-step.component').then((m) => m.ReviewStepComponent),
  },
  {
    path: 'confirmacao/:code',
    title: 'Pedido confirmado',
    loadComponent: () =>
      import('./pages/confirmation-page/confirmation-page.component').then((m) => m.ConfirmationPageComponent),
  },
];
