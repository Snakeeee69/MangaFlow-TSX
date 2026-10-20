import type { ObraEditorial } from '../../data/editoriales';

interface TarjetaObraEditorialProps {
  obra: ObraEditorial;
  alAgregarAlCarrito: () => void;
}

export const TarjetaObraEditorial = ({ obra, alAgregarAlCarrito }: TarjetaObraEditorialProps) => (
  <article className="manga-card-editorial h-100 p-2">
    <div className="manga-img-container rounded-3 mb-3">
      {obra.etiqueta && <span className="tag-nuevo">{obra.etiqueta}</span>}
      <img
        src={obra.imagen}
        alt={obra.titulo}
        onError={event => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = '/images/logo/logoMangaFlow.png';
        }}
      />
      <div className="tag-category-overlay">
        <strong>{obra.titulo}</strong>
        <br />
        <span className="editorial-overlay-category">{obra.categoria}</span>
      </div>
    </div>
    <div className="px-2 d-flex flex-column flex-grow-1">
      <h3 className="text-white fw-bold mb-1 text-truncate fs-6" title={obra.titulo}>{obra.titulo}</h3>
      <p className="text-secondary mb-2 editorial-genres">{obra.generos}</p>
      <p className="text-secondary mb-3 editorial-description">{obra.descripcion}</p>
      <div className="d-flex justify-content-between align-items-end mt-auto gap-2">
        <div>
          <div className="text-white fw-bold">${obra.precioFisico.toLocaleString('es-CL')}</div>
          <span className="text-secondary editorial-digital-price">
            Digital: ${obra.precioDigital.toLocaleString('es-CL')}
          </span>
        </div>
        <button
          className="btn btn-sm text-secondary p-1 hover-purple"
          type="button"
          onClick={alAgregarAlCarrito}
          aria-label={`Agregar ${obra.titulo} al carrito`}
          title="Agregar al carrito"
        >
          <i className="fa-solid fa-cart-shopping editorial-cart-icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  </article>
);
