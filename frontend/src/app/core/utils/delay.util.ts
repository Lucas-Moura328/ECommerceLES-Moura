import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../api/api-response.model';

/** Simula a latencia e o envelope do backend nos gateways mock. */
export function mockResponse<T>(dados: T, message = 'OK'): Observable<ApiResponse<T>> {
  return of<ApiResponse<T>>({ message, dados }).pipe(delay(environment.mockLatencyMs));
}

/** Mesma coisa, porem ja desembrulhado (para consultas). */
export function mockData<T>(dados: T): Observable<T> {
  return of(dados).pipe(delay(environment.mockLatencyMs));
}
