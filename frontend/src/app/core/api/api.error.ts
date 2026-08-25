/** Erro normalizado da aplicacao: sempre carrega a `message` do envelope. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number = 0,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
