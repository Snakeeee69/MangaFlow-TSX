import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Biblioteca } from '../paginas/Biblioteca';

afterEach(cleanup);

describe('Biblioteca digital', () => {
  it('permite leer One Piece adquirido y avanzar de página', () => {
    render(
      <MemoryRouter>
        <Biblioteca sesion={{
          email: 'lector@gmail.com',
          nombre: 'Lector',
          biblioteca: [{
            id: 'one-piece-digital',
            titulo: 'One Piece',
            imagen: '/images/catalogo/One_Piece_01.jpg',
            formato: 'Digital',
            fechaAdquisicion: '2026-01-15',
            cantidad: 1,
          }],
        }} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Leer ahora' }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Página 1 de One Piece' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Siguiente/ }));
    expect(screen.getByRole('img', { name: 'Página 2 de One Piece' })).toBeTruthy();
  });
});
