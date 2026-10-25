import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Puntos } from '../paginas/Puntos';

describe('puntos y recompensas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(cleanup);

  it('descuenta el costo del saldo cuando se canjea una recompensa elegible', () => {
    const alActualizarSesion = vi.fn();
    render(
      <MemoryRouter>
        <Puntos
          sesion={{ email: 'lector@gmail.com', puntos: 1000, isGuest: false }}
          alActualizarSesion={alActualizarSesion}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByRole('button', { name: 'Canjear' })[0]);

    expect(alActualizarSesion).toHaveBeenCalledWith(expect.objectContaining({
      puntos: 250,
      points: 250,
    }));
    expect(screen.getByRole('status').textContent).toContain('¡Canjeaste: Marcapáginas Coleccionable!');
  });
});
