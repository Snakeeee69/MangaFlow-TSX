import { useState, type FormEvent } from 'react';
import { estadosCertificacion, recompensas, seriesIntercambio, type Recompensa } from '../data/recompensas';
import { TarjetaRecompensa } from '../componentes/moleculas/TarjetaRecompensa';

type Usuario = Record<string, unknown> & {
  isGuest?: boolean;
  puntos?: number;
};

const esUsuario = (valor: unknown): valor is Usuario => (
  typeof valor === 'object' && valor !== null && !Array.isArray(valor)
);

interface EntregaCertificada {
  id: number;
  titulo: string;
  tomo: number;
  estado: string;
  color: string;
  puntos: number;
}

const clavesUsuario = ['mangaFlow_session', 'activeUser', 'usuarioLogueado'];

const leerUsuarioActual = (): Usuario | null => {
  for (const clave of clavesUsuario) {
    const valor = localStorage.getItem(clave);
    if (!valor) continue;

    try {
      const usuario: unknown = JSON.parse(valor);
      if (esUsuario(usuario)) {
        return usuario;
      }
      console.error(`Los datos guardados en "${clave}" no tienen el formato de usuario esperado.`);
    } catch (error) {
      console.error(`No se pudieron leer los datos de usuario guardados en "${clave}".`, error);
    }
  }

  return null;
};

const obtenerPuntos = (usuario: Usuario | null) => (
  typeof usuario?.puntos === 'number' && Number.isFinite(usuario.puntos)
    ? usuario.puntos
    : 0
);

export const Puntos = () => {
  const [cuenta, setCuenta] = useState(() => {
    const usuario = leerUsuarioActual();
    return { usuario, puntosUsuario: obtenerPuntos(usuario) };
  });
  const { usuario, puntosUsuario } = cuenta;
  const [pestana, setPestana] = useState<'recompensas' | 'intercambio'>('recompensas');
  const [serieId, setSerieId] = useState('');
  const [tomo, setTomo] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('bueno');
  const [historial, setHistorial] = useState<EntregaCertificada[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'danger'>('success');

  const usuarioAutenticado = Boolean(usuario && !usuario.isGuest);
  const serieSeleccionada = seriesIntercambio.find(serie => serie.id === serieId);

  const guardarPuntos = (nuevosPuntos: number) => {
    if (!usuario || usuario.isGuest) {
      setTipoMensaje('danger');
      setMensaje('Debes iniciar sesión para acumular y canjear puntos.');
      return false;
    }

    const usuarioActualizado: Usuario = { ...usuario, puntos: nuevosPuntos };
    clavesUsuario.forEach(clave => {
      localStorage.setItem(clave, JSON.stringify(usuarioActualizado));
    });
    setCuenta({ usuario: usuarioActualizado, puntosUsuario: nuevosPuntos });
    return true;
  };

  const canjearRecompensa = (recompensa: Recompensa) => {
    if (!usuarioAutenticado) {
      setTipoMensaje('danger');
      setMensaje('Debes iniciar sesión para acumular y canjear puntos.');
      return;
    }

    if (puntosUsuario < recompensa.costoPuntos || recompensa.stock <= 0) return;
    if (guardarPuntos(puntosUsuario - recompensa.costoPuntos)) {
      setTipoMensaje('success');
      setMensaje(`¡Canjeaste: ${recompensa.nombre}! Se agregará a tu cuenta.`);
    }
  };

  const procesarCertificacion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!usuarioAutenticado) {
      setTipoMensaje('danger');
      setMensaje('Debes iniciar sesión para entregar mangas y reclamar puntos.');
      return;
    }

    const manga = seriesIntercambio.find(item => item.id === serieId);
    const estado = estadosCertificacion.find(item => item.value === estadoSeleccionado);
    const tomoNumero = Number(tomo);
    if (!manga || !manga.tomos.includes(tomoNumero) || !estado) {
      setTipoMensaje('danger');
      setMensaje('Selecciona una serie, un tomo y un estado de conservación válidos.');
      return;
    }

    if (!guardarPuntos(puntosUsuario + estado.puntos)) return;

    setHistorial(items => [{
      id: Date.now(),
      titulo: manga.titulo,
      tomo: tomoNumero,
      estado: estado.label,
      color: estado.color,
      puntos: estado.puntos,
    }, ...items]);
    setSerieId('');
    setTomo('');
    setEstadoSeleccionado('bueno');
    setTipoMensaje('success');
    setMensaje(`¡Entrega procesada! Se acreditaron ${estado.puntos} puntos.`);
    event.currentTarget.reset();
  };

  return (
    <main className="container points-page py-4 py-lg-5">
      {mensaje && (
        <div className={`alert alert-${tipoMensaje} points-alert`} role="status">
          <i className={`fa-solid ${tipoMensaje === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} me-2`} aria-hidden="true" />
          {mensaje}
          <button
            className="btn-close btn-close-white"
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setMensaje('')}
          />
        </div>
      )}

      <section className="points-summary card-panel p-4 p-md-5 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h1 className="text-white fw-bold fs-2 mb-1">Puntos y Recompensas</h1>
          <p className="text-secondary small mb-0">Acumula puntos y canjéalos por premios exclusivos</p>
        </div>
        <div className="text-md-end">
          <div className="d-flex align-items-center justify-content-md-end gap-2 mb-1">
            <i className="fa-solid fa-star fs-3 reward-points" aria-hidden="true" />
            <span className="text-white fw-bold points-total">{puntosUsuario.toLocaleString('es-CL')}</span>
          </div>
          <p className="text-secondary small mb-0">puntos disponibles</p>
        </div>
      </section>

      <div className="points-tabs d-flex flex-wrap gap-2 p-1 rounded-3 mb-4" role="tablist" aria-label="Secciones de puntos">
        <button
          className={`btn btn-sm px-4 py-2 rounded-2 fw-semibold ${pestana === 'recompensas' ? 'catalog-tab-active' : 'catalog-tab-inactive'}`}
          type="button"
          role="tab"
          aria-selected={pestana === 'recompensas'}
          onClick={() => setPestana('recompensas')}
        >
          Catálogo de recompensas
        </button>
        <button
          className={`btn btn-sm px-4 py-2 rounded-2 fw-semibold ${pestana === 'intercambio' ? 'catalog-tab-active' : 'catalog-tab-inactive'}`}
          type="button"
          role="tab"
          aria-selected={pestana === 'intercambio'}
          onClick={() => setPestana('intercambio')}
        >
          Entregar manga usado
        </button>
      </div>

      {pestana === 'recompensas' ? (
        <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4" aria-label="Catálogo de recompensas">
          {recompensas.map(recompensa => (
            <div className="col" key={recompensa.id}>
              <TarjetaRecompensa
                recompensa={recompensa}
                puntosUsuario={puntosUsuario}
                usuarioAutenticado={usuarioAutenticado}
                alCanjear={canjearRecompensa}
              />
            </div>
          ))}
        </section>
      ) : (
        <section className="row g-4" aria-label="Entregar manga usado">
          <div className="col-lg-5">
            <div className="card-panel p-4 h-100">
              <h2 className="text-white fw-bold mb-3 fs-5">Certificar Manga Usado</h2>
              <form onSubmit={procesarCertificacion}>
                <div className="mb-3">
                  <label className="form-label text-secondary small" htmlFor="select-manga">Selecciona el manga</label>
                  <select
                    id="select-manga"
                    className="form-select points-select"
                    value={serieId}
                    onChange={event => {
                      setSerieId(event.target.value);
                      setTomo('');
                    }}
                    required
                  >
                    <option value="">Selecciona una serie</option>
                    {seriesIntercambio.map(serie => (
                      <option key={serie.id} value={serie.id}>{serie.titulo}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small" htmlFor="select-tomo">Selecciona el tomo</label>
                  <select
                    id="select-tomo"
                    className="form-select points-select"
                    value={tomo}
                    onChange={event => setTomo(event.target.value)}
                    disabled={!serieSeleccionada}
                    required
                  >
                    <option value="">{serieSeleccionada ? 'Selecciona el tomo' : 'Selecciona primero una serie'}</option>
                    {serieSeleccionada?.tomos.map(numero => (
                      <option key={numero} value={numero}>Tomo {numero}</option>
                    ))}
                  </select>
                </div>

                <fieldset className="mb-3">
                  <legend className="form-label text-secondary small mb-2">Estado de conservación</legend>
                  <div className="d-flex flex-column gap-2">
                    {estadosCertificacion.map(estado => (
                      <label className="points-condition-option d-flex align-items-center justify-content-between p-2 rounded-3" key={estado.value}>
                        <span className="d-flex align-items-center gap-2">
                          <input
                            className="form-check-input m-0"
                            type="radio"
                            name="estado"
                            value={estado.value}
                            checked={estadoSeleccionado === estado.value}
                            onChange={() => setEstadoSeleccionado(estado.value)}
                          />
                          <span className="text-white small">{estado.label}</span>
                        </span>
                        <span className={`small fw-bold ${estado.color}`}>
                          {estado.puntos > 0
                            ? `+${estado.puntos} pts`
                            : <i className="fa-solid fa-circle-xmark" aria-label="Sin puntos" />}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <button className="btn-magenta w-100 mt-2" type="submit">
                  Entregar y reclamar puntos
                </button>
                {!usuarioAutenticado && (
                  <p className="text-secondary small mt-3 mb-0">
                    Inicia sesión para registrar una entrega y recibir puntos.
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card-panel p-4 h-100">
              <h2 className="text-white fw-bold mb-3 fs-5">Historial de Entregas</h2>
              {historial.length === 0 ? (
                <div className="points-empty-history text-center p-5">
                  <i className="fa-solid fa-box-open text-secondary fs-1 mb-2" aria-hidden="true" />
                  <p className="text-secondary small m-0">Aún no has entregado mangas usados</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {historial.map(entrega => (
                    <article className="card-panel p-3 d-flex align-items-center justify-content-between gap-3" key={entrega.id}>
                      <div className="d-flex align-items-center gap-3">
                        <i className={`fa-solid fa-circle-check ${entrega.color} fs-5`} aria-hidden="true" />
                        <div>
                          <h3 className="text-white fw-bold mb-0 fs-6">{entrega.titulo} — Tomo {entrega.tomo}</h3>
                          <span className="text-secondary points-history-detail">{entrega.estado} · Hoy</span>
                        </div>
                      </div>
                      <span className={`fw-bold ${entrega.color}`}>
                        {entrega.puntos > 0 ? `+${entrega.puntos}` : '—'}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};