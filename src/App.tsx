import { useEffect, useRef, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Cabecera } from './componentes/organismos/Cabecera';
import { PiePagina } from './componentes/organismos/PiePagina';
import { Carritos } from './paginas/Carritos';
import { Catalogo } from './paginas/Catalogo';
import { Admin } from './paginas/Admin';
import { AutorDetalle } from './paginas/AutorDetalle';
import { EditorialDetalle } from './paginas/EditorialDetalle';
import { Editoriales } from './paginas/Editoriales';
import { Inicio } from './paginas/Inicio';
import { Biblioteca } from './paginas/Biblioteca';
import { Cuenta } from './paginas/Cuenta';
import { Login } from './paginas/Login';
import { MangaDetalle } from './paginas/MangaDetalle';
import { Puntos } from './paginas/Puntos';
import { Proximamente } from './paginas/Proximamente';
import { SobreNosotros } from './paginas/SobreNosotros';
import { Contacto } from './paginas/Contacto';
import { cargarCarrito, contarItemsCarrito, type CarritoItem } from './data/carrito';
import { cargarCatalogo, guardarCatalogo, type MangaCatalogo } from './data/catalogo';
import { registrarVisita } from './data/metricasAdmin';
import {
  cargarSesion,
  esAdminSesion,
  esTrabajadorSesion,
  guardarSesion,
  type SesionUsuario,
} from './data/sesion';

const Aplicacion = () => {
  const [sesion, setSesion] = useState<SesionUsuario | null>(cargarSesion);
  const [carrito, setCarrito] = useState<CarritoItem[]>(
    () => sesion && !sesion.isGuest ? cargarCarrito() : [],
  );
  const [catalogo, setCatalogo] = useState<MangaCatalogo[]>(cargarCatalogo);
  const location = useLocation();
  const navigate = useNavigate();
  const ultimaRutaVisitada = useRef<string | null>(null);
  const paginaActiva = location.pathname === '/catalogo'
    ? 'catalogo'
    : location.pathname === '/puntos'
      ? 'puntos'
      : location.pathname.startsWith('/editoriales')
        ? 'editoriales'
        : location.pathname === '/biblioteca'
          ? 'biblioteca'
          : location.pathname === '/proximamente'
            ? 'proximamente'
            : location.pathname === '/admin'
              ? 'admin'
              : location.pathname === '/carrito'
                ? 'carrito'
          : 'inicio';

  useEffect(() => {
    if (ultimaRutaVisitada.current === location.pathname) return;
    ultimaRutaVisitada.current = location.pathname;
    registrarVisita();
  }, [location.pathname]);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(carrito));
      if (!sesion || sesion.isGuest) localStorage.removeItem('mangaFlow_cart');
    } catch (error) {
      console.error('No se pudo guardar el carrito en el almacenamiento local.', error);
    }
  }, [carrito, sesion]);

  useEffect(() => {
    try {
      guardarCatalogo(catalogo);
    } catch (error) {
      console.error('No se pudo guardar el catálogo en el almacenamiento local.', error);
    }
  }, [catalogo]);

  const agregarAlCarrito = (producto: CarritoItem) => {
    if (!sesion || sesion.isGuest) {
      navigate('/login', { state: { desde: location.pathname } });
      return;
    }

    setCarrito(actual => {
      const existente = actual.find(item => item.id === producto.id);
      return existente
        ? actual.map(item => item.id === producto.id
          ? { ...item, quantity: item.quantity + 1 }
          : item)
        : [...actual, { ...producto, quantity: 1 }];
    });
  };

  const cambiarCantidadCarrito = (id: string, cambio: number) => {
    setCarrito(actual => actual.flatMap(item => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + cambio;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const cambiarFavorito = (id: number) => {
    if (!sesion || sesion.isGuest) {
      navigate('/login', { state: { desde: location.pathname } });
      return;
    }

    const deseosActuales = sesion.wishlist ?? [];
    const wishlist = deseosActuales.includes(id)
      ? deseosActuales.filter(mangaId => mangaId !== id)
      : [...deseosActuales, id];
    actualizarSesion({ ...sesion, wishlist });
  };

  const iniciarSesion = (usuario: SesionUsuario) => {
    guardarSesion(usuario);
    setSesion(usuario);
  };

  const ingresarComoInvitado = () => {
    const invitado: SesionUsuario = {
      role: 'guest',
      email: 'Invitado',
      nombre: 'Invitado',
      points: 0,
      puntos: 0,
      isGuest: true,
    };
    ['activeUser', 'currentUser', 'usuarioLogueado'].forEach(clave => localStorage.removeItem(clave));
    localStorage.removeItem('mangaFlow_cart');
    localStorage.setItem('mangaFlow_session', JSON.stringify(invitado));
    setSesion(invitado);
    setCarrito([]);
  };

  const cerrarSesion = () => {
    ['mangaFlow_session', 'activeUser', 'currentUser', 'usuarioLogueado'].forEach(
      clave => localStorage.removeItem(clave),
    );
    localStorage.removeItem('mangaFlow_cart');
    localStorage.setItem('cart', JSON.stringify([]));
    setSesion(null);
    setCarrito([]);
    navigate('/login');
  };

  const actualizarSesion = (usuario: SesionUsuario) => {
    guardarSesion(usuario);
    setSesion(usuario);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Cabecera
        cantidadCarrito={contarItemsCarrito(carrito)}
        paginaActiva={paginaActiva}
        sesion={sesion}
        alCerrarSesion={cerrarSesion}
      />
      <div className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={(
              <Inicio
                mangasCatalogo={catalogo}
                listaDeseos={sesion?.wishlist ?? []}
                alCambiarFavorito={cambiarFavorito}
                alAgregarAlCarrito={agregarAlCarrito}
              />
            )}
          />
          <Route
            path="/inicio"
            element={(
              <Inicio
                mangasCatalogo={catalogo}
                listaDeseos={sesion?.wishlist ?? []}
                alCambiarFavorito={cambiarFavorito}
                alAgregarAlCarrito={agregarAlCarrito}
              />
            )}
          />
          <Route
            path="/catalogo"
            element={(
              <Catalogo
                mangas={catalogo}
                listaDeseos={sesion?.wishlist ?? []}
                alCambiarFavorito={cambiarFavorito}
                alAgregarAlCarrito={agregarAlCarrito}
              />
            )}
          />
          <Route path="/puntos" element={<Puntos sesion={sesion} alActualizarSesion={actualizarSesion} />} />
          <Route path="/biblioteca" element={<Biblioteca sesion={sesion} />} />
          <Route path="/proximamente" element={<Proximamente />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/detalle-manga/:slug"
            element={(
              <MangaDetalle
                mangas={catalogo}
                sesion={sesion}
                alActualizarSesion={actualizarSesion}
                alAgregarAlCarrito={agregarAlCarrito}
              />
            )}
          />
          <Route path="/autor/:slug" element={<AutorDetalle mangas={catalogo} />} />
          <Route
            path="/admin"
            element={esAdminSesion(sesion) || esTrabajadorSesion(sesion)
              ? (
                <Admin
                  mangas={catalogo}
                  alGuardarCatalogo={setCatalogo}
                  rol={esAdminSesion(sesion) ? 'admin' : 'staff'}
                />
              )
              : <Navigate to="/inicio" replace />}
          />
          <Route
            path="/carrito"
            element={(
              <Carritos
                items={carrito}
                sesion={sesion}
                alActualizarSesion={actualizarSesion}
                alCambiarCantidad={cambiarCantidadCarrito}
                alEliminar={id => setCarrito(actual => actual.filter(item => item.id !== id))}
                alVaciar={() => setCarrito([])}
              />
            )}
          />
          <Route
            path="/login"
            element={(
              <Login
                sesion={sesion}
                alIniciarSesion={iniciarSesion}
                alIngresarInvitado={ingresarComoInvitado}
                alCerrarSesion={cerrarSesion}
              />
            )}
          />
          <Route path="/editoriales" element={<Editoriales alAgregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/editoriales/:slug" element={<EditorialDetalle alAgregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/cuenta" element={<Cuenta sesion={sesion} mangas={catalogo} alActualizarSesion={actualizarSesion} />} />
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </div>
      <PiePagina />
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Aplicacion />
    </HashRouter>
  );
}

export default App;