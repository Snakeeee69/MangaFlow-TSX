import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Carritos } from '../paginas/Carritos';
import type { CarritoItem } from '../data/carrito';
import type { SesionUsuario } from '../data/sesion';

const sesionBase: SesionUsuario = {
  email: 'lector@gmail.com',
  nombre: 'Lector',
  puntos: 0,
  isGuest: false,
  compras: [],
  biblioteca: [],
};

const itemDigital: CarritoItem = {
  id: 'one-piece-digital',
  titulo: 'One Piece',
  precio: 3990,
  demografia: 'Shōnen',
  imagen: '/images/catalogo/One_Piece_01.jpg',
  formato: 'Digital',
  quantity: 1,
  mangaId: 12,
};

const montarCarrito = (items: CarritoItem[], sesion = sesionBase) => {
  const alActualizarSesion = vi.fn();
  const alVaciar = vi.fn();
  render(
    <MemoryRouter>
      <Carritos
        items={items}
        sesion={sesion}
        alActualizarSesion={alActualizarSesion}
        alCambiarCantidad={vi.fn()}
        alEliminar={vi.fn()}
        alVaciar={alVaciar}
      />
    </MemoryRouter>,
  );
  return { alActualizarSesion, alVaciar };
};

const confirmarCompra = () => {
  const boton = screen.getByRole('button', { name: /Confirmar compra/ });
  const formulario = boton.closest('form');
  if (!formulario) throw new Error('El botón de compra debe estar dentro del formulario de checkout.');
  fireEvent.submit(formulario);
};

describe('checkout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(cleanup);

  it('agrega una compra digital a la biblioteca y guarda la boleta', () => {
    const { alActualizarSesion, alVaciar } = montarCarrito([itemDigital]);
    confirmarCompra();

    expect(alActualizarSesion).toHaveBeenCalledWith(expect.objectContaining({
      biblioteca: [expect.objectContaining({
        id: itemDigital.id,
        titulo: 'One Piece',
        formato: 'Digital',
        cantidad: 1,
      })],
      compras: [expect.objectContaining({
        tipoEntrega: 'digital',
        items: [expect.objectContaining({ formato: 'Digital' })],
      })],
    }));
    expect(alVaciar).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'Compra aprobada' })).toBeTruthy();
    expect(screen.getByText('Tus mangas digitales ya están en Mi Biblioteca.')).toBeTruthy();
  });
});
