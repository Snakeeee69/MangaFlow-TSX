import { useMemo, useState } from 'react';
import {
  demografiasCatalogo,
  generosCatalogo,
  esMangaActivo,
  type MangaCatalogo,
} from '../data/catalogo';
import { TarjetaCatalogo } from '../componentes/moleculas/TarjetaCatalogo';
import type { CarritoItem } from '../data/carrito';

type FormatoCatalogo = 'todos' | 'digitales';

interface CatalogoProps {
  mangas: MangaCatalogo[];
  listaDeseos: number[];
  alCambiarFavorito: (id: number) => void;
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

export const Catalogo = ({
  mangas,
  listaDeseos,
  alCambiarFavorito,
  alAgregarAlCarrito,
}: CatalogoProps) => {
  const [formato, setFormato] = useState<FormatoCatalogo>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [demografia, setDemografia] = useState('Todas');
  const [genero, setGenero] = useState('Todos');

  const mangasFiltrados = useMemo(() => mangas.filter(manga => {
    if (!esMangaActivo(manga)) return false;
    const coincideFormato = formato === 'todos' || manga.esDigitalOnly;
    const coincideBusqueda = manga.titulo.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es'));
    const coincideDemografia = demografia === 'Todas' || manga.demografia === demografia;
    const coincideGenero = genero === 'Todos' || manga.generos.includes(genero);

    return coincideFormato && coincideBusqueda && coincideDemografia && coincideGenero;
  }), [busqueda, demografia, formato, genero, mangas]);

  const hayFiltrosActivos = Boolean(busqueda.trim())
    || formato !== 'todos'
    || demografia !== 'Todas'
    || genero !== 'Todos';

  const limpiarFiltros = () => {
    setFormato('todos');
    setBusqueda('');
    setDemografia('Todas');
    setGenero('Todos');
  };

  return (
    <main className="container catalog-page py-4 py-lg-5">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="text-white fw-bold fs-2 mb-1">Catálogo</h1>
          <p className="text-secondary small mb-0">
            Explora nuestra colección de mangas físicos y digitales
          </p>
        </div>

        <div className="catalog-format-tabs d-flex gap-2 p-1 rounded-3" role="group" aria-label="Filtrar por formato">
          <button
            type="button"
            className={`btn btn-sm px-3 py-2 rounded-2 fw-semibold ${formato === 'todos' ? 'catalog-tab-active' : 'catalog-tab-inactive'}`}
            aria-pressed={formato === 'todos'}
            onClick={() => setFormato('todos')}
          >
            <i className="fa-solid fa-book-open me-1" aria-hidden="true" />
            Todos
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 py-2 rounded-2 fw-semibold ${formato === 'digitales' ? 'catalog-tab-active' : 'catalog-tab-inactive'}`}
            aria-pressed={formato === 'digitales'}
            onClick={() => setFormato('digitales')}
          >
            <i className="fa-solid fa-tablet-screen-button me-1" aria-hidden="true" />
            Mangas Digitales
          </button>
        </div>
      </div>

      <section className="catalog-filter-panel card-panel p-3 p-md-4 mb-4" aria-label="Filtros del catálogo">
        <label className="catalog-search-wrap position-relative d-block mb-3">
          <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" aria-hidden="true" />
          <span className="visually-hidden">Buscar manga por título</span>
          <input
            className="form-control catalog-search-input ps-5 py-2"
            type="search"
            value={busqueda}
            onChange={event => setBusqueda(event.target.value)}
            placeholder="Buscar manga por título..."
          />
        </label>

        <div className="d-flex align-items-start gap-2 flex-wrap mb-3">
          <i className="fa-solid fa-filter text-secondary me-1 mt-1" aria-hidden="true" />
          <span className="catalog-filter-label me-2">Demografía:</span>
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrar por demografía">
            {demografiasCatalogo.map(opcion => (
              <button
                key={opcion}
                type="button"
                className={`catalog-filter-chip ${demografia === opcion ? 'selected' : ''}`}
                aria-pressed={demografia === opcion}
                onClick={() => setDemografia(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-start gap-2 flex-wrap">
          <span className="catalog-filter-label catalog-genre-label me-2">Género:</span>
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrar por género">
            {generosCatalogo.map(opcion => (
              <button
                key={opcion}
                type="button"
                className={`catalog-filter-chip ${genero === opcion ? 'selected' : ''}`}
                aria-pressed={genero === opcion}
                onClick={() => setGenero(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <span className="text-secondary small" aria-live="polite">
          {mangasFiltrados.length} {mangasFiltrados.length === 1 ? 'obra encontrada' : 'obras encontradas'}
        </span>
        {hayFiltrosActivos && (
          <button className="catalog-clear-button" type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        )}
      </div>

      {mangasFiltrados.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {mangasFiltrados.map(manga => (
            <div className="col" key={manga.id}>
              <TarjetaCatalogo
                manga={manga}
                esFavorito={listaDeseos.includes(manga.id)}
                alCambiarFavorito={alCambiarFavorito}
                alAgregarAlCarrito={alAgregarAlCarrito}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog-empty-state text-center py-5">
          <i className="fa-regular fa-face-frown text-secondary fs-1 mb-3" aria-hidden="true" />
          <p className="text-secondary fs-5 mb-0">No se encontraron mangas con esos filtros</p>
        </div>
      )}
    </main>
  );
};