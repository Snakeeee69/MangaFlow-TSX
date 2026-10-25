import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Carritos } from '../paginas/Carritos';
import { Cuenta } from '../paginas/Cuenta';
import type { CarritoItem } from '../data/carrito';
import type { SesionUsuario } from '../data/sesion';
import { mangasCatalogo } from '../data/catalogo';

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
  precio: 2300,
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
    const { alActualizarSesion, alVaciar } = montarCarrito([{ ...itemDigital, quantity: 2 }]);
    confirmarCompra();

    expect(alActualizarSesion).toHaveBeenCalledWith(expect.objectContaining({
      biblioteca: [expect.objectContaining({
        id: itemDigital.id,
        titulo: 'One Piece',
        formato: 'Digital',
        cantidad: 2,
      })],
      cuponesFisicos: ['MF-00001-D1', 'MF-00001-D2'],
      puntos: 0,
      points: 0,
      compras: [expect.objectContaining({
        tipoEntrega: 'digital',
        puntosGanados: 0,
        items: [expect.objectContaining({ formato: 'Digital' })],
      })],
    }));
    expect(alVaciar).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'Compra aprobada' })).toBeTruthy();
    expect(screen.getByText('Tu manga digital ya está en Mi Biblioteca.')).toBeTruthy();
    expect(screen.getByText(/Tus 2 cupones de \$2.300 se han añadido a tu cuenta/)).toBeTruthy();

    cleanup();
    const sesionConCupones: SesionUsuario = {
      ...sesionBase,
      cuponesFisicos: ['MF-00001-D1', 'MF-00001-D2'],
    };
    render(
      <MemoryRouter>
        <Cuenta sesion={sesionConCupones} mangas={mangasCatalogo} alActualizarSesion={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByText('MF-00001-D1 · Descuento de $2.300')).toBeTruthy();
    expect(screen.getByText('MF-00001-D2 · Descuento de $2.300')).toBeTruthy();

    cleanup();
    const fisico: CarritoItem = {
      ...itemDigital,
      id: 'one-piece-fisico',
      titulo: 'One Piece - Tomo 1',
      precio: 8990,
      formato: 'Físico',
    };
    const { alActualizarSesion: actualizarTrasCompraFisica } = montarCarrito([fisico], sesionConCupones);
    fireEvent.click(screen.getByLabelText('Retiro en tienda'));
    fireEvent.click(screen.getByLabelText('Usar cupón de descuento'));
    expect(screen.getByText('−$2.300')).toBeTruthy();
    confirmarCompra();

    expect(actualizarTrasCompraFisica).toHaveBeenCalledWith(expect.objectContaining({
      puntos: 60,
      points: 60,
      cuponesFisicos: ['MF-00001-D2'],
      compras: [expect.objectContaining({
        descuentoCupon: 2300,
        cuponAplicado: 'MF-00001-D1',
        total: 6690,
        puntosGanados: 60,
      })],
    }));
    expect(screen.getByText('¡Sumaste 60 puntos por tu compra física!')).toBeTruthy();
  });
});
