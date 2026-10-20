import { useEffect, useState } from 'react';
import { destacados } from '../../data/mangaMock';
import { esMangaActivo, slugManga, type MangaCatalogo } from '../../data/catalogo';

interface CarruselDestacadosProps {
  mangas: MangaCatalogo[];
}

export const CarruselDestacados = ({ mangas }: CarruselDestacadosProps) => {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const destacadosDisponibles = destacados.filter(destacado => mangas.some(manga => (
    esMangaActivo(manga) && slugManga(manga.titulo) === slugManga(destacado.titulo)
  )));
  const destacado = destacadosDisponibles[indiceActivo % Math.max(1, destacadosDisponibles.length)];

  useEffect(() => {
    if (destacadosDisponibles.length < 2) return undefined;
    const intervalo = window.setInterval(() => {
      setIndiceActivo(indice => (indice + 1) % destacadosDisponibles.length);
    }, 6000);

    return () => window.clearInterval(intervalo);
  }, [destacadosDisponibles.length]);

  const cambiarDestacado = (direccion: number) => {
    if (destacadosDisponibles.length === 0) return;
    setIndiceActivo(indice => (indice + direccion + destacadosDisponibles.length) % destacadosDisponibles.length);
  };

  if (!destacado) {
    return <p className="text-secondary text-center py-5">No hay mangas destacados disponibles.</p>;
  }

  return (
    <section className="hero-panel p-4 p-lg-5 mb-5" aria-label="Mangas destacados">
      <button
        type="button"
        className="carousel-arrow carousel-arrow-prev"
        aria-label="Manga destacado anterior"
        onClick={() => cambiarDestacado(-1)}
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-next"
        aria-label="Siguiente manga destacado"
        onClick={() => cambiarDestacado(1)}
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>

      <div className="row align-items-center g-4 px-md-4">
        <div className="col-md-10">
          <div className="row align-items-center g-4">
            <div className="col-md-4 text-center">
              <a href={`#/detalle-manga/${slugManga(destacado.titulo)}`}>
                <img className="hero-cover rounded-3" src={destacado.imagen} alt={destacado.titulo} />
              </a>
            </div>
            <div className="col-md-8 text-white hero-copy" aria-live="polite">
              <span className="hero-category text-uppercase">{destacado.categoria}</span>
              <h2 className="display-6 fw-bold mt-1 mb-3">{destacado.titulo}</h2>
              <p className="hero-description small mb-4">{destacado.descripcion}</p>
              <div className="hero-buttons d-flex flex-wrap gap-3">
                <a className="btn-magenta" href={`#/detalle-manga/${slugManga(destacado.titulo)}`}>Ver manga</a>
                <a className="btn btn-outline-light px-4 py-2" href="#/catalogo">Ver catálogo</a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-2 hero-thumbnails d-none d-md-flex flex-column gap-2 align-items-center ps-3">
          {destacadosDisponibles.map((item, indice) => (
            <button
              key={item.id}
              type="button"
              className={`hero-thumb ${indice === indiceActivo ? 'active' : ''}`}
              aria-label={`Mostrar ${item.titulo}`}
              aria-pressed={indice === indiceActivo}
              onClick={() => setIndiceActivo(indice)}
            >
              <img src={item.imagen} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="hero-indicators" aria-label="Elegir manga destacado">
        {destacadosDisponibles.map((item, indice) => (
          <button
            key={item.id}
            type="button"
            className={`hero-indicator ${indice === indiceActivo ? 'active' : ''}`}
            aria-label={`Mostrar ${item.titulo}`}
            aria-pressed={indice === indiceActivo}
            onClick={() => setIndiceActivo(indice)}
          />
        ))}
      </div>
    </section>
  );
};
