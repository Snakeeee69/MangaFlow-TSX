import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Carritos } from '../paginas/Carritos';
import type { CarritoItem } from '../data/carrito';

afterEach(cleanup);

const item: CarritoItem = {
  id: 'naruto-fisico',
  titulo: 'Naruto',
  precio: 8590,
  demografia: 'Shōnen',
  imagen: '/naruto.jpg',
  formato: 'Físico',
  quantity: 2,
};

describe('vista de carrito', () => {
  it('muestra el total de unidades y el subtotal del pedido', () => {
    const { container } = render(
      <MemoryRouter>
        <Carritos
          items={[item]}
          sesion={{ email: 'lector@gmail.com', puntos: 0, isGuest: false }}
          alActualizarSesion={vi.fn()}
          alCambiarCantidad={vi.fn()}
          alEliminar={vi.fn()}
          alVaciar={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Carrito' })).toBeTruthy();
    expect(container.querySelector('.cart-page-count')?.textContent).toBe('2');
    const subtotal = screen.getByText('Subtotal (2 artículos)').parentElement;
    expect(subtotal?.lastElementChild?.textContent).toBe('$17.180');
  });
});
