import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Cabecera } from './componentes/organismos/Cabecera';
import { PiePagina } from './componentes/organismos/PiePagina';
import { Catalogo } from './paginas/Catalogo';
import { EditorialDetalle } from './paginas/EditorialDetalle';
import { Editoriales } from './paginas/Editoriales';
import { Inicio } from './paginas/Inicio';
import { Biblioteca } from './paginas/Biblioteca';
import { Puntos } from './paginas/Puntos';
import { Proximamente } from './paginas/Proximamente';

const Aplicacion = () => {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const location = useLocation();
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
          : 'inicio';

  const agregarAlCarrito = (id: number) => {
    setCantidadCarrito(cantidad => cantidad + 1);
    console.log(`Producto ${id} añadido al carrito.`);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Cabecera cantidadCarrito={cantidadCarrito} paginaActiva={paginaActiva} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio alAgregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/inicio" element={<Inicio alAgregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/catalogo" element={<Catalogo alAgregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/puntos" element={<Puntos />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/proximamente" element={<Proximamente />} />
          <Route path="/editoriales" element={<Editoriales alAgregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/editoriales/:slug" element={<EditorialDetalle alAgregarAlCarrito={agregarAlCarrito} />} />
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