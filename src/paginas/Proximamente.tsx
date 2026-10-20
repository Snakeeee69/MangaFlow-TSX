import { useEffect, useState, type FormEvent } from 'react';

interface PeticionManga {
  id: string;
  titulo: string;
  descripcion: string;
  autor: string;
  votos: number;
  yaVote: boolean;
  fecha: string;
}

const peticionesIniciales: PeticionManga[] = [
  {
    id: 'p1',
    titulo: 'Chainsaw Man',
    descripcion: 'El manga de Tatsuki Fujimoto sobre Denji y sus aventuras como cazador de demonios. Sería increíble tenerlo en físico.',
    autor: 'Carlos M.',
    votos: 47,
    yaVote: false,
    fecha: '2026-05-10',
  },
  {
    id: 'p2',
    titulo: 'Blue Lock',
    descripcion: 'Manga de fútbol con una premisa única: 300 delanteros encerrados compitiendo por un cupo en la selección japonesa.',
    autor: 'Valentina R.',
    votos: 34,
    yaVote: false,
    fecha: '2026-05-18',
  },
  {
    id: 'p3',
    titulo: 'Dungeon Meshi',
    descripcion: 'Delicious in Dungeon, el manga de cocina y fantasía que se convirtió en anime. Los tomos físicos son hermosos.',
    autor: 'Tomás G.',
    votos: 29,
    yaVote: false,
    fecha: '2026-06-01',
  },
];

const hojaRuta = [
  {
    icono: 'fa-robot',
    version: 'v1.2 IA',
    titulo: 'Asistente IA "P-ko"',
    descripcion: 'Un asistente inteligente capacitado para dar recomendaciones personalizadas, guiarte en el orden de lectura correcto de sagas complejas y comparar ediciones de tomos.',
    estado: 'En desarrollo',
    iconoEstado: 'fa-regular fa-clock',
  },
  {
    icono: 'fa-heart',
    version: 'v1.1 Kaguya',
    titulo: 'Lista de Deseos Inteligente',
    descripcion: 'Guarda tus tomos pendientes, recibe alertas automáticas de reposición de stock, notificaciones de preventas y calcula cuánto te falta para completar tu colección.',
    estado: 'Diseño funcional',
    iconoEstado: 'fa-solid fa-spinner',
  },
  {
    icono: 'fa-trophy',
    version: 'v1.4 Logros',
    titulo: 'Sistema de Logros e Insignias',
    descripcion: 'Desbloquea logros estilo plataforma de videojuegos al completar colecciones de mangas, realizar lecturas continuas o participar en intercambios de tomos usados.',
    estado: 'Planificado',
    iconoEstado: 'fa-regular fa-calendar',
  },
  {
    icono: 'fa-users-gear',
    version: 'v2.0 Comunidad',
    titulo: 'Marketplace & Comunidad',
    descripcion: 'Publica reseñas, califica obras, sigue a otros coleccionistas e intercambia o compra mangas usados directamente entre usuarios bajo nuestro sistema de certificación.',
    estado: 'Expansión futura',
    iconoEstado: 'fa-solid fa-box-archive',
  },
  {
    icono: 'fa-chart-pie',
    version: 'v1.3 Stats',
    titulo: 'Estadísticas del Coleccionista',
    descripcion: 'Obtén métricas de lectura, porcentaje de mangas leídos, autores favoritos, tiempo invertido y valoración estimada de tu biblioteca física y digital.',
    estado: 'Planificado',
    iconoEstado: 'fa-solid fa-chart-line',
  },
  {
    icono: 'fa-mobile-screen-button',
    version: 'v2.1 Mobile',
    titulo: 'Integraciones Sync & App',
    descripcion: 'Sincronización directa con AniList/MyAnimeList, notificaciones push para preventas y aplicación móvil con modo de lectura offline para tus tomos digitales.',
    estado: 'Expansión futura',
    iconoEstado: 'fa-solid fa-arrows-rotate',
  },
];

const fechaActual = () => {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

export const Proximamente = () => {
  const [peticiones, setPeticiones] = useState(peticionesIniciales);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errorTitulo, setErrorTitulo] = useState('');
  const [peticionEnviada, setPeticionEnviada] = useState(false);

  useEffect(() => {
    if (!peticionEnviada) return;
    const timeout = window.setTimeout(() => setPeticionEnviada(false), 3500);
    return () => window.clearTimeout(timeout);
  }, [peticionEnviada]);

  const votarPeticion = (id: string) => {
    setPeticiones(actuales => actuales.map(peticion => {
      if (peticion.id !== id) return peticion;
      return {
        ...peticion,
        votos: peticion.yaVote ? peticion.votos - 1 : peticion.votos + 1,
        yaVote: !peticion.yaVote,
      };
    }));
  };

  const enviarPeticion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tituloLimpio = titulo.trim();
    if (!tituloLimpio) {
      setErrorTitulo('El título es obligatorio.');
      return;
    }

    setPeticiones(actuales => [{
      id: `p-${Date.now()}`,
      titulo: tituloLimpio,
      descripcion: descripcion.trim(),
      autor: 'Tú',
      votos: 1,
      yaVote: true,
      fecha: fechaActual(),
    }, ...actuales]);
    setTitulo('');
    setDescripcion('');
    setErrorTitulo('');
    setPeticionEnviada(true);
  };

  const peticionesOrdenadas = [...peticiones].sort((a, b) => b.votos - a.votos);

  return (
    <main className="container roadmap-page py-4 py-lg-5">
      <header className="text-center mb-5">
        <span className="roadmap-eyebrow badge px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">
          Hoja de ruta &amp; upgrades
        </span>
        <p className="roadmap-intro text-secondary mx-auto mb-0">
          Estamos trabajando para llevar la experiencia de MangaFlow al siguiente nivel.
          Revisa las características que se integrarán próximamente a la plataforma.
        </p>
      </header>

      <section className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5" aria-label="Próximas mejoras">
        {hojaRuta.map(mejora => (
          <div className="col" key={mejora.version}>
            <article className="roadmap-card h-100 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="roadmap-icon">
                  <i className={`fa-solid ${mejora.icono} fs-4`} aria-hidden="true" />
                </span>
                <span className="roadmap-version badge px-2 py-1 rounded-3">{mejora.version}</span>
              </div>
              <h2 className="fw-bold text-white mb-2 fs-5">{mejora.titulo}</h2>
              <p className="text-secondary small mb-4">{mejora.descripcion}</p>
              <div className="roadmap-status mt-auto d-flex justify-content-between align-items-center text-secondary small pt-3">
                <span>Estado: {mejora.estado}</span>
                <i className={mejora.iconoEstado} aria-hidden="true" />
              </div>
            </article>
          </div>
        ))}
      </section>

      <section className="roadmap-requests mt-5 pt-4" aria-labelledby="requests-title">
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
          <h2 className="text-white fw-bold fs-4 m-0" id="requests-title">Peticiones de manga</h2>
          <span className="text-secondary small fw-semibold" aria-live="polite">
            {peticiones.length} {peticiones.length === 1 ? 'petición' : 'peticiones'}
          </span>
        </div>

        <div className="d-flex flex-column gap-3 mb-5">
          {peticionesOrdenadas.map((peticion, indice) => (
            <article className="request-card p-3 rounded-3 d-flex align-items-start gap-3" key={peticion.id}>
              <span className="text-secondary fw-bold small request-rank">#{indice + 1}</span>
              <button
                className={`request-vote-button ${peticion.yaVote ? 'voted' : ''}`}
                type="button"
                onClick={() => votarPeticion(peticion.id)}
                aria-label={`${peticion.yaVote ? 'Quitar voto a' : 'Votar por'} ${peticion.titulo}. ${peticion.votos} votos`}
                aria-pressed={peticion.yaVote}
              >
                <i className="fa-solid fa-chevron-up" aria-hidden="true" />
                <span>{peticion.votos}</span>
              </button>
              <div className="flex-grow-1">
                <h3 className="text-white fw-semibold small mb-1">{peticion.titulo}</h3>
                {peticion.descripcion && (
                  <p className="text-secondary extra-small leading-relaxed mb-2">{peticion.descripcion}</p>
                )}
                <div className="d-flex align-items-center gap-3">
                  <span className="request-meta">por {peticion.autor}</span>
                  <time className="request-meta" dateTime={peticion.fecha}>{peticion.fecha}</time>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="roadmap-form-card p-4 p-md-5">
          <h2 className="fw-bold text-white mb-2 fs-5">¿Falta tu manga favorito?</h2>
          <p className="text-secondary small mb-4">
            Envíanos tu petición y la comunidad podrá votarla para integrarla próximamente a MangaFlow.
          </p>

          {peticionEnviada && (
            <div className="request-success d-flex align-items-center gap-2 px-3 py-3 rounded-3 mb-4" role="status">
              <i className="fa-solid fa-circle-check fs-5" aria-hidden="true" />
              ¡Petición enviada! Gracias por participar en la comunidad.
            </div>
          )}

          <form onSubmit={enviarPeticion} noValidate>
            <div className="mb-4">
              <label className="form-label roadmap-form-label" htmlFor="request-title">
                Nombre del manga <span className="request-required">*</span>
              </label>
              <input
                id="request-title"
                className="form-control roadmap-input"
                type="text"
                value={titulo}
                onChange={event => {
                  setTitulo(event.target.value);
                  if (event.target.value.trim()) setErrorTitulo('');
                }}
                placeholder="Ej: Chainsaw Man"
                aria-invalid={Boolean(errorTitulo)}
                aria-describedby={errorTitulo ? 'request-title-error' : undefined}
              />
              {errorTitulo && <p className="text-danger small mt-2 mb-0" id="request-title-error">{errorTitulo}</p>}
            </div>

            <div className="mb-4">
              <label className="form-label roadmap-form-label" htmlFor="request-description">
                Descripción <span className="request-optional">(opcional)</span>
              </label>
              <textarea
                id="request-description"
                className="form-control roadmap-input roadmap-textarea"
                rows={3}
                value={descripcion}
                onChange={event => setDescripcion(event.target.value)}
                placeholder="Cuéntanos de qué trata y por qué debería estar en MangaFlow..."
              />
            </div>

            <button className="btn-magenta d-inline-flex align-items-center gap-2" type="submit">
              <i className="fa-solid fa-paper-plane" aria-hidden="true" />
              Enviar petición
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};