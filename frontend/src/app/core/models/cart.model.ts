import { Money } from './money';

export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  variantName: string;
  image: string;
  unitPrice: Money;
  quantity: number;
}

export interface CartTotals {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
}
