/**
 * Envelope unico devolvido por TODOS os endpoints do backend ASP.NET Core:
 *
 *   Response<T> { message: string; dados: T? }
 *
 * O nome em TypeScript e ApiResponse para nao colidir com o Response do DOM.
 */
export interface ApiResponse<T> {
  message: string;
  dados: T | null;
}

/** Resultado paginado padrao (vai dentro de `dados`). */
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export function emptyPage<T>(pageSize = 12): PagedResult<T> {
  return { items: [], page: 1, pageSize, total: 0 };
}
