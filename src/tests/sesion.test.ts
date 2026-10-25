import { beforeEach, describe, expect, it } from 'vitest';
import { cargarSesion } from '../data/sesion';

describe('sesion y roles', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('combina el perfil persistido con la sesión activa', () => {
    localStorage.setItem('mangaFlow_usuario_lector@gmail.com', JSON.stringify({
      email: 'lector@gmail.com',
      nombre: 'Nombre guardado',
      puntos: 400,
    }));
    localStorage.setItem('mangaFlow_session', JSON.stringify({
      email: 'lector@gmail.com',
      nombre: 'Nombre actual',
    }));

    expect(cargarSesion()).toMatchObject({
      email: 'lector@gmail.com',
      nombre: 'Nombre actual',
      puntos: 400,
    });
  });
});
