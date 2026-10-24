import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cargarPedidosAdmin, suscribirPedidosAdmin } from '../data/pedidosAdmin';

describe('pedidos de administración', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('devuelve una lista vacía si no hay compras guardadas', () => {
    expect(cargarPedidosAdmin()).toEqual([]);
  });

  it('carga pedidos con datos del cliente y los ordena del más reciente al más antiguo', () => {
    localStorage.setItem('mangaFlow_usuario_lector@gmail.com', JSON.stringify({
      email: 'lector@gmail.com',
      nombre: 'Lector',
      compras: [
        { id: 'old', folio: 'MF-00001', fecha: '2026-01-01', total: 100, items: [] },
        { id: 'new', folio: 'MF-00002', fecha: '2026-02-01', total: 200, items: [] },
      ],
    }));

    expect(cargarPedidosAdmin().map(pedido => pedido.compra.folio)).toEqual(['MF-00002', 'MF-00001']);
    expect(cargarPedidosAdmin()[0]).toMatchObject({
      cliente: 'lector@gmail.com',
      nombreCliente: 'Lector',
    });
  });

  it('omite compras malformadas y registra el problema', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('mangaFlow_usuario_lector@gmail.com', JSON.stringify({
      email: 'lector@gmail.com',
      compras: [{ id: 'broken', total: 'incorrecto' }],
    }));

    expect(cargarPedidosAdmin()).toEqual([]);
    expect(error).toHaveBeenCalledOnce();
  });

  it('notifica cuando cambian los pedidos y permite cancelar la suscripción', () => {
    const actualizar = vi.fn();
    const cancelar = suscribirPedidosAdmin(actualizar);
    window.dispatchEvent(new Event('mangaflow:pedidos-actualizados'));
    expect(actualizar).toHaveBeenCalledOnce();

    cancelar();
    window.dispatchEvent(new Event('mangaflow:pedidos-actualizados'));
    expect(actualizar).toHaveBeenCalledOnce();
  });
});
