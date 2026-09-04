/**
 * Configurações de ambiente de desenvolvimento.
 *
 * Conforme contrato.md:
 * - Porta HTTPS: https://localhost:7094
 * - Porta HTTP: http://localhost:5134
 */
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7094/api',
  apiTimeout: 30000,
};
