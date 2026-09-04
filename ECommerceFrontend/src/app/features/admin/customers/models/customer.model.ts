/**
 * Enumeração de Gênero conforme especificação docs/api/swagger.json.
 */
export enum Genero {
  Masculino = 0,
  Feminino = 1,
  Outro = 2,
}

export const GeneroLabels: Record<Genero, string> = {
  [Genero.Masculino]: 'Masculino',
  [Genero.Feminino]: 'Feminino',
  [Genero.Outro]: 'Outro',
};

/**
 * DTO de Endereço retornado pela API.
 */
export interface EnderecoResponseDto {
  idEndereco: number;
  logradouro: string;
  numero: number;
  bairro: string;
  complemento?: string | null;
  cep: string;
  municipio: string;
  uf: string;
  isEntrega: boolean;
  isCobranca: boolean;
}

/**
 * DTO de Cliente retornado pela API.
 */
export interface ClienteResponseDto {
  idCliente: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  ativo: boolean;
  email: string;
  genero: Genero;
  ddd: string;
  telefone: string;
  isAdmin: boolean;
  enderecos?: EnderecoResponseDto[];
}
