import { type MangaItem } from '../../data/mangaMock';
import { crearCarritoItem, type CarritoItem } from '../../data/carrito';
import { PRECIO_MANGA_DIGITAL, slugManga } from '../../data/catalogo';
import { BotonCarrito } from '../atomos/BotonCarritos';
import type { MangaCatalogo } from '../../data/catalogo';

interface TarjetaMangaProps {
  manga: MangaItem;
  esNovedad?: boolean;
  detalle?: MangaCatalogo;
  esFavorito: boolean;
  alCambiarFavorito: (id: number) => void;
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

export const TarjetaManga = ({
  manga,
  esNovedad = false,
  detalle,
  esFavorito,
  alCambiarFavorito,
  alAgregarAlCarrito,
}: TarjetaMangaProps) => {
  const alturaImagen = esNovedad ? '220px' : '260px';
  const tituloBase = manga.titulo.replace(/\s+#\d+$/, '');

  return (
    <div className={`product-card h-100 d-flex flex-column justify-content-between ${esNovedad ? 'p-2' : 'p-3'}`}>
      <div className="home-cover-wrap position-relative">
        <a href={`#/detalle-manga/${slugManga(manga.titulo)}`} className="product-link">
          <img
            src={manga.imagen}
            alt={manga.titulo}
            className="product-cover rounded-3 mb-2"
            style={{ height: alturaImagen }}
            onError={event => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/logo/logoMangaFlow.png';
            }}
          />
        </a>
        <div className="home-card-badges">
          <span className={`format-badge ${detalle?.esDigitalOnly ? 'digital-only' : 'digital-physical'}`}>
            {detalle?.esDigitalOnly ? 'Solo digital' : 'Digital y físico'}
          </span>
          {detalle?.proximamenteFisico && <span className="badge bg-danger">Próx. físico</span>}
        </div>
        <button
          className={`favorite-card-button ${esFavorito ? 'selected' : ''}`}
          type="button"
          aria-label={esFavorito ? `Quitar ${tituloBase} de favoritos` : `Agregar ${tituloBase} a favoritos`}
          aria-pressed={esFavorito}
          onClick={() => detalle && alCambiarFavorito(detalle.id)}
          disabled={!detalle}
        >
          <i className={`fa-${esFavorito ? 'solid' : 'regular'} fa-heart`} aria-hidden="true" />
        </button>
      </div>
      <a href={`#/detalle-manga/${slugManga(manga.titulo)}`} className="product-link">
        <span className="product-demography">
          {manga.demografia}
        </span>
        <h3 className="product-title mb-1">{manga.titulo}</h3>
      </a>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className={`product-price ${esNovedad ? 'small' : 'fs-5'}`}>
          ${(detalle?.esDigitalOnly ? PRECIO_MANGA_DIGITAL : manga.precio).toLocaleString('es-CL')}
        </span>
        <BotonCarrito 
          esChico={esNovedad} 
          onClick={() => alAgregarAlCarrito(crearCarritoItem(
            `${detalle?.titulo ?? tituloBase} - Tomo 1`,
            detalle?.esDigitalOnly ? PRECIO_MANGA_DIGITAL : manga.precio,
            manga.demografia,
            manga.imagen,
            detalle?.esDigitalOnly ? 'Digital' : 'Físico',
            detalle?.id,
          ))}
        />
      </div>
    </div>
  );
};
