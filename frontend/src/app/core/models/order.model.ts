import { Money } from './money';
import { CartItem } from './cart.model';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'packing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Address {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  ordersCount: number;
  totalSpent: Money;
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  customer: Pick<Customer, 'name' | 'email' | 'phone'>;
  shippingAddress: Address;
  items: CartItem[];
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
  paymentMethod: 'pix' | 'credit-card' | 'boleto';
  createdAt: string;
  trackingCode?: string;
}
