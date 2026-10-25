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
  tomosDisponibles?: number;
  activo?: boolean;
  stock?: number;
}

export const PRECIO_MANGA_DIGITAL = 2300;

export const mangasCatalogo: MangaCatalogo[] = [
  { id: 1, titulo: 'Ataque a los Titanes', precio: 9490, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Drama', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/ataque_a_los_titanes_1.jpg', autor: 'Hajime Isayama', sinopsis: 'Eren Jaeger se une al cuerpo de exploración para exterminar a los titanes que destruyeron su hogar y descubrir la verdad del mundo.', tomosDisponibles: 34 },
  { id: 2, titulo: 'Atom: The Beginning', precio: 8990, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Seinen', generos: ['Acción', 'Histórico'], esDigitalOnly: false, imagen: '/images/catalogo/Atom_the_beginning_1.png', autor: 'Tetsuro Kasahara (dibujo), Makoto Tezuka y Masami Yuki (historia)', sinopsis: 'Precuela de Astro Boy sobre los jóvenes científicos Tenma y Ochanomizu en la creación del robot A106.', tomosDisponibles: 21 },
  { id: 4, titulo: 'Berserk', precio: 11990, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Seinen', generos: ['Acción', 'Horror', 'Fantasy', 'Drama'], esDigitalOnly: false, imagen: '/images/catalogo/Berserk.png', autor: 'Kentaro Miura / Studio Gaga & Kouji Mori', sinopsis: 'Guts, un mercenario traumatizado, empuña una enorme espada en busca de venganza contra su antiguo amigo Griffith en un mundo oscuro.', tomosDisponibles: 42 },
  { id: 6, titulo: 'Demon Slayer', precio: 8990, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Aventura', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/Demon_Slayer_01.jpg', autor: 'Koyoharu Gotouge', sinopsis: 'Tanjiro se convierte en cazador de demonios para curar a su hermana Nezuko, transformada en monstruo tras la masacre de su familia.', tomosDisponibles: 23 },
  { id: 8, titulo: 'Kaguya-sama: Love is War', precio: 9490, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Seinen', generos: ['Romance', 'Comedia', 'Drama'], esDigitalOnly: false, imagen: '/images/catalogo/Kaguya_sama_arg_01.jpg', autor: 'Aka Akasaka', sinopsis: 'Dos prodigios del consejo estudiantil enamorados recurren a batallas de ingenio psicológico para obligar al otro a confesarse primero.', tomosDisponibles: 28 },
  { id: 10, titulo: 'Las Quintillizas', precio: 9990, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Romance', 'Comedia'], esDigitalOnly: false, imagen: '/images/catalogo/Las_quintillizas_1.png', autor: 'Negi Haruba', sinopsis: 'Futaro, un estudiante pobre pero genio, se convierte en tutor privado de cinco hermanas quintillizas idénticas para ayudarlas a graduarse.', tomosDisponibles: 14 },
  { id: 11, titulo: 'Naruto', precio: 8590, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Aventura'], esDigitalOnly: false, imagen: '/images/catalogo/naruto_tomo_1.png', autor: 'Masashi Kishimoto', sinopsis: 'Naruto, un joven ninja marginado con un demonio zorro dentro, sueña con convertirse en Hokage para ser reconocido por su aldea.', tomosDisponibles: 72 },
  { id: 12, titulo: 'One Piece', precio: 8990, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Aventura', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/One_Piece_01.jpg', autor: 'Eiichiro Oda', sinopsis: 'Monkey D. Luffy y su tripulación de piratas navegan por el mundo buscando el tesoro "One Piece" para convertirse en el Rey de los Piratas.', tomosDisponibles: 110 },
  { id: 14, titulo: 'Spy x Family', precio: 8590, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Comedia'], esDigitalOnly: false, imagen: '/images/catalogo/Spy_x_family_1.png', autor: 'Tatsuya Endo', sinopsis: 'Un espía, una asesina a sueldo y una niña telépata forman una familia falsa sin revelarse sus verdaderas identidades para cumplir una misión.', tomosDisponibles: 14 },
  { id: 15, titulo: 'Vinland Saga', precio: 10990, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Seinen', generos: ['Acción', 'Histórico', 'Drama'], esDigitalOnly: false, imagen: '/images/catalogo/vinland_saga.png', autor: 'Makoto Yukimura', sinopsis: 'Thorfinn busca venganza tras la muerte de su padre con la banda de su asesino, en una travesía nórdica hacia la madurez y la paz.', tomosDisponibles: 28 },
  { id: 16, titulo: 'Jujutsu Kaisen', precio: 8990, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Horror', 'Fantasy'], esDigitalOnly: false, imagen: '/images/catalogo/xJujutsu_kaisen_arg_01.jpg', autor: 'Gege Akutami', sinopsis: 'Yuji Itadori ingiere un talismán maldito para salvar a sus amigos y entra al mundo de los hechiceros para erradicar las maldiciones.', tomosDisponibles: 28 },
  { id: 17, titulo: 'Call of the Night', precio: 8590, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Romance', 'Comedia', 'Psicológico'], esDigitalOnly: false, imagen: '/images/catalogo/yofukashi_no_uta.jpg', autor: 'Kotoyama', sinopsis: 'Kou, un estudiante con insomnio, vaga de noche y conoce a la vampiresa Nazuna, decidiendo enamorarse de ella para transformarse en vampiro.', tomosDisponibles: 20 },
  { id: 3, titulo: 'Bakemonogatari', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Seinen', generos: ['Romance', 'Psicológico'], esDigitalOnly: true, imagen: '/images/catalogo/Bakemonogatari_1.png', autor: 'Nisio Isin (historia), Oh! great (dibujo)', sinopsis: 'Koyomi Araragi, un estudiante traumatizado tras sobrevivir a un vampiro, ayuda a chicas afectadas por diversas entidades sobrenaturales.', tomosDisponibles: 22 },
  { id: 5, titulo: 'Demon Slave', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Fantasy'], esDigitalOnly: true, imagen: '/images/catalogo/Demon_slave_01.jpg', autor: 'Takahiro (historia), Yohei Takemura (dibujo)', sinopsis: 'Yuki queda atrapado en una dimensión plagada de monstruos y firma un pacto de servidumbre con la capitana Kyouka a cambio de poder.', tomosDisponibles: 16 },
  { id: 7, titulo: 'Frieren', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Aventura', 'Fantasy', 'Drama'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/catalogo/Frieren_01.jpg', autor: 'Kanehito Yamada (historia), Tsukasa Abe (dibujo)', sinopsis: 'Tras derrotar al Rey Demonio, la elfa inmortal Frieren emprende un viaje para aprender a valorar los vínculos y sentimientos humanos.', tomosDisponibles: 13 },
  { id: 9, titulo: 'KonoSuba', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Comedia', 'Fantasy', 'Aventura'], esDigitalOnly: true, imagen: '/images/catalogo/Konosuba_arg_01.jpg', autor: 'Natsume Akatsuki (historia), Masahito Watari (dibujo)', sinopsis: 'Tras morir de forma ridícula, Kazuma reencarna en un mundo fantástico junto a una diosa torpe, formando un insólito grupo de aventureros.', tomosDisponibles: 19 },
  { id: 13, titulo: 'Oshi no Ko', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Seinen', generos: ['Drama', 'Psicológico'], esDigitalOnly: true, imagen: '/images/catalogo/Oshi_no_ko_arg_01.jpg', autor: 'Aka Akasaka (historia), Mengo Yokoyari (dibujo)', sinopsis: 'Un médico reencarna como hijo de su idol favorita y se adentra en la industria del espectáculo para vengar un traumático crimen.', tomosDisponibles: 16 },
  { id: 18, titulo: 'Akane-banashi', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Drama', 'Comedia'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/mangas_digitales/akane_banashi.jpg', autor: 'Yuki Suenaga (historia), Takamasa Moue (dibujo)', sinopsis: 'Akane se adentra en el tradicional arte escénico del rakugo para reivindicar a su padre y alcanzar el máximo rango de la disciplina.', tomosDisponibles: 13 },
  { id: 19, titulo: 'Dandadan', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Horror', 'Comedia'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/mangas_digitales/Dandadan.jpg', autor: 'Yukinobu Tatsu', sinopsis: 'Momo (fiel creyente en fantasmas) y Okarun (obsesionado con los alienígenas) unen fuerzas tras descubrir que ambas amenazas son reales.', tomosDisponibles: 16 },
  { id: 20, titulo: 'Hunter x Hunter', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Aventura', 'Fantasy'], esDigitalOnly: true, imagen: '/images/mangas_digitales/hunter_x_hunter.jpg', autor: 'Yoshihiro Togashi', sinopsis: 'Gon Freecss realiza el peligroso examen de Cazador para encontrar a su padre y adentrarse en un mundo repleto de misterios y desafíos.', tomosDisponibles: 38 },
  { id: 21, titulo: 'RuriDragon', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Comedia', 'Fantasy'], esDigitalOnly: true, imagen: '/images/mangas_digitales/RuriDragon.jpg', autor: 'Masaoki Shindo', sinopsis: 'Ruri, una estudiante común, descubre de golpe que su padre es un dragón y debe adaptarse a su vida escolar mientras le crecen cuernos y exhala fuego.', tomosDisponibles: 2 },
  { id: 22, titulo: 'Sakamoto Days', precio: 2300, precioDigital: PRECIO_MANGA_DIGITAL, demografia: 'Shōnen', generos: ['Acción', 'Comedia'], esDigitalOnly: true, proximamenteFisico: true, imagen: '/images/mangas_digitales/SAKAMOTO_DAYS.jpg', autor: 'Yuto Suzuki', sinopsis: 'Taro Sakamoto, el legendario asesino a sueldo ya retirado y dedicado a su familia, debe proteger su tienda de abarrotes de antiguos colegas.', tomosDisponibles: 18 },
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
        precioDigital: PRECIO_MANGA_DIGITAL,
        autor: manga.autor ?? mangaInicial?.autor,
        sinopsis: manga.sinopsis ?? mangaInicial?.sinopsis,
        tomosDisponibles: manga.tomosDisponibles ?? mangaInicial?.tomosDisponibles,
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
