import { beforeEach, describe, expect, it } from 'vitest';
import { cargarMetricasAdmin } from '../data/metricasAdmin';

const fechaHoy = () => {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
};

describe('métricas locales de administración', () => {
  beforeEach(() => {
    localStorage.clear();
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
});
