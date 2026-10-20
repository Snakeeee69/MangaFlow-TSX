import { type MangaItem } from '../../data/mangaMock';
import type { CarritoItem } from '../../data/carrito';
import { slugManga, type MangaCatalogo } from '../../data/catalogo';
import { TarjetaManga } from '../moleculas/TarjetasManga';

interface SeccionGridProps {
  tituloSeccion: string;
  mangas: MangaItem[];
  catalogo: MangaCatalogo[];
  listaDeseos: number[];
  alCambiarFavorito: (id: number) => void;
  esNovedad?: boolean;
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

export const SeccionGrid = ({
  tituloSeccion,
  mangas,
  catalogo,
  listaDeseos,
  alCambiarFavorito,
  esNovedad = false,
  alAgregarAlCarrito,
}: SeccionGridProps) => {
  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-heading text-white fw-bold m-0 fs-4">
          <span className="section-heading-mark" aria-hidden="true" />
          {tituloSeccion}
        </h2>
        <a href="#/catalogo" className="section-more">
          Ver todo <i className="fa-solid fa-chevron-right ms-1" aria-hidden="true" />
        </a>
      </div>
      <div className={`row g-3 ${esNovedad ? 'row-cols-2 row-cols-md-3 row-cols-lg-6' : 'row-cols-1 row-cols-sm-2 row-cols-md-4'}`}>
        {mangas.map(manga => {
          const detalle = catalogo.find(item => slugManga(item.titulo) === slugManga(manga.titulo));
          return (
          <div className="col" key={manga.id}>
            <TarjetaManga 
              manga={manga} 
              detalle={detalle}
              esFavorito={Boolean(detalle && listaDeseos.includes(detalle.id))}
              alCambiarFavorito={alCambiarFavorito}
              esNovedad={esNovedad} 
              alAgregarAlCarrito={alAgregarAlCarrito}
            />
          </div>
          );
        })}
      </div>
    </section>
  );
};
