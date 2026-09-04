/**
 * Envelope padronizado de resposta da API Backend.
 * Conforme contrato estabelecido em contrato.md e swagger.json.
 */
export interface ApiResponse<T> {
  message: string;
  dados: T;
}
