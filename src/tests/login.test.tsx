import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../paginas/Login';

const iniciarSesion = vi.fn();
const ingresarInvitado = vi.fn();
const cerrarSesion = vi.fn();

const mostrarLogin = () => render(
  <MemoryRouter>
    <Login
      sesion={null}
      alIniciarSesion={iniciarSesion}
      alIngresarInvitado={ingresarInvitado}
      alCerrarSesion={cerrarSesion}
    />
  </MemoryRouter>,
);

const cambiarCampo = (etiqueta: string, valor: string) => {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
};

const abrirRegistro = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Regístrate' }));
};

const completarRegistro = (correo = 'lector.demo@gmail.com', confirmacion = 'manga123') => {
  cambiarCampo('Nombre', 'Lector Demo');
  cambiarCampo('Correo electrónico', correo);
  cambiarCampo('Contraseña', 'manga123');
  cambiarCampo('Confirma tu contraseña', confirmacion);
};

describe('acceso y registro', () => {
  beforeEach(() => {
    localStorage.clear();
    iniciarSesion.mockClear();
    ingresarInvitado.mockClear();
    cerrarSesion.mockClear();
  });

  afterEach(cleanup);

  it('crea una cuenta de usuario con puntos y biblioteca iniciales', () => {
    mostrarLogin();
    abrirRegistro();
    completarRegistro();
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(iniciarSesion).toHaveBeenCalledOnce();
    expect(iniciarSesion).toHaveBeenCalledWith(expect.objectContaining({
      role: 'user',
      email: 'lector.demo@gmail.com',
      nombre: 'Lector Demo',
      isGuest: false,
      wishlist: [],
      compras: [],
      biblioteca: [],
      puntos: expect.any(Number),
    }));
    const puntos = iniciarSesion.mock.calls[0][0].puntos as number;
    expect(puntos).toBeGreaterThanOrEqual(500);
    expect(puntos).toBeLessThanOrEqual(5000);
  });
});
