import { beforeEach, describe, expect, it } from 'vitest';
import { cargarPedidosAdmin } from '../data/pedidosAdmin';

describe('pedidos de administración', () => {
  beforeEach(() => {
    localStorage.clear();
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
});
