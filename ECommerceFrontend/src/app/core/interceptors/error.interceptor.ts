import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor global de erros HTTP.
 *
 * Captura falhas de rede, respostas >= 400 da API e problemas de comunicação,
 * exibindo automaticamente uma notificação flutuante (toast) amigável via NotificationService.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      let errorMessage = 'Ocorreu um erro inesperado ao processar a requisição.';
      let errorTitle = 'Erro de Comunicação';

      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          errorTitle = 'Servidor Indisponível';
          errorMessage = 'Não foi possível conectar ao servidor. Verifique se a API está ativa.';
        } else if (error.error && typeof error.error === 'object') {
          const errBody = error.error as Record<string, unknown>;
          if (typeof errBody['message'] === 'string' && errBody['message'].trim().length > 0) {
            errorMessage = errBody['message'];
          } else if (typeof errBody['detail'] === 'string' && errBody['detail'].trim().length > 0) {
            errorMessage = errBody['detail'];
            if (typeof errBody['title'] === 'string') {
              errorTitle = errBody['title'];
            }
          } else if (typeof errBody['title'] === 'string' && errBody['title'].trim().length > 0) {
            errorMessage = errBody['title'];
          }
        } else if (typeof error.error === 'string' && error.error.trim().length > 0) {
          errorMessage = error.error;
        } else {
          switch (error.status) {
            case 400:
              errorTitle = 'Dados Inválidos';
              errorMessage = 'A requisição contém dados inválidos ou incompletos.';
              break;
            case 404:
              errorTitle = 'Não Encontrado';
              errorMessage = 'O recurso solicitado não foi encontrado no servidor.';
              break;
            case 500:
              errorTitle = 'Erro no Servidor';
              errorMessage = 'Ocorreu um erro interno no servidor.';
              break;
          }
        }
      }

      notificationService.error(errorTitle, errorMessage);
      return throwError(() => error);
    }),
  );
};
