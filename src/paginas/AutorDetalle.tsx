import { Link, useParams } from 'react-router-dom';
import { esMangaActivo, slugManga, type MangaCatalogo } from '../data/catalogo';

interface AutorDetalleProps {
  mangas: MangaCatalogo[];
}

export const AutorDetalle = ({ mangas }: AutorDetalleProps) => {
  const { slug } = useParams();
  const obras = mangas.filter(manga => (
    esMangaActivo(manga)
    && manga.autor
    && slugManga(manga.autor) === slug
  ));
  const autor = obras[0]?.autor;

  if (!autor) {
    return (
      <main className="container detail-not-found text-center py-5">
        <i className="fa-solid fa-user text-accent display-4 mb-3" aria-hidden="true" />
        <h1 className="text-white fw-bold fs-3">Autor no encontrado</h1>
        <p className="text-secondary">Aún no hay obras registradas para este autor.</p>
        <Link to="/catalogo" className="btn-magenta d-inline-block">Explorar catálogo</Link>
      </main>
    );
  }

  const generos = [...new Set(obras.flatMap(manga => manga.generos))];

  return (
    <main className="container author-detail-page py-4 py-lg-5">
      <Link to="/catalogo" className="detail-back-link mb-4 d-inline-flex align-items-center">
        <i className="fa-solid fa-arrow-left me-2" aria-hidden="true" />
        Volver al catálogo
      </Link>
      <section className="author-profile p-4 p-md-5 rounded-4 mb-4">
        <span className="author-avatar" aria-hidden="true">{autor.charAt(0).toLocaleUpperCase('es')}</span>
        <div>
          <p className="text-accent small text-uppercase fw-bold mb-1">Autor / Mangaka</p>
          <h1 className="text-white fw-bold fs-2 mb-2">{autor}</h1>
          <p className="text-secondary mb-3">Obras disponibles en MangaFlow: {obras.length}</p>
          <div className="d-flex flex-wrap gap-2">
            {generos.map(genero => <span className="detail-tag" key={genero}>{genero}</span>)}
          </div>
        </div>
      </section>

      <h2 className="text-white fw-bold fs-4 mb-3">Obras de {autor}</h2>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {obras.map(manga => (
          <div className="col" key={manga.id}>
            <Link className="detail-related-card d-block p-2 rounded-3 text-decoration-none h-100" to={`/detalle-manga/${slugManga(manga.titulo)}`}>
              <img className="detail-related-image rounded-2 mb-2" src={manga.imagen} alt={manga.titulo} />
              <span className="text-white fw-semibold small d-block">{manga.titulo}</span>
              <span className="text-secondary small">${manga.precio.toLocaleString('es-CL')}</span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};
