import { PRECIO_MANGA_DIGITAL, slugManga, type MangaCatalogo } from '../../data/catalogo';
import { crearCarritoItem, type CarritoItem } from '../../data/carrito';

interface TarjetaCatalogoProps {
  manga: MangaCatalogo;
  esFavorito: boolean;
  alCambiarFavorito: (id: number) => void;
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

export const TarjetaCatalogo = ({
  manga,
  esFavorito,
  alCambiarFavorito,
  alAgregarAlCarrito,
}: TarjetaCatalogoProps) => (
  <article className="product-card catalog-product-card h-100 p-3 d-flex flex-column justify-content-between">
    <div className="catalog-cover-wrap position-relative">
      <a href={`#/detalle-manga/${slugManga(manga.titulo)}`} className="product-link">
        <img
          src={manga.imagen}
          alt={manga.titulo}
          className="product-cover catalog-product-cover rounded-3 mb-2"
          onError={event => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/images/logo/logoMangaFlow.png';
          }}
        />
        <div className="catalog-badges d-flex flex-column align-items-start gap-1">
          <span className={`format-badge ${manga.esDigitalOnly ? 'digital-only' : 'digital-physical'}`}>
            {manga.esDigitalOnly ? 'Solo digital' : 'Digital y físico'}
          </span>
          {manga.proximamenteFisico && (
            <span className="badge bg-danger text-white fw-bold">
              <i className="fa-solid fa-fire me-1" aria-hidden="true" />
              Próx. físico
            </span>
          )}
        </div>
      </a>
      <button
        className={`favorite-card-button ${esFavorito ? 'selected' : ''}`}
        type="button"
        aria-label={esFavorito ? `Quitar ${manga.titulo} de favoritos` : `Agregar ${manga.titulo} a favoritos`}
        aria-pressed={esFavorito}
        onClick={() => alCambiarFavorito(manga.id)}
      >
        <i className={`fa-${esFavorito ? 'solid' : 'regular'} fa-heart`} aria-hidden="true" />
      </button>
    </div>
    <a href={`#/detalle-manga/${slugManga(manga.titulo)}`} className="product-link">
      <div className="d-flex gap-1 mb-1 flex-wrap">
        <span className="badge bg-dark text-secondary catalog-tag">{manga.demografia.toUpperCase()}</span>
        {manga.generos.slice(0, 2).map(genero => (
          <span className="badge bg-secondary bg-opacity-25 text-light catalog-tag" key={genero}>{genero}</span>
        ))}
      </div>
      <h2 className="product-title mb-2">{manga.titulo}</h2>
    </a>
    <div className="d-flex justify-content-between align-items-center mt-2 gap-2">
      <span className="product-price fs-5">
        ${(manga.esDigitalOnly ? PRECIO_MANGA_DIGITAL : manga.precio).toLocaleString('es-CL')}
      </span>
      <button
        className="btn-add-cart px-3 py-2"
        type="button"
        aria-label={`Agregar ${manga.titulo} al carrito`}
        onClick={() => alAgregarAlCarrito(crearCarritoItem(
          `${manga.titulo} - Tomo 1`,
          manga.esDigitalOnly ? PRECIO_MANGA_DIGITAL : manga.precio,
          manga.demografia,
          manga.imagen,
          manga.esDigitalOnly ? 'Digital' : 'Físico',
          manga.id,
        ))}
      >
        <i className="fa-solid fa-cart-plus me-1" aria-hidden="true" />
        Agregar
      </button>
    </div>
  </article>
);
