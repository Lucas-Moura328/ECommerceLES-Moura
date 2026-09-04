/**
 * Estrutura padrão de erro RFC 7807 (ProblemDetails) retornada pela API.
 */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}
