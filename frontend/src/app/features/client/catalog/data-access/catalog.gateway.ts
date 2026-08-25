import { Observable } from 'rxjs';

import { PagedResult } from '../../../../core/api/api-response.model';
import { Collection, Product, ProductSummary } from '../../../../core/models';

export interface CatalogQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  collection?: string;
  franchise?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'newest';
}

export interface HomeShowcase {
  featured: ProductSummary[];
  newArrivals: ProductSummary[];
  onSale: ProductSummary[];
  restocked: ProductSummary[];
  collections: Collection[];
}

/**
 * Contrato de leitura do catalogo do Cliente.
 * Componentes dependem SEMPRE desta classe abstrata; a implementacao (HTTP ou
 * mock) e escolhida no bootstrap.
 */
export abstract class CatalogGateway {
  abstract listProducts(query: CatalogQuery): Observable<PagedResult<ProductSummary>>;
  abstract getProductBySlug(slug: string): Observable<Product>;
  abstract listCollections(): Observable<Collection[]>;
  abstract getCollectionBySlug(slug: string): Observable<Collection>;
  abstract getHomeShowcase(): Observable<HomeShowcase>;
  abstract listRelated(productId: string): Observable<ProductSummary[]>;
}
