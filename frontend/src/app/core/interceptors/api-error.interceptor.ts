import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../api/api.error';
import { NotificationService } from '../notifications/notification.service';

/**
 * Traduz qualquer falha HTTP para ApiError usando a `message` do envelope
 * quando o backend a envia, e notifica o usuario uma unica vez.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const apiError = toApiError(error);
      notifications.error(apiError.message);
      return throwError(() => apiError);
    }),
  );
};

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof HttpErrorResponse) {
    const message =
      (error.error as { message?: string } | null)?.message ??
      (error.status === 0 ? 'Nao foi possivel falar com o servidor.' : 'Erro inesperado.');
    return new ApiError(message, error.status, error);
  }
  return new ApiError('Erro inesperado.', 0, error);
}
