import { editoriales } from '../../data/mangaMock';

export const SeccionEditoriales = () => (
  <section id="editoriales" className="mb-5">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="section-heading fw-bold text-white m-0 fs-4">
        <span className="section-heading-mark" aria-hidden="true" />
        Editoriales
      </h2>
      <a className="section-more" href="#/editoriales">
        Ver todas <i className="fa-solid fa-chevron-right ms-1" aria-hidden="true" />
      </a>
    </div>

    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
      {editoriales.map(editorial => (
        <div className="col" key={editorial.slug}>
          <article className="editorial-card d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img className="editorial-logo" src={editorial.imagen} alt="" />
                <div>
                  <h3 className="text-white fw-bold mb-0 fs-6">{editorial.nombre}</h3>
                  <span className="text-secondary small">{editorial.pais}</span>
                </div>
              </div>
              <p className="text-secondary small mb-3">{editorial.descripcion}</p>
            </div>
            <a className="editorial-link" href={`#/editoriales/${editorial.slug}`}>
              {editorial.obras} obras disponibles <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      ))}
    </div>
  </section>
);
