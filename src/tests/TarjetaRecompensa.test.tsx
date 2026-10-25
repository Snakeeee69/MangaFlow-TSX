import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TarjetaRecompensa } from '../componentes/moleculas/TarjetaRecompensa';
import type { Recompensa } from '../data/recompensas';

afterEach(cleanup);

const recompensa: Recompensa = {
  id: 'test-reward',
  nombre: 'Manga de prueba',
  costoPuntos: 500,
  stock: 3,
  tipo: 'manga',
  descripcion: 'Una recompensa para probar.',
  imagen: '/manga.jpg',
};

describe('TarjetaRecompensa', () => {
  it('muestra correctamente la categoría Novela visual', () => {
    render(
      <TarjetaRecompensa
        recompensa={{ ...recompensa, tipo: 'Novela-visual', nombre: 'Manga Novela Visual' }}
        puntosUsuario={25000}
        usuarioAutenticado
        alCanjear={vi.fn()}
      />,
    );

    expect(screen.getByText('Novela visual')).toBeTruthy();
  });
});
