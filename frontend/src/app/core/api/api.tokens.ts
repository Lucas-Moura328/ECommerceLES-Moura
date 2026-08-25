import { InjectionToken } from '@angular/core';

/** Base URL da API. Trocavel em testes e por ambiente. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
