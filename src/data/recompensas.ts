export interface Recompensa {
  id: string;
  nombre: string;
  costoPuntos: number;
  stock: number;
  tipo: 'merch' | 'manga' | 'Novela-visual' | 'edicion-especial';
  descripcion: string;
  imagen: string;
}

export interface SerieIntercambio {
  id: string;
  titulo: string;
  tomos: number[];
}

export interface EstadoCertificacion {
  value: string;
  label: string;
  puntos: number;
  color: string;
}

export const recompensas: Recompensa[] = [
  {
    id: 'r1',
    nombre: 'Marcapáginas Coleccionable',
    costoPuntos: 750,
    stock: 50,
    tipo: 'merch',
    descripcion: 'Marcapáginas metálico con diseño exclusivo de MangaFlow. Ediciones de One Piece, Naruto y más.',
    imagen: '/images/recompensas/MarcaPaginas.jpg',
  },
  {
    id: 'r2',
    nombre: 'Portavasos Magnético',
    costoPuntos: 1250,
    stock: 30,
    tipo: 'merch',
    descripcion: 'Set de 4 portavasos magnéticos con ilustraciones de personajes icónicos del manga.',
    imagen: '/images/recompensas/PortavasosMagnetico.jpg',
  },
  {
    id: 'r3',
    nombre: 'Póster A2 Exclusivo',
    costoPuntos: 2000,
    stock: 20,
    tipo: 'merch',
    descripcion: 'Póster de alta calidad A2 con arte exclusivo de MangaFlow. Disponible en diseños de Berserk...',
    imagen: '/images/recompensas/poster.jpeg',
  },
  {
    id: 'r4',
    nombre: 'Tote Bag MangaFlow',
    costoPuntos: 3000,
    stock: 15,
    tipo: 'merch',
    descripcion: 'Bolsa de tela exclusiva con el logo de MangaFlow y diseños de mangas seleccionados.',
    imagen: '/images/recompensas/tote_bag_g.png',
  },
  {
    id: 'r5',
    nombre: 'Manga Digital',
    costoPuntos: 5000,
    stock: 999,
    tipo: 'manga',
    descripcion: 'Elige cualquier tomo digital de nuestra colección. Acceso inmediato en tu Biblioteca.',
    imagen: '/images/recompensas/3_mangas_digitales.jpg',
  },
  {
    id: 'r6',
    nombre: '3 Mangas Digitales',
    costoPuntos: 8000,
    stock: 999,
    tipo: 'manga',
    descripcion: 'Elige 3 tomos digitales de cualquier serie disponible en MangaFlow. Acceso inmediato en tu Biblioteca.',
    imagen: '/images/recompensas/3_mangas_digitales.jpg',
  },
  {
    id: 'r7',
    nombre: 'Manga Físico',
    costoPuntos: 12500,
    stock: 10,
    tipo: 'manga',
    descripcion: 'Selecciona cualquier manga físico de nuestra colección. Sujeto a disponibilidad de stock.',
    imagen: '/images/recompensas/manga_fisico_2.jpeg',
  },
  {
    id: 'r8',
    nombre: 'Manga Novela Visual',
    costoPuntos: 25000,
    stock: 5,
    tipo: 'Novela-visual',
    descripcion: 'Desbloquea el capítulo especial premium de la novela visual con ilustraciones inéditas.',
    imagen: '/images/recompensas/novela_visual.jpeg',
  },
];

export const seriesIntercambio: SerieIntercambio[] = [
  { id: 'm1', titulo: 'Demon Slayer', tomos: [1, 2, 3, 4, 5] },
  { id: 'm2', titulo: 'Kaguya-sama: Love is War', tomos: [1, 2, 3] },
  { id: 'm3', titulo: 'One Piece', tomos: [1, 2, 3, 4, 5, 6] },
  { id: 'm4', titulo: 'Jujutsu Kaisen', tomos: [1, 2, 3] },
  { id: 'm5', titulo: 'Berserk', tomos: [1, 2] },
];

export const estadosCertificacion: EstadoCertificacion[] = [
  { value: 'nuevo', label: 'Nuevo', puntos: 800, color: 'text-success' },
  { value: 'muy-bueno', label: 'Muy bueno', puntos: 600, color: 'text-info' },
  { value: 'bueno', label: 'Bueno', puntos: 400, color: 'text-warning' },
  { value: 'regular', label: 'Regular', puntos: 150, color: 'text-orange' },
];
