import { Collection } from '../../core/models';

export const COLLECTIONS: Collection[] = [
  { id: 'c1', slug: 'pelucias', name: 'Pelucias', description: 'Personagens favoritos em versao abracavel.', image: 'https://picsum.photos/seed/plush/640/360', productCount: 6, featured: true },
  { id: 'c2', slug: 'vinis', name: 'Trilhas em Vinil', description: 'Trilhas sonoras prensadas em vinil.', image: 'https://picsum.photos/seed/vinyl/640/360', productCount: 4, featured: true },
  { id: 'c3', slug: 'camisetas', name: 'Camisetas', description: 'Estampas oficiais de jogos indie e AAA.', image: 'https://picsum.photos/seed/shirt/640/360', productCount: 4, featured: true },
  { id: 'c4', slug: 'livros-e-artbooks', name: 'Livros e Artbooks', description: 'Arte, bastidores e localizacao.', image: 'https://picsum.photos/seed/book/640/360', productCount: 2, featured: false },
  { id: 'c5', slug: 'acessorios', name: 'Acessorios', description: 'Pins, mousepads e canecas.', image: 'https://picsum.photos/seed/pin/640/360', productCount: 2, featured: false },
];

export const CATEGORIES = [
  { id: 'cat1', slug: 'colecionaveis', name: 'Colecionaveis' },
  { id: 'cat2', slug: 'musica', name: 'Musica' },
  { id: 'cat3', slug: 'vestuario', name: 'Vestuario' },
  { id: 'cat4', slug: 'publicacoes', name: 'Publicacoes' },
];
