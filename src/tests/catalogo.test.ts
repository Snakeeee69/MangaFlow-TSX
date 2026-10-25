import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  guardarCatalogo,
  mangasCatalogo,
} from '../data/catalogo';

describe('catálogo', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('persiste el catálogo actualizado', () => {
    const actualizado = [{ ...mangasCatalogo[0], stock: 42 }];
    guardarCatalogo(actualizado);

    expect(JSON.parse(localStorage.getItem('mangaFlow_catalogo') ?? '[]')).toEqual(actualizado);
  });
});
