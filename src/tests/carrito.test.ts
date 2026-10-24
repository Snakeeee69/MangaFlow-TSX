import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cargarCarrito,
  contarItemsCarrito,
  crearCarritoItem,
  formatearCLP,
  normalizarCarrito,
} from '../data/carrito';

describe('carrito', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('crea productos físicos por defecto con cantidad uno', () => {
    const item = crearCarritoItem('One Piece', 8990, 'Shōnen', '/one-piece.jpg');

    expect(item.formato).toBe('Físico');
    expect(item.quantity).toBe(1);
    expect(item.id).toBe('one-piece-físico');
  });

  it('crea un identificador distinto por formato y conserva el id del manga', () => {
    const item = crearCarritoItem('One Piece', 3990, 'Shōnen', '/one-piece.jpg', 'Digital', 12);

    expect(item.id).toBe('one-piece-digital');
    expect(item.mangaId).toBe(12);
  });

  it('devuelve una lista vacía e informa si el carrito guardado no es una lista', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(normalizarCarrito(null)).toEqual([]);
    expect(error).toHaveBeenCalledOnce();
  });

  it('descarta productos con título vacío o precio inválido', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const resultado = normalizarCarrito([
      { titulo: '   ', precio: 100 },
      { titulo: 'One Piece', precio: Number.NaN },
      { titulo: 'Naruto', precio: 200 },
    ]);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe('Naruto');
    expect(error).toHaveBeenCalledTimes(2);
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

  it('reemplaza una cantidad no válida por uno y usa una portada por defecto', () => {
    const [item] = normalizarCarrito([{
      titulo: 'Naruto',
      precio: 0,
      quantity: Number.POSITIVE_INFINITY,
      imagen: '',
    }]);

    expect(item.quantity).toBe(1);
    expect(item.imagen).toBe('/images/logo/logoMangaFlow.png');
    expect(item.id).toBe('naruto-fisico');
  });

  it('carga primero el carrito guardado en la clave principal', () => {
    localStorage.setItem('cart', JSON.stringify([{ id: 'main', titulo: 'One Piece', precio: 100 }]));
    localStorage.setItem('mangaFlow_cart', JSON.stringify([{ id: 'legacy', titulo: 'Naruto', precio: 200 }]));

    expect(cargarCarrito().map(item => item.id)).toEqual(['main']);
  });

  it('continúa con la clave antigua si la principal contiene JSON inválido', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('cart', '{mal json');
    localStorage.setItem('mangaFlow_cart', JSON.stringify([{ id: 'legacy', titulo: 'Naruto', precio: 200 }]));

    expect(cargarCarrito().map(item => item.id)).toEqual(['legacy']);
  });

  it('cuenta unidades, no solo líneas de producto', () => {
    expect(contarItemsCarrito([
      crearCarritoItem('One Piece', 100, 'Shōnen', '/', 'Digital'),
      { ...crearCarritoItem('Naruto', 100, 'Shōnen', '/'), quantity: 3 },
    ])).toBe(4);
  });

  it('formatea importes redondeados como pesos chilenos', () => {
    expect(formatearCLP(1000)).toBe('$1.000');
  });
});
