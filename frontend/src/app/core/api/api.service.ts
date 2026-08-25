import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiError } from './api.error';
import { ApiResponse } from './api-response.model';
import { API_BASE_URL } from './api.tokens';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Unico ponto do app que fala HTTP com o backend.
 * Concentra o conhecimento do envelope Response<T> para que nenhuma feature
 * precise saber que existe um campo `dados`.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  /** GET que devolve apenas `dados` (falha se vier nulo). */
  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.url(path), { params: toHttpParams(params) })
      .pipe(map((response) => unwrap(response)));
  }

  /** GET que devolve o envelope completo (quando a `message` importa). */
  getResponse<T>(path: string, params?: QueryParams): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.url(path), { params: toHttpParams(params) });
  }

  post<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.url(path), body);
  }

  put<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.url(path), body);
  }

  patch<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.url(path), body);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.url(path));
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (response.dados === null || response.dados === undefined) {
    throw new ApiError(response.message || 'Resposta sem dados.');
  }
  return response.dados;
}

function toHttpParams(params?: QueryParams): HttpParams {
  let httpParams = new HttpParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      httpParams = httpParams.set(key, String(value));
    }
  }
  return httpParams;
}
