export const environment = {
  production: false,
  /** Enquanto o backend nao esta plugado, os gateways mock sao providos. */
  useMocks: true,
  apiBaseUrl: 'https://localhost:7001/api',
  /** Latencia artificial (ms) aplicada pelos gateways mock. */
  mockLatencyMs: 250,
};
