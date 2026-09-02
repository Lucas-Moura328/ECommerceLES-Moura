import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Configuração da aplicação Angular.
 * 
 * Providers configurados:
 * - provideRouter: Sistema de roteamento
 * - provideHttpClient: Cliente HTTP com suporte a interceptores
 * - provideBrowserGlobalErrorListeners: Captura global de erros no navegador
 * 
 * Nota: Animações foram removidas temporariamente devido a conflito de versões.
 * Serão adicionadas novamente quando as dependências forem alinhadas.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi())
  ]
};
