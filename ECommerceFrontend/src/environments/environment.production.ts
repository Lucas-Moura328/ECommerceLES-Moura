/**
 * Configurações de ambiente de produção.
 * 
 * API_BASE_URL: URL base da API ASP.NET Core em produção
 * API_TIMEOUT: Timeout padrão para requisições HTTP (ms)
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.mouracamiseta.com.br/api',
  apiTimeout: 30000
};
