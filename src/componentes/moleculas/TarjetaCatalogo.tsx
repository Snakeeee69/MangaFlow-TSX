import type { MangaCatalogo } from '../../data/catalogo';

interface TarjetaCatalogoProps {
  manga: MangaCatalogo;
  alAgregarAlCarrito: (id: number) => void;
}

export const TarjetaCatalogo = ({ manga, alAgregarAlCarrito }: TarjetaCatalogoProps) => (
  <article className="product-card catalog-product-card h-100 p-3 d-flex flex-column justify-content-between">
    <a href={`#/detalle-manga/${manga.id}`} className="product-link">
      <div className="catalog-cover-wrap position-relative">
        <img
          src={manga.imagen}
          alt={manga.titulo}
          className="product-cover catalog-product-cover rounded-3 mb-2"
          onError={event => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/images/logo/logoMangaFlow.png';
          }}
        />
        {manga.esDigitalOnly && (
          <div className="catalog-badges d-flex flex-column align-items-end gap-1">
            <span className="badge bg-info text-dark fw-bold">Solo Digital</span>
            {manga.proximamenteFisico && (
              <span className="badge bg-danger text-white fw-bold">
                <i className="fa-solid fa-fire me-1" aria-hidden="true" />
                Próx. Físico
              </span>
            )}
            <span className="badge bg-warning text-dark fw-bold">
              <i className="fa-solid fa-ticket me-1" aria-hidden="true" />
              Cupón $2.300 p/ Físico
            </span>
          </div>
        )}
      </div>
      <div className="d-flex gap-1 mb-1 flex-wrap">
        <span className="badge bg-dark text-secondary catalog-tag">{manga.demografia.toUpperCase()}</span>
        {manga.generos.slice(0, 2).map(genero => (
          <span className="badge bg-secondary bg-opacity-25 text-light catalog-tag" key={genero}>{genero}</span>
        ))}
      </div>
      <h2 className="product-title mb-2">{manga.titulo}</h2>
    </a>
    <div className="d-flex justify-content-between align-items-center mt-2 gap-2">
      <span className="product-price fs-5">${manga.precio.toLocaleString('es-CL')}</span>
      <button
        className="btn-add-cart px-3 py-2"
        type="button"
        aria-label={`Agregar ${manga.titulo} al carrito`}
        onClick={() => alAgregarAlCarrito(manga.id)}
      >
        <i className="fa-solid fa-cart-plus me-1" aria-hidden="true" />
        Agregar
      </button>
    </div>
  </article>
);
