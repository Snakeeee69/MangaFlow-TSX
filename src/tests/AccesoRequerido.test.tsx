import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AccesoRequerido } from '../componentes/moleculas/AccesoRequerido';

afterEach(cleanup);

describe('AccesoRequerido', () => {
  it('enlaza al usuario con el inicio de sesión', () => {
    render(
      <MemoryRouter>
        <AccesoRequerido titulo="Puntos" descripcion="Acceso restringido." />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Iniciar sesión' }).getAttribute('href')).toBe('/login');
    expect(screen.getByText(/continuar como invitado/)).toBeTruthy();
  });
});
