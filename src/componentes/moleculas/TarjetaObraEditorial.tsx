import type { ObraEditorial } from '../../data/editoriales';
import { crearCarritoItem, type CarritoItem } from '../../data/carrito';
import { slugManga, mangasCatalogo } from '../../data/catalogo';
import { Link } from 'react-router-dom';

interface TarjetaObraEditorialProps {
  obra: ObraEditorial;
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

export const TarjetaObraEditorial = ({ obra, alAgregarAlCarrito }: TarjetaObraEditorialProps) => {
  const manga = mangasCatalogo.find(item => item.imagen === obra.imagen)
    ?? mangasCatalogo.find(item => slugManga(item.titulo) === slugManga(obra.titulo));
  const enlaceDetalle = `/detalle-manga/${slugManga(manga?.titulo ?? obra.titulo)}`;

  return (
    <article className="manga-card-editorial h-100 p-2">
      <Link to={enlaceDetalle} className="d-block text-decoration-none" aria-label={`Ver manga ${obra.titulo}`}>
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
        <h3 className="text-white fw-bold mb-1 text-truncate fs-6" title={obra.titulo}>{obra.titulo}</h3>
      </Link>
      <div className="px-2 d-flex flex-column flex-grow-1">
        <p className="text-secondary mb-2 editorial-genres">{obra.generos}</p>
        <p className="text-secondary mb-3 editorial-description">{obra.descripcion}</p>
        <div className="d-flex justify-content-between align-items-end mt-auto gap-2">
          <div>
            <div className="text-white fw-bold">${obra.precioFisico.toLocaleString('es-CL')}</div>
            <span className="text-secondary editorial-digital-price">
              Digital: ${obra.precioDigital.toLocaleString('es-CL')}
            </span>
            <span className="text-secondary extra-small d-block">
              Incluye cupón de $2.300 para manga físico
            </span>
          </div>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm text-secondary p-1 hover-purple"
              type="button"
              onClick={() => alAgregarAlCarrito(crearCarritoItem(
                `${manga?.titulo ?? obra.titulo} - Tomo 1`,
                obra.precioFisico,
                obra.categoria,
                obra.imagen,
                'Físico',
                manga?.id,
              ))}
              aria-label={`Agregar ${obra.titulo} tomo 1 físico al carrito`}
              title="Agregar edición física"
            >
              <i className="fa-solid fa-book editorial-cart-icon" aria-hidden="true" />
            </button>
            <button
              className="btn btn-sm text-secondary p-1 hover-purple"
              type="button"
              onClick={() => alAgregarAlCarrito(crearCarritoItem(
                `${manga?.titulo ?? obra.titulo} - Tomo 1`,
                obra.precioDigital,
                obra.categoria,
                obra.imagen,
                'Digital',
                manga?.id,
              ))}
              aria-label={`Agregar ${obra.titulo} tomo 1 digital al carrito`}
              title="Agregar edición digital"
            >
              <i className="fa-solid fa-tablet-screen-button editorial-cart-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
