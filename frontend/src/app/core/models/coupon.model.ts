import { Money } from './money';

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal: Money;
  active: boolean;
  expiresAt: string;
}
