import { PRECIO_MANGA_DIGITAL } from './catalogo';

export interface ObraEditorial {
  titulo: string;
  generos: string;
  descripcion: string;
  precioFisico: number;
  precioDigital: number;
  etiqueta?: string;
  categoria: 'SHŌNEN' | 'SEINEN';
  imagen: string;
}

export interface EditorialDetalle {
  slug: string;
  nombre: string;
  nombreCorto: string;
  pais: string;
  obras: string;
  imagen: string;
  descripcion: string;
  catalogo: ObraEditorial[];
}

export const editoriales: EditorialDetalle[] = [
  {
    slug: 'ivrea',
    nombre: 'Ivrea Argentina',
    nombreCorto: 'Ivrea',
    pais: 'Japón / Argentina',
    obras: '150+',
    imagen: '/images/editoriales/ivrea_argentina.png',
    descripcion: 'Editorial de origen argentino con una amplia selección de manga japonés para lectores de toda Latinoamérica.',
    catalogo: [
      { titulo: 'One Piece', generos: 'Aventura · Acción · Shōnen', descripcion: 'Monkey D. Luffy sueña con convertirse en el Rey de los Piratas. Junto a su tripulación, se embarca en una aventura por los mares.', precioFisico: 9990, precioDigital: PRECIO_MANGA_DIGITAL, etiqueta: 'NUEVO', categoria: 'SHŌNEN', imagen: '/images/catalogo/One_Piece_01.jpg' },
      { titulo: 'Demon Slayer', generos: 'Acción · Sobrenatural · Shōnen', descripcion: 'Tanjiro Kamado se convierte en cazador de demonios para vengar a su familia y salvar a su hermana Nezuko.', precioFisico: 9990, precioDigital: PRECIO_MANGA_DIGITAL, etiqueta: 'NUEVO', categoria: 'SHŌNEN', imagen: '/images/catalogo/Demon_Slayer_01.jpg' },
      { titulo: 'Spy x Family', generos: 'Comedia · Espionaje · Shōnen', descripcion: 'El espía Loid Forger debe crear una familia falsa para completar una misión. Sin saberlo, cada integrante oculta un secreto.', precioFisico: 9990, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SHŌNEN', imagen: '/images/catalogo/Spy_x_family_1.png' },
      { titulo: 'Yofukashi no Uta', generos: 'Romance · Sobrenatural · Shōnen', descripcion: 'Kou Yamori sale a caminar de noche incapaz de dormir y conoce a Nazuna, una misteriosa chica nocturna.', precioFisico: 9990, precioDigital: PRECIO_MANGA_DIGITAL, etiqueta: 'NUEVO', categoria: 'SHŌNEN', imagen: '/images/catalogo/yofukashi_no_uta.jpg' },
      { titulo: 'Kaguya-sama - Love Is War', generos: 'Romance · Comedia · Seinen', descripcion: 'Kaguya Shinomiya y Miyuki Shirogane son los estudiantes más brillantes de su escuela. Ambos están enamorados, pero ninguno quiere confesarlo.', precioFisico: 9990, precioDigital: PRECIO_MANGA_DIGITAL, etiqueta: 'NUEVO', categoria: 'SEINEN', imagen: '/images/catalogo/Kaguya_sama_arg_01.jpg' },
    ],
  },
  {
    slug: 'norma',
    nombre: 'Norma Editorial',
    nombreCorto: 'Norma',
    pais: 'España',
    obras: '120+',
    imagen: '/images/editoriales/norma_editorial.png',
    descripcion: 'Editorial española con un catálogo diverso de manga y cómic para todo tipo de lectores.',
    catalogo: [
      { titulo: 'Attack on Titan', generos: 'Acción · Drama · Shōnen', descripcion: 'La humanidad vive aterrorizada dentro de muros gigantescos que la protegen de los titanes que dominan el exterior.', precioFisico: 10990, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SHŌNEN', imagen: '/images/catalogo/ataque_a_los_titanes_1.jpg' },
      { titulo: 'KonoSuba', generos: 'Comedia · Fantasy · Shōnen', descripcion: 'Kazuma Satou muere en un accidente ridículo y es enviado a un mundo de fantasía con la diosa Aqua.', precioFisico: 9490, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SHŌNEN', imagen: '/images/catalogo/Konosuba_arg_01.jpg' },
      { titulo: 'Mato Seihei no Slave', generos: 'Acción · Fantasy · Seinen', descripcion: 'Yuuki Wakura es arrastrado al mundo de Mato, una dimensión peligrosa llena de amenazas.', precioFisico: 10490, precioDigital: PRECIO_MANGA_DIGITAL, etiqueta: 'NUEVO', categoria: 'SEINEN', imagen: '/images/catalogo/Demon_slave_01.jpg' },
    ],
  },
  {
    slug: 'panini',
    nombre: 'Panini Manga',
    nombreCorto: 'Panini',
    pais: 'México / Chile',
    obras: '200+',
    imagen: '/images/editoriales/panini_manga.jpg',
    descripcion: 'Editorial multinacional con una extensa presencia y variedad de manga en Latinoamérica.',
    catalogo: [
      { titulo: 'Naruto', generos: 'Acción · Aventura · Shōnen', descripcion: 'Naruto Uzumaki, un joven ninja con el zorro de nueve colas sellado en su interior, lucha por alcanzar su sueño.', precioFisico: 8990, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SHŌNEN', imagen: '/images/catalogo/naruto_tomo_1.png' },
      { titulo: 'Jujutsu Kaisen', generos: 'Acción · Sobrenatural · Shōnen', descripcion: 'Yuji Itadori ingiere un dedo maldito para salvar a sus compañeros y queda ligado al poderoso Ryomen Sukuna.', precioFisico: 10490, precioDigital: PRECIO_MANGA_DIGITAL, etiqueta: 'NUEVO', categoria: 'SHŌNEN', imagen: '/images/catalogo/xJujutsu_kaisen_arg_01.jpg' },
      { titulo: 'Atom: The Beginning', generos: 'Ciencia Ficción · Aventura · Shōnen', descripcion: 'Precuela del clásico Astro Boy de Osamu Tezuka. Los jóvenes científicos Tenma y Ochanomizu desarrollan un robot extraordinario.', precioFisico: 9990, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SHŌNEN', imagen: '/images/catalogo/Atom_the_beginning_1.png' },
      { titulo: 'Berserk', generos: 'Dark Fantasy · Acción · Seinen', descripcion: 'Guts, el guerrero de la espada negra, recorre un mundo medieval oscuro en busca de venganza.', precioFisico: 14990, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SEINEN', imagen: '/images/catalogo/Berserk.png' },
      { titulo: 'Las Quintillizas', generos: 'Romance · Comedia · Shōnen', descripcion: 'Fuutarou Uesugi es contratado como tutor de cinco quintillizas idénticas, cada una con una personalidad única.', precioFisico: 9990, precioDigital: PRECIO_MANGA_DIGITAL, etiqueta: 'NUEVO', categoria: 'SHŌNEN', imagen: '/images/catalogo/Las_quintillizas_1.png' },
      { titulo: 'Bakemonogatari', generos: 'Sobrenatural · Misterio · Seinen', descripcion: 'Koyomi Araragi, un estudiante que sobrevivió al ataque de un vampiro, se ve envuelto en misteriosos fenómenos sobrenaturales.', precioFisico: 10990, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SEINEN', imagen: '/images/catalogo/Bakemonogatari_1.png' },
    ],
  },
  {
    slug: 'planeta',
    nombre: 'Planeta Cómic',
    nombreCorto: 'Planeta',
    pais: 'España',
    obras: '80+',
    imagen: '/images/editoriales/planeta_comics.png',
    descripcion: 'Sello editorial español especializado en cómics, manga y grandes historias ilustradas.',
    catalogo: [
      { titulo: 'Vinland Saga', generos: 'Histórico · Acción · Seinen', descripcion: 'Thorfinn, hijo de un legendario guerrero vikingo, busca venganza y un lugar donde vivir en paz.', precioFisico: 12990, precioDigital: PRECIO_MANGA_DIGITAL, categoria: 'SEINEN', imagen: '/images/catalogo/vinland_saga.png' },
    ],
  },
];
