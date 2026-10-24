import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cargarMetricasAdmin,
  registrarVisita,
  suscribirMetricasAdmin,
} from '../data/metricasAdmin';

const fechaHoy = () => {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
};

describe('métricas locales de administración', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('registra una visita para hoy y notifica a los suscriptores', () => {
    const actualizar = vi.fn();
    const cancelar = suscribirMetricasAdmin(actualizar);
    registrarVisita();

    expect(JSON.parse(localStorage.getItem('mangaFlow_visitas_diarias') ?? '{}')[fechaHoy()]).toBe(1);
    expect(actualizar).toHaveBeenCalledOnce();
    cancelar();
  });

  it('acumula visitas repetidas en la fecha actual', () => {
    registrarVisita();
    registrarVisita();

    expect(JSON.parse(localStorage.getItem('mangaFlow_visitas_diarias') ?? '{}')[fechaHoy()]).toBe(2);
  });

  it('resume perfiles, compras, ventas y puntos utilizados', () => {
    const hoy = new Date().toISOString();
    localStorage.setItem('mangaFlow_visitas_diarias', JSON.stringify({ [fechaHoy()]: 3 }));
    localStorage.setItem('mangaFlow_usuario_lector@gmail.com', JSON.stringify({
      email: 'lector@gmail.com',
      registradoEn: hoy,
      compras: [
        { fecha: hoy, total: 3990, descuentoPuntos: 200 },
        { fecha: hoy, total: 1000, descuentoPuntos: 50 },
      ],
    }));

    const metricas = cargarMetricasAdmin();
    const hoyEnGrafico = metricas.dias.find(dia => dia.clave === fechaHoy());

    expect(metricas).toMatchObject({
      visitas: 3,
      registros: 1,
      compras: 2,
      ventas: 4990,
      puntosUsados: 250,
    });
    expect(hoyEnGrafico).toMatchObject({ visitas: 3, registros: 1, compras: 2, ventas: 4990 });
  });

  it('devuelve los últimos siete días aunque no existan perfiles', () => {
    const metricas = cargarMetricasAdmin();

    expect(metricas.dias).toHaveLength(7);
    expect(metricas.visitas).toBe(0);
    expect(metricas.compras).toBe(0);
  });
});
