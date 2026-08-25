import { Coupon, Customer, Order } from '../../core/models';
import { PRODUCTS } from './products.mock';

const STATUSES: Order['status'][] = ['pending', 'paid', 'packing', 'shipped', 'delivered', 'cancelled'];

export const CUSTOMERS: Customer[] = Array.from({ length: 8 }, (_, index) => ({
  id: `cli${index + 1}`,
  name: ['Ana Souza', 'Bruno Lima', 'Carla Reis', 'Diego Alves', 'Elisa Prado', 'Felipe Nunes', 'Gabi Rocha', 'Hugo Dias'][index],
  email: `cliente${index + 1}@exemplo.com`,
  phone: '(11) 90000-000' + index,
  document: `000.000.00${index}-00`,
  ordersCount: 1 + (index % 4),
  totalSpent: 250 + index * 137.5,
  createdAt: new Date(2026, 2, index + 1).toISOString(),
}));

export const ORDERS: Order[] = Array.from({ length: 12 }, (_, index) => {
  const customer = CUSTOMERS[index % CUSTOMERS.length];
  const product = PRODUCTS[index % PRODUCTS.length];
  const variant = product.variants[0];
  const quantity = 1 + (index % 3);
  const subtotal = variant.price * quantity;
  const shipping = subtotal >= 299 ? 0 : 29.9;
  return {
    id: `o${index + 1}`,
    code: `LES-2026-${String(1000 + index)}`,
    status: STATUSES[index % STATUSES.length],
    customer: { name: customer.name, email: customer.email, phone: customer.phone },
    shippingAddress: {
      zipCode: '01310-100',
      street: 'Av. Paulista',
      number: String(100 + index),
      district: 'Bela Vista',
      city: 'Sao Paulo',
      state: 'SP',
    },
    items: [
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        title: product.title,
        variantName: variant.name,
        image: product.image,
        unitPrice: variant.price,
        quantity,
      },
    ],
    subtotal,
    discount: 0,
    shipping,
    total: subtotal + shipping,
    paymentMethod: (['pix', 'credit-card', 'boleto'] as const)[index % 3],
    createdAt: new Date(2026, 7, (index % 25) + 1).toISOString(),
    trackingCode: index % 3 === 0 ? `BR${900000000 + index}BR` : undefined,
  } satisfies Order;
});

export const COUPONS: Coupon[] = [
  { id: 'cup1', code: 'BEMVINDO10', type: 'percent', value: 10, minSubtotal: 150, active: true, expiresAt: '2026-12-31' },
  { id: 'cup2', code: 'FRETEGRATIS', type: 'fixed', value: 29.9, minSubtotal: 200, active: true, expiresAt: '2026-10-31' },
  { id: 'cup3', code: 'BLACKLES', type: 'percent', value: 25, minSubtotal: 400, active: false, expiresAt: '2026-11-30' },
];
