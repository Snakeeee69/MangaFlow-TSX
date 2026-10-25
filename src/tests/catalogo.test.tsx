import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MangaDetalle } from '../paginas/MangaDetalle';
import { Editoriales } from '../paginas/Editoriales';
import { editoriales as catalogoEditoriales } from '../data/editoriales';
import {
  cargarCatalogo,
  guardarCatalogo,
  mangasCatalogo,
} from '../data/catalogo';

describe('catálogo', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('persiste el catálogo y agrega al carrito el tomo y formato elegidos', () => {
    expect(mangasCatalogo.every(manga => manga.precioDigital === 2300)).toBe(true);
    expect(catalogoEditoriales.every(editorial => (
      editorial.catalogo.every(obra => obra.precioDigital === 2300)
    ))).toBe(true);
    const actualizado = [{ ...mangasCatalogo[0], stock: 42 }];
    guardarCatalogo(actualizado);

    expect(JSON.parse(localStorage.getItem('mangaFlow_catalogo') ?? '[]')).toEqual(actualizado);

    const onePieceInicial = mangasCatalogo.find(item => item.titulo === 'One Piece');
    expect(onePieceInicial).toBeDefined();
    localStorage.setItem('mangaFlow_catalogo', JSON.stringify([{
      ...onePieceInicial,
      precioDigital: 3990,
      autor: undefined,
      sinopsis: undefined,
      tomosDisponibles: undefined,
    }]));
    expect(cargarCatalogo()[0]).toMatchObject({
      precioDigital: 2300,
      autor: onePieceInicial?.autor,
      sinopsis: onePieceInicial?.sinopsis,
      tomosDisponibles: onePieceInicial?.tomosDisponibles,
    });

    const manga = mangasCatalogo.find(item => item.titulo === 'One Piece');
    expect(manga).toBeDefined();
    const alAgregarAlCarrito = vi.fn();
    render(
      <MemoryRouter initialEntries={['/detalle-manga/one-piece']}>
        <Routes>
          <Route
            path="/detalle-manga/:slug"
            element={(
              <MangaDetalle
                mangas={mangasCatalogo}
                sesion={null}
                alActualizarSesion={vi.fn()}
                alAgregarAlCarrito={alAgregarAlCarrito}
              />
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(manga?.sinopsis ?? '')).toBeTruthy();
    expect(screen.getByText(manga?.autor ?? '')).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Tomo 110' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Tomo a comprar'), { target: { value: '3' } });
    fireEvent.click(screen.getByLabelText('Edición digital'));
    expect(screen.getByText('$2.300')).toBeTruthy();
    expect(screen.getByRole('note').textContent).toContain('cupón de $2.300 de descuento');
    fireEvent.click(screen.getByRole('button', { name: /Agregar al carrito/ }));

    expect(alAgregarAlCarrito).toHaveBeenCalledWith(expect.objectContaining({
      titulo: 'One Piece - Tomo 3',
      precio: 2300,
      formato: 'Digital',
      mangaId: manga?.id,
    }));

    cleanup();
    const alAgregarDesdeEditorial = vi.fn();
    render(
      <MemoryRouter initialEntries={['/editoriales']}>
        <Routes>
          <Route path="/editoriales" element={<Editoriales alAgregarAlCarrito={alAgregarDesdeEditorial} />} />
          <Route
            path="/detalle-manga/:slug"
            element={(
              <MangaDetalle
                mangas={mangasCatalogo}
                sesion={null}
                alActualizarSesion={vi.fn()}
                alAgregarAlCarrito={vi.fn()}
              />
            )}
          />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Agregar One Piece tomo 1 digital al carrito' }));

    expect(alAgregarDesdeEditorial).toHaveBeenCalledWith(expect.objectContaining({
      titulo: 'One Piece - Tomo 1',
      precio: 2300,
      formato: 'Digital',
      mangaId: manga?.id,
    }));
    fireEvent.click(screen.getByRole('link', { name: 'Ver manga One Piece' }));

    expect(screen.getByRole('heading', { name: 'One Piece' })).toBeTruthy();
    expect(screen.getByText('Eiichiro Oda')).toBeTruthy();
  });
});
