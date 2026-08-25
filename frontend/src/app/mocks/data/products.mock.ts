import { Product } from '../../core/models';

interface Seed {
  slug: string;
  title: string;
  franchise: string;
  price: number;
  compareAtPrice?: number;
  collectionId: string;
  categoryId: string;
  stockState: Product['stockState'];
  isNew?: boolean;
  options?: { name: string; values: string[] }[];
}

const SEEDS: Seed[] = [
  { slug: 'pelucia-cavaleiro-oco', title: 'Pelucia The Hollow Knight', franchise: 'Hollow Knight', price: 189.9, collectionId: 'c1', categoryId: 'cat1', stockState: 'in-stock', isNew: true },
  { slug: 'pelucia-lancer', title: 'Pelucia Lancer', franchise: 'DELTARUNE', price: 179.9, compareAtPrice: 219.9, collectionId: 'c1', categoryId: 'cat1', stockState: 'in-stock' },
  { slug: 'pelucia-jack-frost', title: 'Pelucia Jack Frost', franchise: 'Shin Megami Tensei', price: 199.9, collectionId: 'c1', categoryId: 'cat1', stockState: 'preorder' },
  { slug: 'pelucia-baba-is-you', title: 'Pelucia Baba Is Plush', franchise: 'Baba Is You', price: 159.9, collectionId: 'c1', categoryId: 'cat1', stockState: 'sold-out' },
  { slug: 'pelucia-astro', title: 'Pelucia ASTRO', franchise: 'ASTRO BOT', price: 209.9, collectionId: 'c1', categoryId: 'cat1', stockState: 'in-stock', isNew: true },
  { slug: 'pelucia-niko', title: 'Pelucia Niko', franchise: 'OneShot', price: 169.9, collectionId: 'c1', categoryId: 'cat1', stockState: 'in-stock' },
  { slug: 'vinil-stardew-valley', title: 'Stardew Valley: Festival of Seasons (Vinil)', franchise: 'Stardew Valley', price: 249.9, collectionId: 'c2', categoryId: 'cat2', stockState: 'in-stock', options: [{ name: 'Cor', values: ['Preto', 'Verde translucido'] }] },
  { slug: 'vinil-okami', title: 'Okami Vinyl Soundtrack', franchise: 'Okami', price: 289.9, compareAtPrice: 329.9, collectionId: 'c2', categoryId: 'cat2', stockState: 'in-stock' },
  { slug: 'vinil-deltarune-cap4', title: 'DELTARUNE Chapter 4 (Vinil)', franchise: 'DELTARUNE', price: 219.9, collectionId: 'c2', categoryId: 'cat2', stockState: 'preorder', isNew: true },
  { slug: 'vinil-astro-bot', title: 'ASTRO BOT Vinyl Soundtrack', franchise: 'ASTRO BOT', price: 239.9, collectionId: 'c2', categoryId: 'cat2', stockState: 'in-stock' },
  { slug: 'camiseta-baguette', title: 'Camiseta Baguette Listrada', franchise: 'Clair Obscur', price: 149.9, collectionId: 'c3', categoryId: 'cat3', stockState: 'in-stock', options: [{ name: 'Tamanho', values: ['P', 'M', 'G', 'GG'] }] },
  { slug: 'camiseta-protetor-do-coracao', title: 'Camiseta Protector of the Heart', franchise: 'Helldivers 2', price: 159.9, collectionId: 'c3', categoryId: 'cat3', stockState: 'in-stock', options: [{ name: 'Tamanho', values: ['P', 'M', 'G', 'GG'] }] },
  { slug: 'camiseta-dave-the-diver', title: 'Camiseta Dave the Diver', franchise: 'Dave the Diver', price: 139.9, compareAtPrice: 169.9, collectionId: 'c3', categoryId: 'cat3', stockState: 'in-stock', options: [{ name: 'Tamanho', values: ['P', 'M', 'G'] }] },
  { slug: 'camiseta-pizza-tower', title: 'Camiseta Pizza Tower', franchise: 'Pizza Tower', price: 144.9, collectionId: 'c3', categoryId: 'cat3', stockState: 'sold-out', options: [{ name: 'Tamanho', values: ['M', 'G'] }] },
  { slug: 'artbook-slay-the-princess', title: 'The Art of Slay the Princess', franchise: 'Slay the Princess', price: 329.9, collectionId: 'c4', categoryId: 'cat4', stockState: 'in-stock' },
  { slug: 'livro-legends-of-localization', title: 'Legends of Localization: Zelda', franchise: 'The Legend of Zelda', price: 219.9, collectionId: 'c4', categoryId: 'cat4', stockState: 'in-stock' },
  { slug: 'pin-set-miman', title: 'Miman Pin Set', franchise: 'Shin Megami Tensei V', price: 59.9, compareAtPrice: 89.9, collectionId: 'c5', categoryId: 'cat1', stockState: 'in-stock' },
  { slug: 'mousepad-dave-the-diver', title: 'Desk Mat Dave the Diver', franchise: 'Dave the Diver', price: 189.9, collectionId: 'c5', categoryId: 'cat1', stockState: 'preorder' },
];

export const PRODUCTS: Product[] = SEEDS.map((seed, index) => {
  const options = seed.options ?? [{ name: 'Edicao', values: ['Padrao'] }];
  const values = options[0].values;
  return {
    id: `p${index + 1}`,
    slug: seed.slug,
    title: seed.title,
    franchise: seed.franchise,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    image: `https://picsum.photos/seed/${seed.slug}/600/600`,
    stockState: seed.stockState,
    isNew: seed.isNew ?? false,
    rating: 4 + ((index % 3) * 0.3),
    reviewCount: 4 + index * 3,
    description:
      'Produto oficial licenciado, com acabamento premium e producao em lote limitado. Item de mockup para validar a estrutura do front-end.',
    features: ['Produto oficial licenciado', 'Estoque limitado', 'Envio para todo o Brasil'],
    images: [1, 2, 3].map((n) => ({
      id: `${seed.slug}-img${n}`,
      url: `https://picsum.photos/seed/${seed.slug}-${n}/900/900`,
      alt: seed.title,
    })),
    options,
    variants: values.map((value, variantIndex) => ({
      id: `p${index + 1}-v${variantIndex + 1}`,
      sku: `${seed.slug.toUpperCase().slice(0, 8)}-${variantIndex + 1}`,
      name: value,
      price: seed.price,
      compareAtPrice: seed.compareAtPrice,
      stock: seed.stockState === 'sold-out' ? 0 : 5 + variantIndex * 3,
      options: { [options[0].name]: value },
    })),
    collectionIds: [seed.collectionId],
    categoryId: seed.categoryId,
    status: 'active',
    updatedAt: new Date(2026, 6, (index % 27) + 1).toISOString(),
  } satisfies Product;
});
