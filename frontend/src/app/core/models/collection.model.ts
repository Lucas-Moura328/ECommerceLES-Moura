export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId?: string;
}
