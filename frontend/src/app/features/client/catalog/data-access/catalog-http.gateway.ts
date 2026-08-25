import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from '../../../../core/api/api-response.model';
import { ApiService } from '../../../../core/api/api.service';
import { Collection, Product, ProductSummary } from '../../../../core/models';
import { CatalogGateway, CatalogQuery, HomeShowcase } from './catalog.gateway';

/** Implementacao real: ASP.NET Core + Response<T>. */
@Injectable()
export class CatalogHttpGateway extends CatalogGateway {
  private readonly api = inject(ApiService);

  listProducts(query: CatalogQuery): Observable<PagedResult<ProductSummary>> {
    return this.api.get<PagedResult<ProductSummary>>('catalogo/produtos', { ...query });
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.api.get<Product>(`catalogo/produtos/${slug}`);
  }

  listCollections(): Observable<Collection[]> {
    return this.api.get<Collection[]>('catalogo/colecoes');
  }

  getCollectionBySlug(slug: string): Observable<Collection> {
    return this.api.get<Collection>(`catalogo/colecoes/${slug}`);
  }

  getHomeShowcase(): Observable<HomeShowcase> {
    return this.api.get<HomeShowcase>('catalogo/vitrine');
  }

  listRelated(productId: string): Observable<ProductSummary[]> {
    return this.api.get<ProductSummary[]>(`catalogo/produtos/${productId}/relacionados`);
  }
}
