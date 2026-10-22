import { Link } from 'react-router-dom';

const pilares = [
  {
    icono: 'fa-compass',
    titulo: 'Descubrir',
    descripcion: 'Explora obras, autores, géneros y editoriales; cada serie puede ser el comienzo de una nueva aventura.',
  },
  {
    icono: 'fa-book-open',
    titulo: 'Leer a tu manera',
    descripcion: 'El manga físico para coleccionar y el digital para disfrutar tus historias favoritas desde tu biblioteca.',
  },
  {
    icono: 'fa-sparkles',
    titulo: 'Disfrutar el camino',
    descripcion: 'Favoritos, puntos y recompensas hacen que cada visita a MangaFlow tenga algo más por descubrir.',
  },
];

export const SobreNosotros = () => (
  <main className="container about-page py-4 py-lg-5">
    <section className="about-hero p-4 p-md-5 rounded-4 mb-4 mb-lg-5">
      <div className="about-hero-content">
        <span className="about-eyebrow">
          <i className="fa-solid fa-heart me-2" aria-hidden="true" />
          Un espacio para quienes aman el manga
        </span>
        <h1 className="text-white fw-bold display-4 mt-3 mb-3">
          Las historias nos conectan.
          <span className="d-block text-accent">MangaFlow te acerca a ellas.</span>
        </h1>
        <p className="about-lead mb-4">
          Nacimos con una idea sencilla: que encontrar tu próximo manga favorito sea tan emocionante
          como leerlo. Por eso imaginamos una experiencia que reúne catálogo, lectura y comunidad en un mismo lugar.
        </p>
        <div className="d-flex flex-wrap gap-3">
          <Link to="/catalogo" className="btn-magenta text-decoration-none">
            Explorar catálogo <i className="fa-solid fa-arrow-right ms-2" aria-hidden="true" />
          </Link>
          <Link to="/editoriales" className="about-secondary-link">
            Conocer editoriales
          </Link>
        </div>
      </div>
      <div className="about-hero-mark" aria-hidden="true">
        <span className="about-orbit orbit-one" />
        <span className="about-orbit orbit-two" />
        <i className="fa-solid fa-book-open-reader" />
        <span className="about-mark-caption">LEE · DESCUBRE · FLUYE</span>
      </div>
    </section>

    <section className="about-story row g-4 align-items-stretch mb-4 mb-lg-5" aria-labelledby="about-story-title">
      <div className="col-12 col-lg-5">
        <div className="about-story-heading h-100 p-4 p-md-5 rounded-4">
          <span className="about-section-label">Nuestra historia</span>
          <h2 id="about-story-title" className="text-white fw-bold fs-2 mt-2">
            De una idea a un mundo de historias.
          </h2>
          <p className="text-secondary mb-0">
            MangaFlow comenzó como un proyecto para imaginar una tienda de manga distinta:
            más cercana a la forma en que los lectores descubren, coleccionan y disfrutan sus series.
          </p>
        </div>
      </div>
      <div className="col-12 col-lg-7">
        <div className="about-story-copy h-100 p-4 p-md-5 rounded-4">
          <p>
            Con cada etapa fue creciendo la idea. El catálogo se convirtió en una puerta para conocer
            obras y editoriales; los formatos digital y físico empezaron a convivir; y la cuenta personal
            sumó biblioteca, favoritos, compras y recompensas.
          </p>
          <p>
            Hoy MangaFlow es un prototipo en evolución, construido paso a paso con mucho cariño por el manga.
            Algunas experiencias ya se pueden recorrer y otras —como ampliar la lectura digital y explorar
            nuevas formas de intercambio— son parte del camino que queremos seguir imaginando.
          </p>
          <div className="about-note">
            <i className="fa-solid fa-lightbulb" aria-hidden="true" />
            <span>La meta no es solo vender tomos: es ayudar a cada lector a encontrar su próxima aventura.</span>
          </div>
        </div>
      </div>
    </section>

    <section className="mb-4 mb-lg-5" aria-labelledby="about-pillars-title">
      <div className="text-center mb-4">
        <span className="about-section-label">Lo que nos mueve</span>
        <h2 id="about-pillars-title" className="text-white fw-bold fs-2 mt-2">Una tienda con espíritu lector</h2>
        <p className="text-secondary mb-0">Todo gira alrededor de descubrir y disfrutar buenas historias.</p>
      </div>
      <div className="row g-3">
        {pilares.map((pilar, indice) => (
          <div className="col-12 col-md-4" key={pilar.titulo}>
            <article className="about-pillar h-100 p-4 rounded-4">
              <span className="about-pillar-number">0{indice + 1}</span>
              <i className={`fa-solid ${pilar.icono} about-pillar-icon`} aria-hidden="true" />
              <h3 className="text-white fw-bold fs-5 mt-3">{pilar.titulo}</h3>
              <p className="text-secondary mb-0">{pilar.descripcion}</p>
            </article>
          </div>
        ))}
      </div>
    </section>

    <section className="about-quote p-4 p-md-5 rounded-4 text-center">
      <i className="fa-solid fa-quote-left about-quote-icon" aria-hidden="true" />
      <h2 className="text-white fw-bold fs-3 mt-3 mb-2">Cada colección empieza con una historia.</h2>
      <p className="text-secondary mb-4">Encuentra la tuya en MangaFlow.</p>
      <Link to="/catalogo" className="btn-magenta text-decoration-none">
        Buscar mi próximo manga
      </Link>
    </section>
  </main>
);