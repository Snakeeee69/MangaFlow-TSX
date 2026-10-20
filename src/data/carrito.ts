export interface CarritoItem {
  id: string;
  titulo: string;
  precio: number;
  demografia: string;
  imagen: string;
  formato: string;
  quantity: number;
  mangaId?: number;
}

export const crearCarritoItem = (
  titulo: string,
  precio: number,
  demografia: string,
  imagen: string,
  formato = 'Físico',
  mangaId?: number,
): CarritoItem => ({
  id: `${titulo.trim().toLocaleLowerCase('es').replace(/[^a-z0-9]+/g, '-')}-${formato.toLocaleLowerCase('es')}`,
  titulo,
  precio,
  demografia,
  imagen,
  formato,
  quantity: 1,
  mangaId,
});

const normalizarRutaImagen = (imagen: unknown) => {
  if (typeof imagen !== 'string' || !imagen.trim()) return '/images/logo/logoMangaFlow.png';
  if (imagen.startsWith('/')) return imagen;
  return `/${imagen.replace(/^(\.\.\/)+/, '')}`;
};

export const normalizarCarrito = (valor: unknown): CarritoItem[] => {
  if (!Array.isArray(valor)) {
    console.error('Los datos guardados del carrito no tienen el formato de lista esperado.');
    return [];
  }

  return valor.flatMap((entrada: unknown) => {
    if (typeof entrada !== 'object' || entrada === null || Array.isArray(entrada)) {
      console.error('Se omitió un producto del carrito con formato inválido.');
      return [];
    }

    const item = entrada as Record<string, unknown>;
    if (
      (typeof item.titulo !== 'string' || !item.titulo.trim())
      || typeof item.precio !== 'number'
      || !Number.isFinite(item.precio)
      || item.precio < 0
    ) {
      console.error('Se omitió un producto del carrito con título o precio inválido.');
      return [];
    }

    const quantity = typeof item.quantity === 'number' && Number.isFinite(item.quantity)
      ? Math.max(1, Math.floor(item.quantity))
      : 1;
    const titulo = item.titulo.trim();

    return [{
      id: typeof item.id === 'string' && item.id
        ? item.id
        : typeof item.id === 'number'
          ? `legacy-${item.id}-${titulo.toLocaleLowerCase('es').replace(/[^a-z0-9]+/g, '-')}`
          : `${titulo.toLocaleLowerCase('es').replace(/[^a-z0-9]+/g, '-')}-fisico`,
      titulo,
      precio: item.precio,
      demografia: typeof item.demografia === 'string' ? item.demografia : 'Manga',
      imagen: normalizarRutaImagen(item.imagen),
      formato: typeof item.formato === 'string' ? item.formato : 'Físico',
      quantity,
      mangaId: typeof item.mangaId === 'number' ? item.mangaId : undefined,
    }];
  });
};

export const cargarCarrito = (): CarritoItem[] => {
  for (const clave of ['cart', 'mangaFlow_cart']) {
    const guardado = localStorage.getItem(clave);
    if (!guardado) continue;

    try {
      return normalizarCarrito(JSON.parse(guardado));
    } catch (error) {
      console.error(`No se pudo leer el carrito guardado en "${clave}".`, error);
    }
  }

  return [];
};

export const contarItemsCarrito = (items: CarritoItem[]) => (
  items.reduce((total, item) => total + item.quantity, 0)
);

export const formatearCLP = (monto: number) => (
  `$${Math.round(monto).toLocaleString('es-CL')}`
);
