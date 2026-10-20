import { useEffect, useState } from 'react';

const portadaOnePiece = '/images/catalogo/One_Piece_01.jpg';
const paginasLectura = Array.from(
  { length: 6 },
  (_, indice) => `/images/caps/pagina${indice + 1}.png`,
);

interface UsuarioBiblioteca {
  nombre?: string;
  username?: string;
  email?: string;
}

const esUsuarioBiblioteca = (valor: unknown): valor is UsuarioBiblioteca => (
  typeof valor === 'object' && valor !== null && !Array.isArray(valor)
);

const obtenerUsuario = (): UsuarioBiblioteca | null => {
  for (const clave of ['mangaFlow_session', 'activeUser', 'usuarioLogueado']) {
    const datos = localStorage.getItem(clave);
    if (!datos) continue;

    try {
      const usuario: unknown = JSON.parse(datos);
      if (esUsuarioBiblioteca(usuario)) return usuario;
      console.error(`Los datos guardados en "${clave}" no tienen el formato de usuario esperado.`);
    } catch (error) {
      console.error(`No se pudieron leer los datos de usuario guardados en "${clave}".`, error);
    }
  }

  return null;
};

export const Biblioteca = () => {
  const [nombreUsuario] = useState(() => {
    const usuario = obtenerUsuario();
    return usuario?.nombre
      || usuario?.username
      || (usuario?.email ? usuario.email.split('@')[0] : 'Usuario Demostración');
  });
  const [lectorAbierto, setLectorAbierto] = useState(false);
  const [paginaActual, setPaginaActual] = useState(0);
  const [paginaNoDisponible, setPaginaNoDisponible] = useState(false);

  useEffect(() => {
    if (!lectorAbierto) return;

    const manejarTeclado = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLectorAbierto(false);
      } else if (event.key === 'ArrowLeft') {
        setPaginaActual(pagina => Math.max(0, pagina - 1));
      } else if (event.key === 'ArrowRight') {
        setPaginaActual(pagina => Math.min(paginasLectura.length - 1, pagina + 1));
      }
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', manejarTeclado);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', manejarTeclado);
    };
  }, [lectorAbierto]);

  const abrirLector = () => {
    setPaginaActual(0);
    setPaginaNoDisponible(false);
    setLectorAbierto(true);
  };

  const cambiarPagina = (cambio: number) => {
    setPaginaNoDisponible(false);
    setPaginaActual(pagina => Math.min(paginasLectura.length - 1, Math.max(0, pagina + cambio)));
  };

  return (
    <>
      <main className="container library-page py-4 py-lg-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold text-white mb-1">
              <i className="fa-solid fa-book-open text-accent me-2" aria-hidden="true" />
              Mi Biblioteca Digital
            </h1>
            <p className="text-secondary small mb-0">
              Bienvenido/a, <span className="text-white fw-semibold">{nombreUsuario}</span>.
              Aquí están tus tomos digitales disponibles para lectura.
            </p>
          </div>
          <span className="user-badge badge px-3 py-2 rounded-3">
            <i className="fa-solid fa-bookmark me-1" aria-hidden="true" />
            1 obra en colección
          </span>
        </div>

        <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" aria-label="Obras digitales">
          <div className="col">
            <article className="library-book-card card-panel p-3 text-center h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="library-cover-wrap position-relative mb-3 overflow-hidden rounded">
                  <img
                    className="library-cover shadow"
                    src={portadaOnePiece}
                    alt="Portada de One Piece, tomo 1"
                  />
                  <span className="position-absolute top-0 end-0 badge bg-success m-2 px-2 py-1">
                    Digital adquirido
                  </span>
                </div>
                <h2 className="text-white fw-bold fs-5 mb-1">One Piece - Tomo 1</h2>
                <p className="text-secondary small mb-2">Romance Dawn · Eiichiro Oda</p>
                <p className="text-secondary library-book-detail mb-3">
                  6 páginas de lectura disponibles.
                </p>
              </div>
              <button className="btn-magenta w-100 py-2" type="button" onClick={abrirLector}>
                <i className="fa-solid fa-book-open-reader me-2" aria-hidden="true" />
                Leer ahora
              </button>
            </article>
          </div>
        </section>
      </main>

      {lectorAbierto && (
        <div
          className="reader-backdrop"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setLectorAbierto(false);
          }}
        >
          <section className="reader-dialog" role="dialog" aria-modal="true" aria-labelledby="reader-title">
            <header className="reader-header">
              <div className="d-flex align-items-center gap-3">
                <i className="fa-solid fa-book-open text-accent fs-4" aria-hidden="true" />
                <div>
                  <h2 className="reader-title" id="reader-title">One Piece - Tomo 1: Romance Dawn</h2>
                  <span className="text-secondary small">Capítulo 1: El Amanecer de la Aventura</span>
                </div>
              </div>
              <button
                type="button"
                className="reader-close"
                aria-label="Cerrar lector"
                onClick={() => setLectorAbierto(false)}
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </header>

            <div className={`reader-page-wrap ${paginaNoDisponible ? 'reader-unavailable' : ''}`}>
              {paginaNoDisponible ? (
                <div className="text-center p-4" role="alert">
                  <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3" aria-hidden="true" />
                  <h3 className="text-white fs-5 fw-bold">No se pudo cargar esta página</h3>
                  <p className="text-secondary mb-0">Comprueba que el archivo de la página esté disponible.</p>
                </div>
              ) : (
                <img
                  className="reader-page-image"
                  src={paginasLectura[paginaActual]}
                  alt={`Página ${paginaActual + 1} de One Piece`}
                  onError={() => setPaginaNoDisponible(true)}
                />
              )}
            </div>

            <footer className="reader-controls">
              <button
                className="btn btn-outline-light px-3 px-md-4 fw-bold"
                type="button"
                onClick={() => cambiarPagina(-1)}
                disabled={paginaActual === 0}
              >
                <i className="fa-solid fa-chevron-left me-2" aria-hidden="true" />
                Anterior
              </button>

              <label className="reader-page-select-label">
                <span className="text-secondary small fw-semibold">Página:</span>
                <select
                  className="form-select form-select-sm points-select reader-page-select"
                  value={paginaActual + 1}
                  onChange={event => {
                    setPaginaNoDisponible(false);
                    setPaginaActual(Number(event.target.value) - 1);
                  }}
                  aria-label="Seleccionar página de lectura"
                >
                  {paginasLectura.map((_, indice) => (
                    <option key={indice + 1} value={indice + 1}>
                      {indice + 1} / {paginasLectura.length}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="btn-magenta px-3 px-md-4"
                type="button"
                onClick={() => cambiarPagina(1)}
                disabled={paginaActual === paginasLectura.length - 1}
              >
                Siguiente
                <i className="fa-solid fa-chevron-right ms-2" aria-hidden="true" />
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
};