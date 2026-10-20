import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  cargarMetricasAdmin,
  suscribirMetricasAdmin,
  type DiaMetricas,
  type MetricasAdmin,
} from '../data/metricasAdmin';
import {
  demografiasCatalogo,
  esMangaActivo,
  generosCatalogo,
  slugManga,
  type MangaCatalogo,
} from '../data/catalogo';

interface AdminProps {
  mangas: MangaCatalogo[];
  alGuardarCatalogo: (catalogo: MangaCatalogo[]) => void;
}

interface FormularioManga {
  titulo: string;
  autor: string;
  precio: string;
  demografia: string;
  genero: string;
  imagen: string;
  sinopsis: string;
  stock: string;
  digital: boolean;
}

const formularioInicial: FormularioManga = {
  titulo: '',
  autor: '',
  precio: '',
  demografia: 'Shōnen',
  genero: 'Acción',
  imagen: '',
  sinopsis: '',
  stock: '10',
  digital: false,
};

const formatearCLP = (valor: number) => `$${Math.round(valor).toLocaleString('es-CL')}`;

const GraficoVentas = ({ dias }: { dias: DiaMetricas[] }) => {
  const valorMaximo = Math.max(1, ...dias.map(dia => dia.ventas));

  return (
    <section className="admin-chart-panel p-3 p-md-4 rounded-4 h-100" aria-labelledby="admin-chart-sales-title">
      <div className="mb-3">
        <h2 id="admin-chart-sales-title" className="text-white fw-bold fs-5 mb-1">Ventas por día</h2>
        <p className="text-secondary small mb-0">Ingresos registrados en los últimos 7 días</p>
      </div>
      <div className="admin-chart-bars" role="img" aria-label={`Ventas por día: ${dias.map(dia => `${dia.etiqueta} ${formatearCLP(dia.ventas)}`).join(', ')}`}>
        {dias.map(dia => (
          <div className="admin-chart-day" key={dia.clave} title={`${dia.etiqueta}: ${formatearCLP(dia.ventas)}`}>
            <span className="admin-chart-value">{dia.ventas > 0 ? formatearCLP(dia.ventas) : ''}</span>
            <div className="admin-chart-track">
              <span
                className="admin-chart-bar sales"
                style={{ height: `${dia.ventas > 0 ? Math.max(5, dia.ventas / valorMaximo * 112) : 0}px` }}
              />
            </div>
            <span className="admin-chart-label">{dia.etiqueta}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const GraficoActividad = ({ dias }: { dias: DiaMetricas[] }) => {
  const valorMaximo = Math.max(1, ...dias.flatMap(dia => [dia.visitas, dia.registros, dia.compras]));
  const series = [
    { clave: 'visitas', etiqueta: 'Visitas', clase: 'visits' },
    { clave: 'registros', etiqueta: 'Registros', clase: 'registrations' },
    { clave: 'compras', etiqueta: 'Compras', clase: 'purchases' },
  ] as const;

  return (
    <section className="admin-chart-panel p-3 p-md-4 rounded-4 h-100" aria-labelledby="admin-chart-activity-title">
      <div className="mb-3">
        <h2 id="admin-chart-activity-title" className="text-white fw-bold fs-5 mb-1">Actividad diaria</h2>
        <p className="text-secondary small mb-0">Visitas, registros nuevos y compras</p>
      </div>
      <div className="admin-chart-bars" role="img" aria-label={`Actividad por día: ${dias.map(dia => `${dia.etiqueta}: ${dia.visitas} visitas, ${dia.registros} registros, ${dia.compras} compras`).join('; ')}`}>
        {dias.map(dia => (
          <div className="admin-chart-day" key={dia.clave}>
            <span className="admin-chart-value">
              {Math.max(dia.visitas, dia.registros, dia.compras) || ''}
            </span>
            <div className="admin-chart-track admin-chart-group">
              {series.map(serie => {
                const cantidad = dia[serie.clave];
                return (
                  <span
                    className={`admin-chart-bar ${serie.clase}`}
                    key={serie.clave}
                    title={`${serie.etiqueta}: ${cantidad}`}
                    style={{ height: `${cantidad > 0 ? Math.max(5, cantidad / valorMaximo * 112) : 0}px` }}
                  />
                );
              })}
            </div>
            <span className="admin-chart-label">{dia.etiqueta}</span>
          </div>
        ))}
      </div>
      <div className="admin-chart-legend">
        {series.map(serie => (
          <span key={serie.clave}>
            <i className={`admin-chart-dot ${serie.clase}`} aria-hidden="true" />
            {serie.etiqueta}
          </span>
        ))}
      </div>
    </section>
  );
};

export const Admin = ({ mangas, alGuardarCatalogo }: AdminProps) => {
  const [busqueda, setBusqueda] = useState('');
  const [verArchivados, setVerArchivados] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [metricas, setMetricas] = useState<MetricasAdmin>(cargarMetricasAdmin);

  useEffect(() => suscribirMetricasAdmin(() => setMetricas(cargarMetricasAdmin())), []);

  const mangasFiltrados = useMemo(() => mangas.filter(manga => {
    const texto = `${manga.titulo} ${manga.autor ?? ''}`.toLocaleLowerCase('es');
    const coincideBusqueda = texto.includes(busqueda.trim().toLocaleLowerCase('es'));
    return coincideBusqueda && (verArchivados || esMangaActivo(manga));
  }), [busqueda, mangas, verArchivados]);

  const visibles = mangas.filter(esMangaActivo).length;
  const archivados = mangas.length - visibles;

  const actualizarCampo = <K extends keyof FormularioManga>(campo: K, valor: FormularioManga[K]) => {
    setFormulario(actual => ({ ...actual, [campo]: valor }));
  };

  const guardarNuevoManga = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMensaje('');

    const titulo = formulario.titulo.trim();
    const precio = Number(formulario.precio);
    const stock = Number(formulario.stock);
    const rutaImagen = formulario.imagen.trim();

    if (!titulo || !Number.isFinite(precio) || precio <= 0 || !Number.isInteger(stock) || stock < 0) {
      setError('Completa un título, un precio mayor que cero y un stock entero igual o superior a cero.');
      return;
    }
    if (mangas.some(manga => slugManga(manga.titulo) === slugManga(titulo))) {
      setError('Ya existe un manga con ese título en el catálogo.');
      return;
    }

    const nuevoManga: MangaCatalogo = {
      id: Math.max(0, ...mangas.map(manga => manga.id)) + 1,
      titulo,
      precio,
      demografia: formulario.demografia,
      generos: [formulario.genero],
      esDigitalOnly: formulario.digital,
      imagen: rutaImagen || '/images/logo/logoMangaFlow.png',
      autor: formulario.autor.trim() || undefined,
      sinopsis: formulario.sinopsis.trim() || undefined,
      activo: true,
      stock,
    };

    alGuardarCatalogo([...mangas, nuevoManga]);
    setFormulario(formularioInicial);
    setMostrarFormulario(false);
    setMensaje(`${titulo} se agregó al catálogo.`);
  };

  const cambiarVisibilidad = (manga: MangaCatalogo) => {
    const activo = !esMangaActivo(manga);
    alGuardarCatalogo(mangas.map(item => item.id === manga.id ? { ...item, activo } : item));
    setMensaje(activo ? `${manga.titulo} volvió a estar visible.` : `${manga.titulo} se ocultó. Puedes restaurarlo cuando quieras.`);
  };

  const actualizarStock = (manga: MangaCatalogo, valor: string) => {
    const stock = Number(valor);
    if (!Number.isInteger(stock) || stock < 0) return;
    alGuardarCatalogo(mangas.map(item => item.id === manga.id ? { ...item, stock } : item));
  };

  return (
    <main className="container admin-page py-4 py-lg-5">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <Link to="/inicio" className="admin-back-link">
            <i className="fa-solid fa-arrow-left me-2" aria-hidden="true" />
            Volver a MangaFlow
          </Link>
          <h1 className="text-white fw-bold fs-2 mt-3 mb-1">Panel de administración</h1>
          <p className="text-secondary mb-0">Gestiona el catálogo y revisa la actividad de MangaFlow.</p>
        </div>
        <span className="admin-role-badge">
          <i className="fa-solid fa-shield-halved me-2" aria-hidden="true" />
          Administrador
        </span>
      </div>

      {mensaje && (
        <div className="alert alert-success d-flex justify-content-between align-items-center" role="status">
          {mensaje}
          <button type="button" className="btn-close btn-close-white" aria-label="Cerrar aviso" onClick={() => setMensaje('')} />
        </div>
      )}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          {error}
          <button type="button" className="btn-close btn-close-white" aria-label="Cerrar aviso" onClick={() => setError('')} />
        </div>
      )}

      <section className="row g-3 mb-4" aria-label="Resumen del catálogo">
        {[
          { etiqueta: 'Títulos visibles', valor: visibles, icono: 'fa-book-open' },
          { etiqueta: 'Archivados', valor: archivados, icono: 'fa-box-archive' },
          { etiqueta: 'Solo digital', valor: mangas.filter(manga => esMangaActivo(manga) && manga.esDigitalOnly).length, icono: 'fa-tablet-screen-button' },
        ].map(dato => (
          <div className="col-12 col-sm-4" key={dato.etiqueta}>
            <article className="admin-stat-card p-3 rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small">{dato.etiqueta}</span>
                <i className={`fa-solid ${dato.icono} text-accent`} aria-hidden="true" />
              </div>
              <p className="text-white fs-3 fw-bold mb-0 mt-2">{dato.valor}</p>
            </article>
          </div>
        ))}
      </section>

      <section className="mb-4" aria-label="Resumen de actividad y ventas">
        <h2 className="text-white fw-bold fs-5 mb-3">Resumen de la tienda</h2>
        <div className="row g-3 mb-3">
          {[
            { etiqueta: 'Visitas (7 días)', valor: metricas.dias.reduce((total, dia) => total + dia.visitas, 0), icono: 'fa-eye' },
            { etiqueta: 'Registros', valor: metricas.registros, icono: 'fa-user-plus' },
            { etiqueta: 'Compras', valor: metricas.compras, icono: 'fa-bag-shopping' },
            { etiqueta: 'Ventas acumuladas', valor: formatearCLP(metricas.ventas), icono: 'fa-chart-line' },
            { etiqueta: 'Puntos utilizados', valor: metricas.puntosUsados.toLocaleString('es-CL'), icono: 'fa-star' },
          ].map(dato => (
            <div className="col-6 col-md-4 col-xl" key={dato.etiqueta}>
              <article className="admin-stat-card p-3 rounded-3 h-100">
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <span className="text-secondary small">{dato.etiqueta}</span>
                  <i className={`fa-solid ${dato.icono} text-accent`} aria-hidden="true" />
                </div>
                <p className="text-white fs-4 fw-bold mb-0 mt-2">{dato.valor}</p>
              </article>
            </div>
          ))}
        </div>
        <div className="row g-3">
          <div className="col-12 col-xl-5"><GraficoVentas dias={metricas.dias} /></div>
          <div className="col-12 col-xl-7"><GraficoActividad dias={metricas.dias} /></div>
        </div>
      </section>

      <section className="admin-catalog-panel p-3 p-md-4 rounded-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <h2 className="text-white fw-bold fs-5 mb-1">Catálogo de mangas</h2>
            <p className="text-secondary small mb-0">Agrega títulos, ajusta stock o archiva temporalmente.</p>
          </div>
          <button
            className="btn-magenta"
            type="button"
            onClick={() => {
              setMostrarFormulario(abierto => !abierto);
              setError('');
            }}
            aria-expanded={mostrarFormulario}
          >
            <i className={`fa-solid ${mostrarFormulario ? 'fa-xmark' : 'fa-plus'} me-2`} aria-hidden="true" />
            {mostrarFormulario ? 'Cerrar formulario' : 'Agregar manga'}
          </button>
        </div>

        {mostrarFormulario && (
          <form className="admin-add-form p-3 p-md-4 rounded-3 mb-4" onSubmit={guardarNuevoManga}>
            <h3 className="text-white fw-semibold fs-6 mb-3">Nuevo manga</h3>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-secondary small" htmlFor="admin-titulo">Título *</label>
                <input id="admin-titulo" className="form-control admin-input" value={formulario.titulo} onChange={event => actualizarCampo('titulo', event.target.value)} required maxLength={100} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary small" htmlFor="admin-autor">Autor</label>
                <input id="admin-autor" className="form-control admin-input" value={formulario.autor} onChange={event => actualizarCampo('autor', event.target.value)} maxLength={100} />
              </div>
              <div className="col-sm-6 col-md-3">
                <label className="form-label text-secondary small" htmlFor="admin-precio">Precio (CLP) *</label>
                <input id="admin-precio" className="form-control admin-input" type="number" min="1" step="1" value={formulario.precio} onChange={event => actualizarCampo('precio', event.target.value)} required />
              </div>
              <div className="col-sm-6 col-md-3">
                <label className="form-label text-secondary small" htmlFor="admin-stock">Stock *</label>
                <input id="admin-stock" className="form-control admin-input" type="number" min="0" step="1" value={formulario.stock} onChange={event => actualizarCampo('stock', event.target.value)} required />
              </div>
              <div className="col-sm-6 col-md-3">
                <label className="form-label text-secondary small" htmlFor="admin-demografia">Demografía</label>
                <select id="admin-demografia" className="form-select admin-input" value={formulario.demografia} onChange={event => actualizarCampo('demografia', event.target.value)}>
                  {demografiasCatalogo.filter(opcion => opcion !== 'Todas').map(opcion => <option key={opcion}>{opcion}</option>)}
                </select>
              </div>
              <div className="col-sm-6 col-md-3">
                <label className="form-label text-secondary small" htmlFor="admin-genero">Género</label>
                <select id="admin-genero" className="form-select admin-input" value={formulario.genero} onChange={event => actualizarCampo('genero', event.target.value)}>
                  {generosCatalogo.filter(opcion => opcion !== 'Todos').map(opcion => <option key={opcion}>{opcion}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label text-secondary small" htmlFor="admin-imagen">Ruta de portada (opcional)</label>
                <input id="admin-imagen" className="form-control admin-input" value={formulario.imagen} onChange={event => actualizarCampo('imagen', event.target.value)} placeholder="/images/catalogo/portada.jpg" />
              </div>
              <div className="col-12">
                <label className="form-label text-secondary small" htmlFor="admin-sinopsis">Sinopsis (opcional)</label>
                <textarea id="admin-sinopsis" className="form-control admin-input" rows={3} value={formulario.sinopsis} onChange={event => actualizarCampo('sinopsis', event.target.value)} maxLength={1000} />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input id="admin-digital" className="form-check-input" type="checkbox" checked={formulario.digital} onChange={event => actualizarCampo('digital', event.target.checked)} />
                  <label className="form-check-label text-white small" htmlFor="admin-digital">Disponible solo en formato digital</label>
                </div>
              </div>
              <div className="col-12 text-end">
                <button className="btn-magenta" type="submit">Guardar en catálogo</button>
              </div>
            </div>
          </form>
        )}

        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
          <label className="admin-search flex-grow-1">
            <i className="fa-solid fa-magnifying-glass text-secondary" aria-hidden="true" />
            <span className="visually-hidden">Buscar manga o autor</span>
            <input value={busqueda} onChange={event => setBusqueda(event.target.value)} placeholder="Buscar por título o autor" />
          </label>
          <label className="form-check form-switch mb-0">
            <input className="form-check-input" type="checkbox" checked={verArchivados} onChange={event => setVerArchivados(event.target.checked)} />
            <span className="form-check-label text-secondary small">Mostrar archivados ({archivados})</span>
          </label>
        </div>

        <div className="d-flex flex-column gap-2">
          {mangasFiltrados.map(manga => {
            const activo = esMangaActivo(manga);
            return (
              <article className={`admin-manga-row p-3 rounded-3 ${activo ? '' : 'is-archived'}`} key={manga.id}>
                <img className="admin-manga-cover rounded-2" src={manga.imagen} alt="" onError={event => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/images/logo/logoMangaFlow.png';
                }} />
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <h3 className="text-white fw-semibold fs-6 mb-0 text-truncate">{manga.titulo}</h3>
                    <span className={`admin-status ${activo ? 'active' : 'archived'}`}>{activo ? 'Visible' : 'Archivado'}</span>
                    {manga.esDigitalOnly && <span className="badge bg-info text-dark">Digital</span>}
                  </div>
                  <p className="text-secondary small mb-1">{manga.autor || 'Autor no especificado'} · {manga.demografia} · {manga.generos.join(', ')}</p>
                  <p className="text-secondary small mb-0">${manga.precio.toLocaleString('es-CL')} · {manga.stock ?? 'Stock no indicado'}</p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  <label className="admin-stock-control">
                    <span className="visually-hidden">Stock de {manga.titulo}</span>
                    <input type="number" min="0" step="1" value={manga.stock ?? 0} onChange={event => actualizarStock(manga, event.target.value)} disabled={!activo} />
                  </label>
                  <button
                    className={`btn btn-sm ${activo ? 'btn-outline-warning' : 'btn-outline-success'}`}
                    type="button"
                    onClick={() => cambiarVisibilidad(manga)}
                  >
                    <i className={`fa-solid ${activo ? 'fa-box-archive' : 'fa-rotate-left'} me-1`} aria-hidden="true" />
                    {activo ? 'Archivar' : 'Restaurar'}
                  </button>
                </div>
              </article>
            );
          })}
          {mangasFiltrados.length === 0 && (
            <p className="text-secondary text-center py-4 mb-0">No hay mangas que coincidan con la búsqueda.</p>
          )}
        </div>
      </section>
    </main>
  );
};
