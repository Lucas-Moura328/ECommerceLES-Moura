/**
 * Opções de filtro por status na tabela de clientes.
 */
export type CustomerStatusFilter = 'all' | 'active' | 'inactive';

/**
 * Estado de busca e filtros do módulo de clientes.
 */
export interface CustomerFilterState {
  searchTerm: string;
  status: CustomerStatusFilter;
}
