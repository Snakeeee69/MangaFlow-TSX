import { useState } from 'react';
import { Link } from 'react-router-dom';
import { editoriales } from '../data/editoriales';
import { TarjetaObraEditorial } from '../componentes/moleculas/TarjetaObraEditorial';

interface EditorialesProps {
  alAgregarAlCarrito: (id: number) => void;
}

export const Editoriales = ({ alAgregarAlCarrito }: EditorialesProps) => {
  const [editorialSeleccionada, setEditorialSeleccionada] = useState(editoriales[0]);

  return (
    <main className="container publishers-page py-4 py-lg-5">
      <section className="mb-5">
        <h1 className="fw-bold mb-4 fs-3 text-white">
          Descubre por <span className="text-accent">Editorial</span>
        </h1>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {editoriales.map(editorial => (
            <div className="col" key={editorial.slug}>
              <article className={`editorial-card publisher-select-card ${editorialSeleccionada.slug === editorial.slug ? 'active' : ''}`}>
                <button
                  className="publisher-select-button"
                  type="button"
                  onClick={() => setEditorialSeleccionada(editorial)}
                  aria-pressed={editorialSeleccionada.slug === editorial.slug}
                >
                  <span className="editorial-img-wrapper">
                    <img src={editorial.imagen} alt="" />
                  </span>
                  <span className="fw-bold text-white mb-1 fs-6">{editorial.nombre}</span>
                  <span className="text-secondary extra-small">
                    {editorial.pais} · {editorial.obras} Obras
                  </span>
                </button>
                <Link className="publisher-detail-link" to={`/editoriales/${editorial.slug}`}>
                  Ver editorial
                </Link>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <h2 className="fw-bold fs-4 text-white mb-0">
            Obras de {editorialSeleccionada.nombre} ({editorialSeleccionada.catalogo.length})
          </h2>
          <Link className="section-more" to={`/editoriales/${editorialSeleccionada.slug}`}>
            Ver detalle <i className="fa-solid fa-chevron-right ms-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {editorialSeleccionada.catalogo.map((obra, indice) => (
            <div className="col" key={`${editorialSeleccionada.slug}-${obra.titulo}`}>
              <TarjetaObraEditorial
                obra={obra}
                alAgregarAlCarrito={() => alAgregarAlCarrito(indice + 1)}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};