import { Money } from './money';

export type ProductStatus = 'draft' | 'active' | 'archived';
export type StockState = 'in-stock' | 'preorder' | 'sold-out';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

/** Combinacao vendavel (ex.: "Nintendo Switch 2 / Tamanho M"). */
export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: Money;
  compareAtPrice?: Money;
  stock: number;
  options: Record<string, string>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  franchise: string;
  price: Money;
  compareAtPrice?: Money;
  image: string;
  stockState: StockState;
  isNew: boolean;
  rating: number;
  reviewCount: number;
}

export interface Product extends ProductSummary {
  description: string;
  features: string[];
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  collectionIds: string[];
  categoryId: string;
  status: ProductStatus;
  updatedAt: string;
}
