import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from '../core/api/api-response.model';
import { ApiError } from '../core/api/api.error';
import { Collection, Product, ProductSummary } from '../core/models';
import { mockData } from '../core/utils/delay.util';
import {
  CatalogGateway,
  CatalogQuery,
  HomeShowcase,
} from '../features/client/catalog/data-access/catalog.gateway';
import { MockDb } from './mock-db';

@Injectable()
export class CatalogMockGateway extends CatalogGateway {
  private readonly db = inject(MockDb);

  listProducts(query: CatalogQuery): Observable<PagedResult<ProductSummary>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;
    let items = this.db.products().filter((product) => product.status === 'active');

    if (query.collection) {
      const collection = this.db.collections().find((item) => item.slug === query.collection);
      items = items.filter((product) => collection && product.collectionIds.includes(collection.id));
    }
    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.franchise.toLowerCase().includes(term),
      );
    }
    if (query.franchise) {
      items = items.filter((product) => product.franchise === query.franchise);
    }
    if (query.minPrice !== undefined) {
      items = items.filter((product) => product.price >= query.minPrice!);
    }
    if (query.maxPrice !== undefined) {
      items = items.filter((product) => product.price <= query.maxPrice!);
    }
    if (query.onSale) {
      items = items.filter((product) => !!product.compareAtPrice);
    }

    items = [...items].sort((a, b) => {
      switch (query.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return Number(b.isNew) - Number(a.isNew);
        default:
          return b.rating - a.rating;
      }
    });

    const start = (page - 1) * pageSize;
    return mockData<PagedResult<ProductSummary>>({
      items: items.slice(start, start + pageSize).map(toSummary),
      page,
      pageSize,
      total: items.length,
    });
  }

  getProductBySlug(slug: string): Observable<Product> {
    const product = this.db.products().find((item) => item.slug === slug);
    if (!product) {
      throw new ApiError('Produto nao encontrado.', 404);
    }
    return mockData(product);
  }

  listCollections(): Observable<Collection[]> {
    return mockData(this.db.collections());
  }

  getCollectionBySlug(slug: string): Observable<Collection> {
    const collection = this.db.collections().find((item) => item.slug === slug);
    if (!collection) {
      throw new ApiError('Colecao nao encontrada.', 404);
    }
    return mockData(collection);
  }

  getHomeShowcase(): Observable<HomeShowcase> {
    const products = this.db.products().filter((product) => product.status === 'active');
    return mockData<HomeShowcase>({
      featured: products.slice(0, 6).map(toSummary),
      newArrivals: products.filter((product) => product.isNew).map(toSummary),
      onSale: products.filter((product) => product.compareAtPrice).map(toSummary),
      restocked: products.slice(6, 12).map(toSummary),
      collections: this.db.collections(),
    });
  }

  listRelated(productId: string): Observable<ProductSummary[]> {
    const product = this.db.products().find((item) => item.id === productId);
    const related = this.db
      .products()
      .filter((item) => item.id !== productId && item.categoryId === product?.categoryId)
      .slice(0, 4)
      .map(toSummary);
    return mockData(related);
  }
}

function toSummary(product: Product): ProductSummary {
  const { id, slug, title, franchise, price, compareAtPrice, image, stockState, isNew, rating, reviewCount } = product;
  return { id, slug, title, franchise, price, compareAtPrice, image, stockState, isNew, rating, reviewCount };
}
