export interface MangaCatalogo {
  id: number;
  titulo: string;
  precio: number;
  precioDigital?: number;
  demografia: string;
  generos: string[];
  esDigitalOnly: boolean;
  proximamenteFisico?: boolean;
  imagen: string;
  autor?: string;
  sinopsis?: string;
  activo?: boolean;
  stock?: number;
}

export const mangasCatalogo: MangaCatalogo[] = [
  { id: 1, titulo: 'Ataque a los Titanes', precio: 9490, demografia: 'Shōnen', generos: ['Acción', 'Drama', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/ataque_a_los_titanes_1.jpg' },
  { id: 2, titulo: 'Atom: The Beginning', precio: 8990, demografia: 'Seinen', generos: ['Acción', 'Histórico'], esDigitalOnly: false, imagen: '/images/catalogo/Atom_the_beginning_1.png' },
  { id: 4, titulo: 'Berserk', precio: 11990, demografia: 'Seinen', generos: ['Acción', 'Horror', 'Fantasy', 'Drama'], esDigitalOnly: false, imagen: '/images/catalogo/Berserk.png' },
  { id: 6, titulo: 'Demon Slayer', precio: 8990, demografia: 'Shōnen', generos: ['Acción', 'Aventura', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/Demon_Slayer_01.jpg' },
  { id: 8, titulo: 'Kaguya-sama: Love is War', precio: 9490, demografia: 'Seinen', generos: ['Romance', 'Comedia', 'Drama'], esDigitalOnly: false, imagen: '/images/catalogo/Kaguya_sama_arg_01.jpg' },
  { id: 10, titulo: 'Las Quintillizas', precio: 9990, demografia: 'Shōnen', generos: ['Romance', 'Comedia'], esDigitalOnly: false, imagen: '/images/catalogo/Las_quintillizas_1.png' },
  { id: 11, titulo: 'Naruto', precio: 8590, demografia: 'Shōnen', generos: ['Acción', 'Aventura'], esDigitalOnly: false, imagen: '/images/catalogo/naruto_tomo_1.png' },
  { id: 12, titulo: 'One Piece', precio: 8990, precioDigital: 3990, demografia: 'Shōnen', generos: ['Acción', 'Aventura', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/One_Piece_01.jpg' },
  { id: 14, titulo: 'Spy x Family', precio: 8590, demografia: 'Shōnen', generos: ['Acción', 'Comedia'], esDigitalOnly: false, imagen: '/images/catalogo/Spy_x_family_1.png' },
  { id: 15, titulo: 'Vinland Saga', precio: 10990, demografia: 'Seinen', generos: ['Acción', 'Histórico', 'Drama'], esDigitalOnly: false, imagen: '/images/catalogo/vinland_saga.png' },
  { id: 16, titulo: 'Jujutsu Kaisen', precio: 8990, demografia: 'Shōnen', generos: ['Acción', 'Horror', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/xJujutsu_kaisen_arg_01.jpg' },
  { id: 17, titulo: 'Call of the Night', precio: 8590, demografia: 'Shōnen', generos: ['Romance', 'Comedia', 'Psicológico'], esDigitalOnly: false, imagen: '/images/catalogo/yofukashi_no_uta.jpg' },
  { id: 3, titulo: 'Bakemonogatari', precio: 2300, demografia: 'Seinen', generos: ['Romance', 'Psicológico'], esDigitalOnly: true, imagen: '/images/catalogo/Bakemonogatari_1.png' },
  { id: 5, titulo: 'Demon Slave', precio: 2300, demografia: 'Shōnen', generos: ['Acción', 'Fantasy'], esDigitalOnly: true, imagen: '/images/catalogo/Demon_slave_01.jpg' },
  { id: 7, titulo: 'Frieren', precio: 2300, demografia: 'Shōnen', generos: ['Aventura', 'Fantasy', 'Drama'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/catalogo/Frieren_01.jpg' },
  { id: 9, titulo: 'KonoSuba', precio: 2300, demografia: 'Shōnen', generos: ['Comedia', 'Fantasy', 'Aventura'], esDigitalOnly: true, imagen: '/images/catalogo/Konosuba_arg_01.jpg' },
  { id: 13, titulo: 'Oshi no Ko', precio: 2300, demografia: 'Seinen', generos: ['Drama', 'Psicológico'], esDigitalOnly: true, imagen: '/images/catalogo/Oshi_no_ko_arg_01.jpg' },
  { id: 18, titulo: 'Akane-banashi', precio: 2300, demografia: 'Shōnen', generos: ['Drama', 'Comedia'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/mangas_digitales/akane_banashi.jpg' },
  { id: 19, titulo: 'Dandadan', precio: 2300, demografia: 'Shōnen', generos: ['Acción', 'Horror', 'Comedia'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/mangas_digitales/Dandadan.jpg' },
  { id: 20, titulo: 'Hunter x Hunter', precio: 2300, demografia: 'Shōnen', generos: ['Acción', 'Aventura', 'Fantasy'], esDigitalOnly: true, imagen: '/images/mangas_digitales/hunter_x_hunter.jpg' },
  { id: 21, titulo: 'RuriDragon', precio: 2300, demografia: 'Shōnen', generos: ['Comedia', 'Fantasy'], esDigitalOnly: true, imagen: '/images/mangas_digitales/RuriDragon.jpg' },
  { id: 22, titulo: 'Sakamoto Days', precio: 2300, demografia: 'Shōnen', generos: ['Acción', 'Comedia'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/mangas_digitales/SAKAMOTO_DAYS.jpg' },
];

export const demografiasCatalogo = ['Todas', 'Shōnen', 'Seinen', 'Shōjo', 'Josei'];
export const generosCatalogo = ['Todos', 'Acción', 'Aventura', 'Romance', 'Horror', 'Comedia', 'Drama', 'Histórico', 'Fantasy', 'Psicológico'];

const claveCatalogo = 'mangaFlow_catalogo';

export const slugManga = (titulo: string) => {
  const normalizado = titulo
    .replace(/\s+#\d+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  if (normalizado === 'frieren-beyond-journeys-end') return 'frieren';
  if (normalizado === 'love-is-war') return 'kaguya-sama-love-is-war';
  return normalizado;
};

export const esMangaActivo = (manga: MangaCatalogo) => manga.activo !== false;

export const cargarCatalogo = (): MangaCatalogo[] => {
  const guardado = localStorage.getItem(claveCatalogo);
  if (!guardado) return mangasCatalogo;

  try {
    const datos: unknown = JSON.parse(guardado);
    if (!Array.isArray(datos)) {
      console.error('Los datos guardados del catálogo no tienen el formato de lista esperado.');
      return mangasCatalogo;
    }

    const validos = datos.filter((item): item is MangaCatalogo => (
      typeof item === 'object'
      && item !== null
      && 'id' in item
      && typeof item.id === 'number'
      && 'titulo' in item
      && typeof item.titulo === 'string'
      && 'precio' in item
      && typeof item.precio === 'number'
      && 'demografia' in item
      && typeof item.demografia === 'string'
      && 'generos' in item
      && Array.isArray(item.generos)
      && 'esDigitalOnly' in item
      && typeof item.esDigitalOnly === 'boolean'
      && 'imagen' in item
      && typeof item.imagen === 'string'
    ));
    if (validos.length !== datos.length) {
      console.error('Se omitieron entradas inválidas del catálogo guardado.');
    }
    return validos.map(manga => {
      const mangaInicial = mangasCatalogo.find(inicial => inicial.id === manga.id);
      return {
        ...manga,
        precioDigital: manga.precioDigital ?? mangaInicial?.precioDigital,
      };
    });
  } catch (error) {
    console.error('No se pudo leer el catálogo guardado; se usarán los datos iniciales.', error);
    return mangasCatalogo;
  }
};

export const guardarCatalogo = (catalogo: MangaCatalogo[]) => {
  localStorage.setItem(claveCatalogo, JSON.stringify(catalogo));
};
