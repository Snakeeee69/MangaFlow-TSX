export interface SesionUsuario {
  role?: string;
  email?: string;
  nombre?: string;
  username?: string;
  registradoEn?: string;
  points?: number;
  puntos?: number;
  isGuest?: boolean;
  wishlist?: number[];
  compras?: CompraSesion[];
  biblioteca?: LibroBiblioteca[];
  cuponesFisicos?: string[];
  [key: string]: unknown;
}

export type RolMangaFlow = 'admin' | 'staff' | 'user' | 'guest';

export interface CompraSesion {
  id: string;
  fecha: string;
  folio: string;
  total: number;
  subtotalNeto?: number;
  iva?: number;
  descuentoPuntos?: number;
  descuentoCupon?: number;
  cuponAplicado?: string;
  puntosGanados?: number;
  medioPago?: string;
  tipoEntrega?: 'despacho' | 'retiro' | 'digital';
  direccionEntrega?: string;
  items: Array<{
    id: string;
    titulo: string;
    precio: number;
    quantity: number;
    imagen: string;
    formato: string;
  }>;
}

export interface LibroBiblioteca {
  id: string;
  titulo: string;
  imagen: string;
  formato: 'Digital';
  fechaAdquisicion: string;
  cantidad: number;
}

const clavesSesion = ['mangaFlow_session', 'activeUser', 'usuarioLogueado', 'currentUser'];

const clavePerfilUsuario = (correo: string) => (
  `mangaFlow_usuario_${correo.trim().toLocaleLowerCase('es')}`
);

export const rolPorCorreo = (correo: string): RolMangaFlow => {
  const correoNormalizado = correo.trim().toLocaleLowerCase('es');
  if (correoNormalizado.endsWith('@mangaflow.cl')) return 'admin';
  if (correoNormalizado.endsWith('@mangaflow.com')) return 'staff';
  return 'user';
};

export const cargarPerfilUsuario = (correo: string): SesionUsuario | null => {
  const guardado = localStorage.getItem(clavePerfilUsuario(correo));
  if (!guardado) return null;

  try {
    const perfil: unknown = JSON.parse(guardado);
    if (typeof perfil === 'object' && perfil !== null && !Array.isArray(perfil)) {
      return perfil as SesionUsuario;
    }
    console.error(`El perfil guardado para "${correo}" no tiene el formato esperado.`);
  } catch (error) {
    console.error(`No se pudo leer el perfil guardado para "${correo}".`, error);
  }

  return null;
};

export const cargarSesion = (): SesionUsuario | null => {
  for (const clave of clavesSesion) {
    const guardado = localStorage.getItem(clave);
    if (!guardado) continue;

    try {
      const sesion: unknown = JSON.parse(guardado);
      if (typeof sesion === 'object' && sesion !== null && !Array.isArray(sesion)) {
        const usuario = sesion as SesionUsuario;
        if (usuario.email && !usuario.isGuest) {
          return { ...cargarPerfilUsuario(usuario.email), ...usuario };
        }
        return usuario;
      }
      console.error(`Los datos guardados en "${clave}" no tienen el formato de sesión esperado.`);
    } catch (error) {
      console.error(`No se pudieron leer los datos de sesión guardados en "${clave}".`, error);
    }
  }

  return null;
};

export const guardarSesion = (sesion: SesionUsuario) => {
  if (sesion.email && !sesion.isGuest) {
    localStorage.setItem(clavePerfilUsuario(sesion.email), JSON.stringify(sesion));
  }
  localStorage.setItem('mangaFlow_session', JSON.stringify(sesion));
  localStorage.setItem('activeUser', JSON.stringify(sesion));
  localStorage.setItem('usuarioLogueado', JSON.stringify(sesion));
  localStorage.setItem('currentUser', JSON.stringify(sesion));
  window.dispatchEvent(new Event('mangaflow:metricas-actualizadas'));
  window.dispatchEvent(new Event('mangaflow:pedidos-actualizados'));
};

export const puntosDeSesion = (sesion: SesionUsuario | null) => {
  const puntos = sesion?.puntos ?? sesion?.points;
  return typeof puntos === 'number' && Number.isFinite(puntos) ? Math.max(0, puntos) : 0;
};

export const esAdminSesion = (sesion: SesionUsuario | null) => (
  Boolean(sesion?.email && rolPorCorreo(sesion.email) === 'admin' && !sesion.isGuest)
);

export const esTrabajadorSesion = (sesion: SesionUsuario | null) => (
  Boolean(sesion?.email && rolPorCorreo(sesion.email) === 'staff' && !sesion.isGuest)
);
