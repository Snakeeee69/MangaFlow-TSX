import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  normalizarCarrito,
} from '../data/carrito';

describe('carrito', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('normaliza cantidades, rutas y campos faltantes de datos antiguos', () => {
    const [item] = normalizarCarrito([{
      id: 7,
      titulo: '  One Piece  ',
      precio: 1000,
      quantity: 2.8,
      imagen: '../images/one-piece.jpg',
    }]);

    expect(item).toMatchObject({
      id: 'legacy-7-one-piece',
      titulo: 'One Piece',
      quantity: 2,
      imagen: '/images/one-piece.jpg',
      demografia: 'Manga',
      formato: 'Físico',
    });
  });
});
