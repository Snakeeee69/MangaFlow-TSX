const anioActual = new Date().getFullYear();

export const PiePagina = () => (
  <footer className="app-footer">
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <a href="#/inicio" className="footer-brand text-decoration-none">
            <img src="/images/logo/logoMangaFlow.png" alt="" />
            <span>Manga<span className="text-accent">Flow</span></span>
          </a>
          <p className="footer-description mt-3 mb-0">
            Tu próximo manga favorito está a un capítulo de distancia.
            Explora historias, descubre novedades y suma beneficios.
          </p>
        </div>

        <div className="col-6 col-lg-3">
          <h2 className="footer-heading">Explora</h2>
          <ul className="footer-links">
            <li><a href="#/inicio">Inicio</a></li>
            <li><a href="#/catalogo">Catálogo</a></li>
            <li><a href="#editoriales">Editoriales</a></li>
            <li><a href="#/puntos">Puntos y recompensas</a></li>
          </ul>
        </div>

        <div className="col-6 col-lg-4">
          <h2 className="footer-heading">Tu cuenta</h2>
          <ul className="footer-links">
            <li><a href="#/cuenta">Mi cuenta</a></li>
            <li><a href="#/biblioteca">Mi biblioteca</a></li>
            <li><a href="#/carrito">Carrito de compras</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom mt-4 pt-4">
        <span>© {anioActual} MangaFlow. Todos los derechos reservados.</span>
        <a href="#/inicio" className="footer-back-top">
          Volver al inicio <i className="fa-solid fa-arrow-up ms-1" aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
);
