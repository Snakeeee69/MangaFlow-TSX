import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cargarCatalogo,
  esMangaActivo,
  mangasCatalogo,
  slugManga,
  guardarCatalogo,
} from '../data/catalogo';

describe('catálogo', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('normaliza acentos, mayúsculas y espacios para crear un slug', () => {
    expect(slugManga('  Acción y Aventura  ')).toBe('accion-y-aventura');
  });

  it('elimina el número de tomo del título al generar el slug', () => {
    expect(slugManga('One Piece #12')).toBe('one-piece');
  });

  it('normaliza el alias conocido de Love is War', () => {
    expect(slugManga('Love Is War')).toBe('kaguya-sama-love-is-war');
  });

  it('considera activo un manga sin estado explícito', () => {
    expect(esMangaActivo(mangasCatalogo[0])).toBe(true);
  });

  it('considera inactivo un manga archivado', () => {
    expect(esMangaActivo({ ...mangasCatalogo[0], activo: false })).toBe(false);
  });

  it('usa el catálogo inicial si todavía no hay datos locales', () => {
    expect(cargarCatalogo()).toBe(mangasCatalogo);
  });

  it('recupera el precio digital inicial para One Piece en datos antiguos', () => {
    const onePiece = mangasCatalogo.find(manga => manga.id === 12);
    if (!onePiece) throw new Error('Falta One Piece en el catálogo de prueba.');
    const versionAntigua = { ...onePiece };
    delete versionAntigua.precioDigital;
    localStorage.setItem('mangaFlow_catalogo', JSON.stringify([versionAntigua]));

    expect(cargarCatalogo()[0].precioDigital).toBe(3990);
  });

  it('omite entradas inválidas del catálogo guardado', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('mangaFlow_catalogo', JSON.stringify([
      mangasCatalogo[0],
      { id: 'incorrecto', titulo: 'Sin precio' },
    ]));

    expect(cargarCatalogo()).toHaveLength(1);
    expect(cargarCatalogo()[0].id).toBe(mangasCatalogo[0].id);
  });

  it('recupera el catálogo inicial si el JSON guardado no puede leerse', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('mangaFlow_catalogo', '{no-json');

    expect(cargarCatalogo()).toBe(mangasCatalogo);
  });

  it('persiste el catálogo actualizado', () => {
    const actualizado = [{ ...mangasCatalogo[0], stock: 42 }];
    guardarCatalogo(actualizado);

    expect(JSON.parse(localStorage.getItem('mangaFlow_catalogo') ?? '[]')).toEqual(actualizado);
  });
});
