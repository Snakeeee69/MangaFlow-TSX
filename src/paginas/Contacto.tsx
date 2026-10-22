import { Link } from 'react-router-dom';

const urlMapa = 'https://www.google.com/maps/search/?api=1&query=Eurocentro%2C+Ahumada+85%2C+Santiago%2C+Chile';

export const Contacto = () => (
  <main className="container contact-page py-4 py-lg-5">
    <section className="contact-hero p-4 p-md-5 rounded-4 mb-4">
      <span className="about-section-label">Estamos cerca</span>
      <h1 className="text-white fw-bold display-5 mt-2 mb-3">Ven a encontrarnos.</h1>
      <p className="text-secondary mb-0">
        ¿Vienes por una recompensa o por tu próximo manga? Te esperamos en el corazón de Santiago.
      </p>
    </section>

    <section className="row g-4 align-items-stretch" aria-label="Ubicación y retiro presencial">
      <div className="col-12 col-lg-7">
        <article className="contact-location-card h-100 p-4 p-md-5 rounded-4">
          <span className="contact-icon"><i className="fa-solid fa-location-dot" aria-hidden="true" /></span>
          <p className="about-section-label mt-4 mb-2">Nuestra ubicación</p>
          <h2 className="text-white fw-bold fs-3 mb-3">Eurocentro</h2>
          <address className="contact-address mb-4">
            Ahumada 85<br />
            Planta -1, Local 12<br />
            Santiago, Región Metropolitana
          </address>
          <a className="btn-magenta d-inline-flex align-items-center text-decoration-none" href={urlMapa} target="_blank" rel="noreferrer">
            <i className="fa-solid fa-map-location-dot me-2" aria-hidden="true" />
            Ver ubicación en el mapa
            <i className="fa-solid fa-arrow-up-right-from-square ms-2 small" aria-hidden="true" />
          </a>
        </article>
      </div>
      <div className="col-12 col-lg-5">
        <aside className="contact-pickup-card h-100 p-4 p-md-5 rounded-4">
          <i className="fa-solid fa-box-open contact-pickup-icon" aria-hidden="true" />
          <h2 className="text-white fw-bold fs-4 mt-3">Retiros presenciales</h2>
          <p className="text-secondary">
            Las recompensas del catálogo de puntos y los pedidos físicos se retiran presencialmente en nuestra ubicación.
          </p>
          <p className="contact-pickup-note mb-4">
            <i className="fa-solid fa-circle-info me-2" aria-hidden="true" />
            Recuerda revisar los detalles de tu compra y recompensa antes de venir.
          </p>
          <Link to="/puntos" className="contact-text-link">
            Ver recompensas <i className="fa-solid fa-arrow-right ms-1" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </section>
  </main>
);
