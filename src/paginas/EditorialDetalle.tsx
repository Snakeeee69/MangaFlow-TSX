import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { editoriales } from '../data/editoriales';
import { TarjetaObraEditorial } from '../componentes/moleculas/TarjetaObraEditorial';
import type { CarritoItem } from '../data/carrito';

interface EditorialDetalleProps {
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

type FiltroCategoria = 'todos' | 'SHŌNEN' | 'SEINEN';

export const EditorialDetalle = ({ alAgregarAlCarrito }: EditorialDetalleProps) => {
  const { slug } = useParams();
  const editorial = editoriales.find(item => item.slug === slug);
  const [categoria, setCategoria] = useState<FiltroCategoria>('todos');

  const obrasFiltradas = useMemo(
    () => editorial?.catalogo.filter(obra => categoria === 'todos' || obra.categoria === categoria) ?? [],
    [categoria, editorial],
  );

  if (!editorial) return <Navigate to="/editoriales" replace />;

  return (
    <main className="container publisher-detail-page py-4 py-lg-5">
      <nav aria-label="Migas de pan" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/inicio" className="text-secondary text-decoration-none">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/editoriales" className="text-secondary text-decoration-none">Editoriales</Link></li>
          <li className="breadcrumb-item active text-white" aria-current="page">{editorial.nombre}</li>
        </ol>
      </nav>

      <section className="publisher-detail-hero card-panel p-0 overflow-hidden position-relative mb-5">
        <div className="publisher-detail-banner" />
        <div className="publisher-detail-content p-4 position-relative d-flex flex-column flex-md-row align-items-center gap-4">
          <img className="publisher-detail-logo" src={editorial.imagen} alt={`Logo de ${editorial.nombre}`} />
          <div className="text-center text-md-start">
            <span className="badge bg-secondary mb-2">{editorial.pais}</span>
            <h1 className="fw-bold text-white mb-2">{editorial.nombre}</h1>
            <p className="text-secondary mb-0 publisher-detail-description">{editorial.descripcion}</p>
          </div>
        </div>
      </section>

      <section className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <label className="visually-hidden" htmlFor="editorial-category">Filtrar obras por categoría</label>
        <select
          id="editorial-category"
          className="form-select points-select publisher-category-select"
          value={categoria}
          onChange={event => {
            const value = event.target.value;
            if (value === 'todos' || value === 'SHŌNEN' || value === 'SEINEN') {
              setCategoria(value);
            }
          }}
        >
          <option value="todos">Todos los Géneros</option>
          <option value="SHŌNEN">Shōnen</option>
          <option value="SEINEN">Seinen</option>
        </select>
        <span className="text-md-end text-secondary small fw-bold" aria-live="polite">
          {obrasFiltradas.length} {obrasFiltradas.length === 1 ? 'obra disponible' : 'obras disponibles'}
        </span>
      </section>

      <h2 className="publisher-works-heading mb-4">Obras disponibles</h2>
      {obrasFiltradas.length ? (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {obrasFiltradas.map(obra => (
            <div className="col" key={obra.titulo}>
              <TarjetaObraEditorial
                obra={obra}
                alAgregarAlCarrito={alAgregarAlCarrito}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog-empty-state text-center py-5">
          <i className="fa-regular fa-face-frown text-secondary fs-1 mb-3" aria-hidden="true" />
          <p className="text-secondary fs-5 mb-0">No hay obras de esta categoría.</p>
        </div>
      )}
    </main>
  );
};
