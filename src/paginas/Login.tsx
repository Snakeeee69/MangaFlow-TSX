import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cargarPerfilUsuario, rolPorCorreo, type SesionUsuario } from '../data/sesion';

interface LoginProps {
  sesion: SesionUsuario | null;
  alIniciarSesion: (sesion: SesionUsuario) => void;
  alIngresarInvitado: () => void;
  alCerrarSesion: () => void;
}

const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
const correoConFormatoValido = (correo: string) => (
  correo.length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
);
const correoUsuarioPermitido = (correo: string) => (
  correoConFormatoValido(correo)
  && dominiosPermitidos.some(dominio => correo.toLocaleLowerCase('es').endsWith(dominio))
);
const obtenerAyudaCorreo = (correo: string, esRegistro: boolean) => {
  const valor = correo.trim();
  if (!valor) return '';
  if (valor.length > 100) return 'El correo no puede superar los 100 caracteres.';
  if (!valor.includes('@')) return 'Te falta el @ y el dominio, por ejemplo nombre@gmail.com.';
  if ((valor.match(/@/g) ?? []).length > 1) return 'Usa un solo @ en el correo.';

  const [usuario, dominio = ''] = valor.split('@');
  if (!usuario) return 'Escribe el nombre antes del @.';
  if (!dominio) return 'Después del @ escribe tu dominio, por ejemplo gmail.com.';
  if (!dominio.includes('.')) return 'Al dominio le falta un punto y su terminación, por ejemplo .com o .cl.';
  if (dominio.endsWith('.')) return 'Después del punto falta la terminación del dominio, por ejemplo com o cl.';
  if (!correoConFormatoValido(valor)) return 'Revisa el correo: debe tener un formato como nombre@gmail.com.';
  if (esRegistro && !correoUsuarioPermitido(valor)) {
    return 'Ese dominio no está habilitado para el registro de cuentas personales.';
  }
  return 'El formato del correo se ve correcto.';
};
const contrasenaValida = (contrasena: string) => (
  contrasena.length >= 4 && contrasena.length <= 10
);

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
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [correo, setCorreo] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacionContrasena, setConfirmacionContrasena] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const destino = (location.state as { desde?: string } | null)?.desde;
  const usuarioAutenticado = Boolean(sesion && !sesion.isGuest);
  const ayudaCorreo = obtenerAyudaCorreo(correo, modo === 'registro');

  const iniciarSesion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const email = correo.trim();
    const password = contrasena.trim();
    const rol = rolPorCorreo(email);
    const correoValido = correoConFormatoValido(email)
      && (
        dominiosPermitidos.some(dominio => email.toLocaleLowerCase('es').endsWith(dominio))
        || rol === 'admin'
        || rol === 'staff'
      );

    if (!correoValido) {
      setError('Correo o tipo de cuenta no válido. Usa una dirección permitida o solicita acceso a tu administrador.');
      return;
    }
    if (!contrasenaValida(password)) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }

    try {
      const nombre = email.split('@')[0];
      const perfil = cargarPerfilUsuario(email);
      const puntos = perfil?.puntos ?? perfil?.points ?? obtenerPuntosIniciales(email);
      alIniciarSesion({
        ...perfil,
        role: rol,
        email,
        nombre: perfil?.nombre || (nombre.charAt(0).toLocaleUpperCase('es') + nombre.slice(1)),
        registradoEn: perfil?.registradoEn ?? (!perfil ? new Date().toISOString() : undefined),
        points: puntos,
        puntos,
        isGuest: false,
        wishlist: perfil?.wishlist ?? [],
        compras: perfil?.compras ?? [],
      });
      navigate(destino || (rol === 'admin' || rol === 'staff' ? '/admin' : '/inicio'), { replace: true });
    } catch (cause) {
      console.error('No se pudo iniciar la sesión en el almacenamiento local.', cause);
      setError('No se pudo iniciar sesión. Revisa el almacenamiento del navegador e inténtalo nuevamente.');
    }
  };

  const registrarUsuario = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const email = correo.trim();
    const nombre = nombreCompleto.trim();
    const password = contrasena.trim();

    if (nombre.length < 2 || nombre.length > 60) {
      setError('Escribe un nombre de entre 2 y 60 caracteres.');
      return;
    }
    if (!correoUsuarioPermitido(email)) {
      setError('Para crear una cuenta usa un correo válido @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      return;
    }
    if (!contrasenaValida(password)) {
      setError('La contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }
    if (password !== confirmacionContrasena.trim()) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (cargarPerfilUsuario(email)) {
      setError('Ya existe una cuenta con ese correo. Inicia sesión en su lugar.');
      return;
    }

    try {
      const puntos = obtenerPuntosIniciales(email);
      alIniciarSesion({
        role: 'user',
        email,
        nombre,
        registradoEn: new Date().toISOString(),
        points: puntos,
        puntos,
        isGuest: false,
        wishlist: [],
        compras: [],
        biblioteca: [],
      });
      navigate('/inicio', { replace: true });
    } catch (cause) {
      console.error('No se pudo guardar el nuevo perfil en el almacenamiento local.', cause);
      setError('No se pudo crear la cuenta. Revisa el almacenamiento del navegador e inténtalo nuevamente.');
    }
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
              : sesion?.isGuest ? 'Estás como invitado'
                : modo === 'registro' ? 'Únete a MangaFlow' : 'Acceso a MangaFlow'}
          </h1>
          <p className="text-secondary small mb-0">
            {usuarioAutenticado
              ? 'Tu sesión está iniciada y ya puedes usar tu biblioteca, puntos y carrito.'
              : modo === 'registro'
                ? 'Crea tu cuenta para guardar tus mangas, compras y favoritos.'
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

            <form onSubmit={modo === 'registro' ? registrarUsuario : iniciarSesion} noValidate>
              {modo === 'registro' && (
                <div className="mb-3">
                  <label htmlFor="register-name" className="form-label text-white small fw-semibold">Nombre</label>
                  <input
                    id="register-name"
                    className="form-control bg-dark text-white border-secondary border-opacity-25"
                    type="text"
                    autoComplete="name"
                    placeholder="Tu nombre"
                    value={nombreCompleto}
                    onChange={event => setNombreCompleto(event.target.value)}
                    maxLength={60}
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor={modo === 'registro' ? 'register-email' : 'login-email'} className="form-label text-white small fw-semibold">Correo electrónico</label>
                <input
                  id={modo === 'registro' ? 'register-email' : 'login-email'}
                  className={`form-control bg-dark text-white border-secondary border-opacity-25 ${ayudaCorreo && (ayudaCorreo.startsWith('El formato') ? 'email-hint-valid' : 'email-hint-invalid')}`}
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@duoc.cl"
                  value={correo}
                  onChange={event => setCorreo(event.target.value)}
                  aria-describedby={modo === 'registro' ? 'register-email-hint' : 'login-email-hint'}
                  required
                />
                <div id={modo === 'registro' ? 'register-email-hint' : 'login-email-hint'} className="form-text text-secondary login-hint">
                  {modo === 'registro'
                    ? 'Cuentas personales: @duoc.cl, @profesor.duoc.cl o @gmail.com'
                    : 'Permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com'}
                </div>
                {ayudaCorreo && (
                  <div
                    className={`email-live-hint ${ayudaCorreo.startsWith('El formato') ? 'valid' : 'invalid'}`}
                    aria-live="polite"
                  >
                    <i
                      className={`fa-solid ${ayudaCorreo.startsWith('El formato') ? 'fa-circle-check' : 'fa-circle-info'}`}
                      aria-hidden="true"
                    />
                    {ayudaCorreo}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor={modo === 'registro' ? 'register-password' : 'login-password'} className="form-label text-white small fw-semibold">Contraseña</label>
                <input
                  id={modo === 'registro' ? 'register-password' : 'login-password'}
                  className="form-control bg-dark text-white border-secondary border-opacity-25"
                  type="password"
                  autoComplete={modo === 'registro' ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={event => setContrasena(event.target.value)}
                  minLength={4}
                  maxLength={10}
                  required
                />
                <div className="form-text text-secondary login-hint">Entre 4 y 10 caracteres</div>
              </div>

              {modo === 'registro' && (
                <div className="mb-4">
                  <label htmlFor="register-password-confirm" className="form-label text-white small fw-semibold">Confirma tu contraseña</label>
                  <input
                    id="register-password-confirm"
                    className="form-control bg-dark text-white border-secondary border-opacity-25"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmacionContrasena}
                    onChange={event => setConfirmacionContrasena(event.target.value)}
                    minLength={4}
                    maxLength={10}
                    required
                  />
                </div>
              )}

              <button className="btn-magenta w-100" type="submit">
                <i className={`fa-solid ${modo === 'registro' ? 'fa-user-plus' : 'fa-right-to-bracket'} me-2`} aria-hidden="true" />
                {modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="text-center small mt-3 mb-0">
              <span className="text-secondary">
                {modo === 'registro' ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}
              </span>{' '}
              <button
                type="button"
                className="login-mode-toggle"
                onClick={() => {
                  setError('');
                  setModo(actual => actual === 'login' ? 'registro' : 'login');
                }}
              >
                {modo === 'registro' ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>

            {modo === 'login' && (
              <>
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
            <div className="login-demo-note mt-3 small text-center">
              Demo local: las cuentas se guardan en este navegador; no se almacena ni verifica la contraseña en un servidor.
            </div>
          </>
        )}
      </section>
    </main>
  );
};
