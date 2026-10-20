import { Link } from 'react-router-dom';
import { AccesoRequerido } from '../componentes/moleculas/AccesoRequerido';
import { formatearCLP } from '../data/carrito';
import { slugManga, type MangaCatalogo } from '../data/catalogo';
import { puntosDeSesion, type SesionUsuario } from '../data/sesion';

interface CuentaProps {
  sesion: SesionUsuario | null;
  mangas: MangaCatalogo[];
  alActualizarSesion: (sesion: SesionUsuario) => void;
}

export const Cuenta = ({ sesion, mangas, alActualizarSesion }: CuentaProps) => {
  if (!sesion || sesion.isGuest) {
    return (
      <AccesoRequerido
        titulo="Tu cuenta MangaFlow"
        descripcion="Inicia sesión para ver tus puntos, lista de deseos y compras."
      />
    );
  }

  const compras = sesion.compras ?? [];
  const mangasDeseados = (sesion.wishlist ?? [])
    .map(id => mangas.find(manga => manga.id === id))
    .filter((manga): manga is MangaCatalogo => Boolean(manga));

  const quitarDeDeseos = (id: number) => {
    alActualizarSesion({
      ...sesion,
      wishlist: (sesion.wishlist ?? []).filter(mangaId => mangaId !== id),
    });
  };

  return (
    <main className="container account-page py-4 py-lg-5">
      <section className="account-profile p-4 p-md-5 rounded-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
          <div className="d-flex align-items-center gap-3">
            <span className="account-avatar" aria-hidden="true">
              {(sesion.nombre || sesion.email || 'U').charAt(0).toLocaleUpperCase('es')}
            </span>
            <div>
              <p className="text-accent small fw-bold text-uppercase mb-1">Mi cuenta</p>
              <h1 className="text-white fw-bold fs-3 mb-1">{sesion.nombre || 'Lector MangaFlow'}</h1>
              <p className="text-secondary small mb-0">{sesion.email}</p>
            </div>
          </div>
          <div className="account-points-box text-md-end">
            <span className="text-secondary small d-block">Saldo de puntos</span>
            <span className="account-points fw-bold fs-2">
              <i className="fa-solid fa-star me-2" aria-hidden="true" />
              {puntosDeSesion(sesion).toLocaleString('es-CL')}
            </span>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="text-white fw-bold fs-4 mb-1">Mi lista de deseos</h2>
            <p className="text-secondary small mb-0">Mangas que guardaste para revisar después.</p>
          </div>
          <span className="account-count">{mangasDeseados.length}</span>
        </div>
        {mangasDeseados.length === 0 ? (
          <div className="account-empty p-4 rounded-3 text-center">
            <i className="fa-regular fa-heart text-accent fs-3 mb-2" aria-hidden="true" />
            <p className="text-secondary small mb-2">Todavía no agregaste mangas a tu lista.</p>
            <Link to="/catalogo" className="text-accent small fw-semibold">Explorar catálogo</Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
            {mangasDeseados.map(manga => (
              <div className="col" key={manga.id}>
                <article className="account-wishlist-card p-3 rounded-3 d-flex gap-3 h-100">
                  <img className="account-wishlist-cover rounded-2" src={manga.imagen} alt={manga.titulo} />
                  <div className="flex-grow-1 min-w-0">
                    <h3 className="text-white fw-semibold fs-6 text-truncate mb-1">{manga.titulo}</h3>
                    <p className="text-secondary small mb-2">{formatearCLP(manga.precio)}</p>
                    <div className="d-flex flex-wrap gap-2">
                      <Link className="text-accent small text-decoration-none" to={`/detalle-manga/${slugManga(manga.titulo)}`}>Ver manga</Link>
                      <button className="account-remove-link" type="button" onClick={() => quitarDeDeseos(manga.id)}>Quitar</button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h2 className="text-white fw-bold fs-4 mb-1">Historial de compras</h2>
            <p className="text-secondary small mb-0">Revisa tus pedidos registrados en esta demostración.</p>
          </div>
          <span className="account-count">{compras.length}</span>
        </div>
        {compras.length === 0 ? (
          <div className="account-empty p-4 rounded-3 text-center">
            <i className="fa-solid fa-receipt text-accent fs-3 mb-2" aria-hidden="true" />
            <p className="text-secondary small mb-2">Aún no tienes compras registradas.</p>
            <Link to="/catalogo" className="text-accent small fw-semibold">Ir al catálogo</Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {compras.map(compra => (
              <article className="account-order-card p-3 p-md-4 rounded-3" key={compra.id}>
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                  <div>
                    <h3 className="text-white fw-semibold fs-6 mb-1">Compra {compra.folio}</h3>
                    <span className="text-secondary small">
                      {new Date(compra.fecha).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                  <span className="account-order-total fw-bold">{formatearCLP(compra.total)}</span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {compra.items.map(item => (
                    <div className="d-flex justify-content-between gap-3 text-secondary small" key={`${compra.id}-${item.id}`}>
                      <span>{item.titulo} · {item.formato} × {item.quantity}</span>
                      <span className="text-white flex-shrink-0">{formatearCLP(item.precio * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <details className="account-receipt-details mt-3">
                  <summary>Ver boleta electrónica</summary>
                  <div className="account-receipt-content mt-3 p-3 rounded-3">
                    <div className="d-flex justify-content-between gap-3 mb-3">
                      <strong className="text-white">MangaFlow SpA</strong>
                      <span className="text-secondary small">{compra.folio}</span>
                    </div>
                    <div className="d-flex flex-column gap-2 small">
                      {compra.subtotalNeto !== undefined && (
                        <div className="d-flex justify-content-between text-secondary">
                          <span>Subtotal neto</span><span className="text-white">{formatearCLP(compra.subtotalNeto)}</span>
                        </div>
                      )}
                      {compra.iva !== undefined && (
                        <div className="d-flex justify-content-between text-secondary">
                          <span>IVA (19%)</span><span className="text-white">{formatearCLP(compra.iva)}</span>
                        </div>
                      )}
                      {(compra.descuentoPuntos ?? 0) > 0 && (
                        <div className="d-flex justify-content-between text-secondary">
                          <span>Descuento por puntos</span><span className="text-success">−{formatearCLP(compra.descuentoPuntos ?? 0)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between fw-bold border-top border-secondary border-opacity-25 pt-2">
                        <span className="text-white">Total pagado</span><span className="account-order-total">{formatearCLP(compra.total)}</span>
                      </div>
                      <div className="d-flex justify-content-between text-secondary">
                        <span>Medio de pago</span><span className="text-white">{compra.medioPago ?? 'No registrado'} (simulado)</span>
                      </div>
                      {compra.direccionEntrega && (
                        <div className="d-flex justify-content-between gap-3 text-secondary">
                          <span>Entrega</span><span className="text-white text-end">{compra.direccionEntrega}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
