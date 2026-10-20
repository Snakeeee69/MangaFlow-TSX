import type { Recompensa } from '../../data/recompensas';

interface TarjetaRecompensaProps {
  recompensa: Recompensa;
  puntosUsuario: number;
  usuarioAutenticado: boolean;
  alCanjear: (recompensa: Recompensa) => void;
}

const etiquetasTipo = {
  merch: { texto: 'Merch', clase: 'bg-purple' },
  manga: { texto: 'Manga', clase: 'bg-primary' },
  'edicion-especial': { texto: 'Premium', clase: 'bg-warning text-dark' },
};

export const TarjetaRecompensa = ({
  recompensa,
  puntosUsuario,
  usuarioAutenticado,
  alCanjear,
}: TarjetaRecompensaProps) => {
  const puedeCanjear = usuarioAutenticado
    && puntosUsuario >= recompensa.costoPuntos
    && recompensa.stock > 0;
  const etiqueta = etiquetasTipo[recompensa.tipo];

  return (
    <article className="card-panel reward-card h-100 overflow-hidden d-flex flex-column justify-content-between">
      <div>
        <div className="reward-image-wrap position-relative">
          <img
            className="reward-image"
            src={recompensa.imagen}
            alt={recompensa.nombre}
            onError={event => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/logo/logoMangaFlow.png';
            }}
          />
          <span className={`badge position-absolute top-0 end-0 m-2 ${etiqueta.clase}`}>
            {etiqueta.texto}
          </span>
        </div>
        <div className="p-3">
          <h2 className="text-white fw-bold fs-6 mb-1">{recompensa.nombre}</h2>
          <p className="text-secondary mb-0 reward-description">{recompensa.descripcion}</p>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
          <div>
            <span className="reward-points fw-bold">
              {recompensa.costoPuntos.toLocaleString('es-CL')} pts
            </span>
            <div className="text-secondary reward-stock">Stock: {recompensa.stock}</div>
          </div>
          <button
            className="btn-magenta reward-redeem-button"
            type="button"
            disabled={!puedeCanjear}
            onClick={() => alCanjear(recompensa)}
          >
            <i className="fa-solid fa-gift me-1" aria-hidden="true" />
            Canjear
          </button>
        </div>
        {!usuarioAutenticado ? (
          <p className="text-danger reward-hint mb-0">Inicia sesión para canjear</p>
        ) : !puedeCanjear && puntosUsuario < recompensa.costoPuntos ? (
          <p className="text-secondary reward-hint mb-0">
            Te faltan {(recompensa.costoPuntos - puntosUsuario).toLocaleString('es-CL')} pts
          </p>
        ) : null}
      </div>
    </article>
  );
};
