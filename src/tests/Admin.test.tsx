import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Admin } from '../paginas/Admin';
import type { MangaCatalogo } from '../data/catalogo';

afterEach(cleanup);

const mangaBase: MangaCatalogo = {
  id: 1,
  titulo: 'Manga de prueba',
  precio: 5000,
  demografia: 'Shōnen',
  generos: ['Acción'],
  esDigitalOnly: false,
  imagen: '/manga.jpg',
  activo: true,
  stock: 4,
};

const renderAdmin = (rol: 'admin' | 'staff', alGuardarCatalogo = vi.fn()) => {
  render(
    <MemoryRouter>
      <Admin mangas={[mangaBase]} alGuardarCatalogo={alGuardarCatalogo} rol={rol} />
    </MemoryRouter>,
  );
  return alGuardarCatalogo;
};

describe('panel de administración', () => {
  beforeEach(() => localStorage.clear());

  it('oculta métricas y eliminación definitiva al personal', () => {
    renderAdmin('staff');

    expect(screen.getByRole('heading', { name: 'Panel de personal' })).toBeTruthy();
    expect(screen.queryByRole('region', { name: 'Resumen de actividad y ventas' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Eliminar definitivamente/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'Archivar' })).toBeTruthy();
  });
});
