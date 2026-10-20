export interface MangaItem {
  id: number;
  titulo: string;
  precio: number;
  demografia: string;
  imagen: string;
}

export interface MangaDestacado {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen: string;
}

export interface Editorial {
  nombre: string;
  pais: string;
  descripcion: string;
  obras: number;
  imagen: string;
  slug: string;
}

export const destacados: MangaDestacado[] = [
  {
    id: 106,
    titulo: 'KonoSuba',
    categoria: 'SHŌNEN · COMEDIA',
    descripcion: 'Kazuma Satou muere en un accidente ridículo y es enviado a un mundo de fantasía con la diosa Aqua. Pero en lugar de un mundo glorioso, se encuentra con una pandilla de inútiles en un mundo lleno de monstruos...',
    imagen: '/images/carrusel/Konosuba_arg_01.jpg',
  },
  {
    id: 102,
    titulo: "Frieren: Beyond Journey's End",
    categoria: 'SHŌNEN · FANTASY',
    descripcion: 'Frieren es una elfa que vivió el viaje que derrotó al Rey Demonio hace 50 años. Ahora, tras la muerte de sus compañeros humanos, emprende un nuevo viaje...',
    imagen: '/images/carrusel/Frieren_01.jpg',
  },
  {
    id: 6,
    titulo: 'Love Is War',
    categoria: 'ROMANCE · COMEDIA',
    descripcion: 'Dos mentes brillantes del consejo estudiantil están profundamente enamoradas, pero su orgullo desmedido convertirá el amor en una auténtica batalla mental...',
    imagen: '/images/carrusel/Kaguya_sama_arg_01.jpg',
  },
  {
    id: 107,
    titulo: 'Oshi no Ko',
    categoria: 'DRAMA · MISTERIO',
    descripcion: 'Un médico ginecólogo y su paciente reencarnan como los hijos gemelos de su Idol favorita. Un vistazo crudo y atrapante al mundo del espectáculo...',
    imagen: '/images/carrusel/Oshi_no_ko_arg_01.jpg',
  },
];

export const editoriales: Editorial[] = [
  {
    nombre: 'Ivrea Argentina',
    pais: 'Argentina',
    descripcion: 'Una de las editoriales más importantes de manga en Latinoamérica.',
    obras: 7,
    imagen: '/images/editoriales/ivrea_argentina.png',
    slug: 'ivrea',
  },
  {
    nombre: 'Panini Manga',
    pais: 'México/España',
    descripcion: 'Editorial multinacional con fuerte presencia en Latinoamérica.',
    obras: 6,
    imagen: '/images/editoriales/panini_manga.jpg',
    slug: 'panini',
  },
  {
    nombre: 'Norma Editorial',
    pais: 'España',
    descripcion: 'Editorial española con larga trayectoria en el manga.',
    obras: 3,
    imagen: '/images/editoriales/norma_editorial.png',
    slug: 'norma',
  },
  {
    nombre: 'Planeta Comics',
    pais: 'España',
    descripcion: 'Sello editorial especializado en cómics y manga.',
    obras: 1,
    imagen: '/images/editoriales/planeta_comics.png',
    slug: 'planeta',
  },
];

export const novedades: MangaItem[] = [
  { id: 1, titulo: "Demon Slayer #1", precio: 8990, demografia: "SHŌNEN", imagen: "/images/novedades/Demon_Slayer_01.jpg" },
  { id: 2, titulo: "Kaguya-sama: Love is War #1", precio: 9490, demografia: "SEINEN", imagen: "/images/novedades/Kaguya_sama_arg_01.jpg" },
  { id: 3, titulo: "Las Quintillizas #1", precio: 9990, demografia: "SHŌNEN", imagen: "/images/novedades/Las_quintillizas_1.png" },
  { id: 4, titulo: "One Piece #1", precio: 8990, demografia: "SHŌNEN", imagen: "/images/novedades/One_Piece_01.jpg" },
  { id: 5, titulo: "Jujutsu Kaisen #1", precio: 8990, demografia: "SHŌNEN", imagen: "/images/novedades/xJujutsu_kaisen_arg_01.jpg" },
  { id: 6, titulo: "Call of the Night #1", precio: 8590, demografia: "SHŌNEN", imagen: "/images/novedades/yofukashi_no_uta.jpg" }
];

export const populares: MangaItem[] = [
  { id: 101, titulo: "Ataque a los Titanes #1", precio: 9490, demografia: "SHŌNEN", imagen: "/images/mas_populares/ataque_a_los_titanes_1.jpg" },
  { id: 102, titulo: "Atom: The Beginning #1", precio: 8990, demografia: "SEINEN", imagen: "/images/mas_populares/Atom_the_beginning_1.png" },
  { id: 103, titulo: "Berserk #1", precio: 11990, demografia: "SEINEN", imagen: "/images/mas_populares/Berserk.png" },
  { id: 104, titulo: "Demon Slayer #1", precio: 8990, demografia: "SHŌNEN", imagen: "/images/mas_populares/Demon_Slayer_01.jpg" },
  { id: 105, titulo: "Naruto #1", precio: 8590, demografia: "SHŌNEN", imagen: "/images/mas_populares/naruto_tomo_1.png" },
  { id: 106, titulo: "One Piece #1", precio: 8990, demografia: "SHŌNEN", imagen: "/images/mas_populares/One_Piece_01_p.jpg" },
  { id: 107, titulo: "Spy x Family #1", precio: 8590, demografia: "SHŌNEN", imagen: "/images/mas_populares/Spy_x_family_1.png" },
  { id: 108, titulo: "Jujutsu Kaisen #1", precio: 8990, demografia: "SHŌNEN", imagen: "/images/mas_populares/xJujutsu_kaisen_arg_01.jpg" }
];
