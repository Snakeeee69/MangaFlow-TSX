import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cargarPerfilUsuario, type SesionUsuario } from '../data/sesion';

interface LoginProps {
  sesion: SesionUsuario | null;
  alIniciarSesion: (sesion: SesionUsuario) => void;
  alIngresarInvitado: () => void;
  alCerrarSesion: () => void;
}

const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@mangaflow.cl'];

const obtenerPuntosIniciales = (correo: string) => {
  const clave = `mangaFlow_puntos_${correo.toLocaleLowerCase('es')}`;
  const puntosGuardados = localStorage.getItem(clave);
  if (puntosGuardados !== null) {
    const puntos = Number(puntosGuardados);
    if (Number.isFinite(puntos) && puntos >= 0) return puntos;
    console.error(`El saldo guardado para "${correo}" no es válido.`);
  }

  const puntosUsados = new Set<number>();
  for (let indice = 0; indice < localStorage.length; indice += 1) {
    const otraClave = localStorage.key(indice);
    if (!otraClave?.startsWith('mangaFlow_puntos_') || otraClave === clave) continue;
    const puntos = Number(localStorage.getItem(otraClave));
    if (Number.isInteger(puntos) && puntos >= 500 && puntos <= 5000) puntosUsados.add(puntos);
  }

  let puntos = Math.floor(500 + Math.random() * 4501);
  while (puntosUsados.has(puntos)) {
    puntos = puntos === 5000 ? 500 : puntos + 1;
  }
  localStorage.setItem(clave, String(puntos));
  return puntos;
};

export const Login = ({ sesion, alIniciarSesion, alIngresarInvitado, alCerrarSesion }: LoginProps) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const destino = (location.state as { desde?: string } | null)?.desde;
  const usuarioAutenticado = Boolean(sesion && !sesion.isGuest);

  const iniciarSesion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const email = correo.trim();
    const password = contrasena.trim();
    const correoValido = email.length <= 100
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      && dominiosPermitidos.some(dominio => email.toLocaleLowerCase('es').endsWith(dominio));

    if (!correoValido) {
      setError('Correo inválido. Usa @duoc.cl, @profesor.duoc.cl, @gmail.com o @mangaflow.cl (máx. 100 caracteres).');
      return;
    }
    if (password.length < 4 || password.length > 10) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }

    const nombre = email.split('@')[0];
    const perfil = cargarPerfilUsuario(email);
    const puntos = perfil?.puntos ?? perfil?.points ?? obtenerPuntosIniciales(email);
    alIniciarSesion({
      role: email.toLocaleLowerCase('es').endsWith('@mangaflow.cl') ? 'admin' : 'user',
      email,
      nombre: perfil?.nombre || (nombre.charAt(0).toLocaleUpperCase('es') + nombre.slice(1)),
      registradoEn: perfil?.registradoEn ?? (!perfil ? new Date().toISOString() : undefined),
      points: puntos,
      puntos,
      isGuest: false,
      wishlist: perfil?.wishlist ?? [],
      compras: perfil?.compras ?? [],
    });
    navigate(destino || (email.toLocaleLowerCase('es').endsWith('@mangaflow.cl') ? '/admin' : '/inicio'), { replace: true });
  };

  const continuarComoInvitado = () => {
    alIngresarInvitado();
    navigate('/inicio', { replace: true });
  };

  return (
    <main className="container login-page py-5">
      <section className="login-card card-panel mx-auto p-4 p-md-5">
        <div className="text-center mb-4">
          <span className="brand-logo d-inline-flex align-items-center justify-content-center mb-3">
            <img src="/images/logo/logoMangaFlow.png" alt="Logo MangaFlow" />
          </span>
          <h1 className="text-white fw-bold fs-3 mb-2">
            {usuarioAutenticado ? `Hola, ${sesion?.nombre || sesion?.email || 'lector'}`
              : sesion?.isGuest ? 'Estás como invitado' : 'Acceso a MangaFlow'}
          </h1>
          <p className="text-secondary small mb-0">
            {usuarioAutenticado
              ? 'Tu sesión está iniciada y ya puedes usar tu biblioteca, puntos y carrito.'
              : 'Inicia sesión para gestionar tus compras, puntos y biblioteca digital.'}
          </p>
        </div>

        {usuarioAutenticado ? (
          <div className="d-grid gap-3">
            <Link to="/biblioteca" className="btn-magenta text-center">
              Ir a mi biblioteca
            </Link>
            <button className="btn btn-outline-light" type="button" onClick={alCerrarSesion}>
              <i className="fa-solid fa-right-from-bracket me-2" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

            <form onSubmit={iniciarSesion} noValidate>
              <div className="mb-3">
                <label htmlFor="login-email" className="form-label text-white small fw-semibold">Correo electrónico</label>
                <input
                  id="login-email"
                  className="form-control bg-dark text-white border-secondary border-opacity-25"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@duoc.cl"
                  value={correo}
                  onChange={event => setCorreo(event.target.value)}
                  required
                />
                <div className="form-text text-secondary login-hint">
                  Permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="login-password" className="form-label text-white small fw-semibold">Contraseña</label>
                <input
                  id="login-password"
                  className="form-control bg-dark text-white border-secondary border-opacity-25"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={event => setContrasena(event.target.value)}
                  required
                />
                <div className="form-text text-secondary login-hint">Entre 4 y 10 caracteres</div>
              </div>

              <button className="btn-magenta w-100" type="submit">
                <i className="fa-solid fa-right-to-bracket me-2" aria-hidden="true" />
                Iniciar sesión
              </button>
            </form>

            <div className="login-divider"><span>O CONTINÚA COMO</span></div>

            <button className="btn btn-outline-secondary w-100 fw-semibold text-white" type="button" onClick={continuarComoInvitado}>
              <i className="fa-solid fa-user-secret me-2" aria-hidden="true" />
              Ingresar como invitado
            </button>
            <div className="login-warning mt-3 p-2 small text-center">
              El invitado no tiene acceso a la biblioteca ni a puntos, y no puede usar el carrito de compras.
            </div>
          </>
        )}
      </section>
    </main>
  );
};
