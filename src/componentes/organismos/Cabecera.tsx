import { useState } from 'react';

const enlaces = [
  { texto: 'Inicio', href: '#/inicio', pagina: 'inicio' },
  { texto: 'Catálogo', href: '#/catalogo', pagina: 'catalogo' },
  { texto: 'Puntos y recompensas', href: '#/puntos', pagina: 'puntos' },
  { texto: 'Editoriales', href: '#editoriales' },
  { texto: 'Mi Biblioteca', href: '#/biblioteca' },
  { texto: 'Próximamente', href: '#/proximamente', nuevo: true },
  { texto: 'Mi cuenta', href: '#/cuenta' },
];

interface CabeceraProps {
  cantidadCarrito: number;
  paginaActiva: 'inicio' | 'catalogo' | 'puntos';
}

export const Cabecera = ({ cantidadCarrito, paginaActiva }: CabeceraProps) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <header className="app-header text-center py-4">
        <div className="container">
          <a href="#/inicio" className="text-decoration-none">
            <span className="brand-logo d-inline-flex align-items-center justify-content-center mb-2">
              <img src="/images/logo/logoMangaFlow.png" alt="Logo MangaFlow" />
            </span>
            <h1 className="brand-title fs-2 fw-bold text-white mb-1">
              Manga<span>Flow</span>
            </h1>
          </a>
          <p className="text-secondary small mb-0">
            Compra mangas físicos y digitales, acumula puntos y accede a beneficios exclusivos.
          </p>
        </div>
      </header>

      <nav className="app-navbar px-3 px-lg-4 py-3" aria-label="Navegación principal">
        <div className="container-fluid d-flex flex-wrap justify-content-center">
          <button
            type="button"
            className="mobile-menu-button"
            aria-expanded={menuAbierto}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuAbierto(abierto => !abierto)}
          >
            <i className={`fa-solid ${menuAbierto ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
          </button>

          <div className={`nav-collapse ${menuAbierto ? 'open' : ''}`}>
            <ul className="navbar-nav nav-links align-items-center gap-1 gap-lg-2 me-lg-4">
              {enlaces.map(enlace => (
                <li className="nav-item position-relative" key={enlace.texto}>
                  <a
                    className={`nav-link-mf ${enlace.pagina === paginaActiva ? 'active' : ''}`}
                    href={enlace.href}
                    onClick={() => setMenuAbierto(false)}
                  >
                    {enlace.texto}
                    {enlace.nuevo && <span className="badge ms-1 bg-magenta">NEW</span>}
                  </a>
                </li>
              ))}
            </ul>

            <div className="header-actions d-flex align-items-center gap-2">
              <span className="user-badge badge px-3 py-2 rounded-3">Invitado</span>
              <a className="header-icon-button" href="#/login" aria-label="Iniciar sesión" title="Iniciar sesión">
                <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
              </a>
              <a className="header-icon-button position-relative" href="#/carrito" aria-label="Carrito" title="Carrito">
                <i className="fa-solid fa-cart-shopping" aria-hidden="true" />
                <span className="cart-count">{cantidadCarrito}</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
