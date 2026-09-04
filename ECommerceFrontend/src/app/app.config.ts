import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';

/**
 * Configuração da aplicação Angular.
 *
 * Providers configurados:
 * - provideRouter: Sistema de roteamento
 * - provideHttpClient: Cliente HTTP com interceptor global de erros e suporte a DI
 * - provideBrowserGlobalErrorListeners: Captura global de erros no navegador
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor]), withInterceptorsFromDi()),
  ],
};
