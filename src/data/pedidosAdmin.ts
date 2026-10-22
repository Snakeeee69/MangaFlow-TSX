import type { CompraSesion } from './sesion';

interface PerfilConPedidos {
  email?: unknown;
  nombre?: unknown;
  compras?: unknown;
}

export interface PedidoAdmin {
  cliente: string;
  nombreCliente: string;
  compra: CompraSesion;
}

const clavePerfil = 'mangaFlow_usuario_';

const esCompraValida = (valor: unknown): valor is CompraSesion => {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) return false;
  const compra = valor as Record<string, unknown>;
  return typeof compra.id === 'string'
    && typeof compra.folio === 'string'
    && typeof compra.fecha === 'string'
    && Number.isFinite(Date.parse(compra.fecha))
    && typeof compra.total === 'number'
    && Number.isFinite(compra.total)
    && Array.isArray(compra.items);
};

export const cargarPedidosAdmin = (): PedidoAdmin[] => {
  const pedidos: PedidoAdmin[] = [];

  for (let indice = 0; indice < localStorage.length; indice += 1) {
    const clave = localStorage.key(indice);
    if (!clave?.startsWith(clavePerfil)) continue;

    try {
      const perfilGuardado: unknown = JSON.parse(localStorage.getItem(clave) ?? 'null');
      if (
        typeof perfilGuardado !== 'object'
        || perfilGuardado === null
        || Array.isArray(perfilGuardado)
      ) {
        console.error(`Se omitió el perfil local "${clave}" porque tiene un formato inválido.`);
        continue;
      }

      const perfil = perfilGuardado as PerfilConPedidos;
      if (!Array.isArray(perfil.compras)) continue;

      perfil.compras.forEach((compra: unknown) => {
        if (!esCompraValida(compra)) {
          console.error(`Se omitió una compra del perfil local "${clave}" porque tiene un formato inválido.`);
          return;
        }

        pedidos.push({
          cliente: typeof perfil.email === 'string' ? perfil.email : clave.slice(clavePerfil.length),
          nombreCliente: typeof perfil.nombre === 'string' ? perfil.nombre : 'Cliente',
          compra,
        });
      });
    } catch (error) {
      console.error(`No se pudieron leer los pedidos del perfil local "${clave}".`, error);
    }
  }

  return pedidos.sort((a, b) => Date.parse(b.compra.fecha) - Date.parse(a.compra.fecha));
};

export const suscribirPedidosAdmin = (actualizar: () => void) => {
  window.addEventListener('mangaflow:pedidos-actualizados', actualizar);
  window.addEventListener('storage', actualizar);
  return () => {
    window.removeEventListener('mangaflow:pedidos-actualizados', actualizar);
    window.removeEventListener('storage', actualizar);
  };
};
