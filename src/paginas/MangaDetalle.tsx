import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { crearCarritoItem, type CarritoItem } from '../data/carrito';
import { esMangaActivo, slugManga, type MangaCatalogo } from '../data/catalogo';
import type { SesionUsuario } from '../data/sesion';

interface MangaDetalleProps {
  mangas: MangaCatalogo[];
  sesion: SesionUsuario | null;
  alActualizarSesion: (sesion: SesionUsuario) => void;
  alAgregarAlCarrito: (item: CarritoItem) => void;
}

export const MangaDetalle = ({
  mangas,
  sesion,
  alActualizarSesion,
  alAgregarAlCarrito,
}: MangaDetalleProps) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const manga = mangas.find(item => item.id.toString() === slug || slugManga(item.titulo) === slug);
  const [seleccionFormato, setSeleccionFormato] = useState<{
    slug?: string;
    formato: 'Digital' | 'Físico';
  }>(() => ({
    slug,
    formato: manga?.esDigitalOnly ? 'Digital' : 'Físico',
  }));
  const formatoSeleccionado = seleccionFormato.slug === slug
    ? seleccionFormato.formato
    : manga?.esDigitalOnly ? 'Digital' : 'Físico';

  if (!manga || !esMangaActivo(manga)) {
    return (
      <main className="container detail-not-found text-center py-5">
        <i className="fa-solid fa-book-open text-accent display-4 mb-3" aria-hidden="true" />
        <h1 className="text-white fw-bold fs-3">Manga no disponible</h1>
        <p className="text-secondary">No encontramos ese título en el catálogo.</p>
        <Link to="/catalogo" className="btn-magenta d-inline-block">Volver al catálogo</Link>
      </main>
    );
  }

  const wishlist = sesion?.wishlist ?? [];
  const enDeseos = wishlist.includes(manga.id);
  const precioSeleccionado = formatoSeleccionado === 'Digital'
    ? manga.precioDigital ?? manga.precio
    : manga.precio;
  const tieneLectorDisponible = manga.titulo.toLocaleLowerCase('es').includes('one piece');
  const relacionados = mangas.filter(item => (
    item.id !== manga.id
    && esMangaActivo(item)
    && item.generos.some(genero => manga.generos.includes(genero))
  )).slice(0, 4);

  const cambiarDeseos = () => {
    if (!sesion || sesion.isGuest) {
      navigate('/login', { state: { desde: `/detalle-manga/${slugManga(manga.titulo)}` } });
      return;
    }

    const nuevosDeseos = enDeseos
      ? wishlist.filter(id => id !== manga.id)
      : [...wishlist, manga.id];
    alActualizarSesion({ ...sesion, wishlist: nuevosDeseos });
  };

  const agregar = () => {
    alAgregarAlCarrito(crearCarritoItem(
      manga.titulo,
      precioSeleccionado,
      manga.demografia,
      manga.imagen,
      formatoSeleccionado,
      manga.id,
    ));
  };

  return (
    <main className="container manga-detail-page py-4 py-lg-5">
      <Link to="/catalogo" className="detail-back-link mb-4 d-inline-flex align-items-center">
        <i className="fa-solid fa-arrow-left me-2" aria-hidden="true" />
        Volver al catálogo
      </Link>

      <section className="row g-4 g-lg-5 align-items-start">
        <div className="col-12 col-md-5 col-lg-4">
          <div className="manga-detail-cover-wrap">
            <img
              className="manga-detail-cover"
              src={manga.imagen}
              alt={`Portada de ${manga.titulo}`}
              onError={event => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = '/images/logo/logoMangaFlow.png';
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-8">
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
            <div>
              <p className="text-accent text-uppercase small fw-bold mb-2">Ficha del manga</p>
              <h1 className="text-white fw-bold display-6 mb-3">{manga.titulo}</h1>
              <div className="d-flex flex-wrap gap-2">
                <span className="detail-tag accent">{manga.demografia}</span>
                {manga.generos.map(genero => <span className="detail-tag" key={genero}>{genero}</span>)}
                <span className={`detail-tag ${manga.esDigitalOnly ? 'digital' : 'physical'}`}>
                  {manga.esDigitalOnly ? 'Solo digital' : 'Digital y físico'}
                </span>
                {manga.proximamenteFisico && (
                  <span className="detail-tag upcoming-physical">
                    <i className="fa-solid fa-fire me-1" aria-hidden="true" />
                    Próx. físico
                  </span>
                )}
              </div>
            </div>
            <button
              className={`detail-wishlist-button ${enDeseos ? 'selected' : ''}`}
              type="button"
              onClick={cambiarDeseos}
              aria-pressed={enDeseos}
            >
              <i className={`fa-${enDeseos ? 'solid' : 'regular'} fa-heart me-2`} aria-hidden="true" />
              {enDeseos ? 'En mi lista de deseos' : 'Agregar a deseos'}
            </button>
          </div>

          <p className="manga-detail-synopsis">
            {manga.sinopsis || 'La sinopsis de este título estará disponible próximamente.'}
          </p>

          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <div className="detail-info-card">
                <span className="text-secondary small d-block">Autor</span>
                {manga.autor
                  ? <Link className="text-white fw-semibold text-decoration-none" to={`/autor/${slugManga(manga.autor)}`}>{manga.autor}</Link>
                  : <span className="text-white fw-semibold">Por confirmar</span>}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="detail-info-card">
                <span className="text-secondary small d-block">Disponibilidad</span>
                <span className="text-white fw-semibold">
                  {formatoSeleccionado === 'Digital' ? 'Edición digital' : 'Edición física'}
                  {manga.proximamenteFisico && ' · Edición física próximamente'}
                </span>
              </div>
            </div>
          </div>

          {!manga.esDigitalOnly && (
            <fieldset className="detail-format-options mb-4">
              <legend className="text-secondary small fw-semibold">Elige el formato de compra</legend>
              <div className="d-flex flex-wrap gap-3">
                {(['Físico', 'Digital'] as const).map(formato => (
                  <label className={`detail-format-option ${formatoSeleccionado === formato ? 'selected' : ''}`} key={formato}>
                    <input
                      type="radio"
                      name="formato-compra"
                      value={formato}
                      checked={formatoSeleccionado === formato}
                      onChange={() => setSeleccionFormato({ slug, formato })}
                    />
                    <span>{formato === 'Digital' ? 'Edición digital' : 'Edición física'}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {formatoSeleccionado === 'Digital' && (
            <p className="detail-digital-note mb-3">
              <i className="fa-solid fa-book-open-reader me-2" aria-hidden="true" />
              {tieneLectorDisponible
                ? 'Al comprar la edición digital de One Piece, aparecerá en Mi Biblioteca para leer sus páginas.'
                : 'La edición digital aparecerá en Mi Biblioteca. El lector estará disponible cuando se cargue su contenido.'}
            </p>
          )}

          <section className="detail-purchase-card p-4 rounded-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <span className="text-secondary small d-block">Precio</span>
                <span className="text-white fw-bold fs-3">${precioSeleccionado.toLocaleString('es-CL')}</span>
                {typeof manga.stock === 'number' && (
                  <span className="text-secondary small d-block">
                    {formatoSeleccionado === 'Digital'
                      ? 'Disponible para lectura digital'
                      : manga.stock > 0 ? `${manga.stock} disponibles` : 'Sin stock'}
                  </span>
                )}
              </div>
              <button
                className="btn-magenta"
                type="button"
                onClick={agregar}
                disabled={formatoSeleccionado === 'Físico' && typeof manga.stock === 'number' && manga.stock === 0}
              >
                <i className="fa-solid fa-cart-plus me-2" aria-hidden="true" />
                Agregar al carrito
              </button>
            </div>
          </section>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="mt-5 pt-4">
          <h2 className="text-white fw-bold fs-4 mb-3">También te puede interesar</h2>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {relacionados.map(relacionado => (
              <div className="col" key={relacionado.id}>
                <Link to={`/detalle-manga/${slugManga(relacionado.titulo)}`} className="detail-related-card d-block p-2 rounded-3 text-decoration-none h-100">
                  <img className="detail-related-image rounded-2 mb-2" src={relacionado.imagen} alt={relacionado.titulo} />
                  <span className="text-white fw-semibold small d-block">{relacionado.titulo}</span>
                  <span className="text-secondary small">${relacionado.precio.toLocaleString('es-CL')}</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
