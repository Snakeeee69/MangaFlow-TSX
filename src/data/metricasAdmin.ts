interface CompraRegistrada {
  fecha?: unknown;
  total?: unknown;
  descuentoPuntos?: unknown;
}

interface PerfilRegistrado {
  registradoEn?: unknown;
  compras?: unknown;
}

export interface DiaMetricas {
  clave: string;
  etiqueta: string;
  visitas: number;
  registros: number;
  compras: number;
  ventas: number;
}

export interface MetricasAdmin {
  visitas: number;
  registros: number;
  compras: number;
  ventas: number;
  puntosUsados: number;
  dias: DiaMetricas[];
}

const claveVisitasDiarias = 'mangaFlow_visitas_diarias';
const eventoMetricasActualizadas = 'mangaflow:metricas-actualizadas';
const clavePerfil = 'mangaFlow_usuario_';

const fechaLocal = (fecha: Date) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const fechaValida = (valor: unknown) => {
  if (typeof valor !== 'string') return null;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fechaLocal(fecha);
};

const numeroValido = (valor: unknown) => (
  typeof valor === 'number' && Number.isFinite(valor) && valor > 0 ? valor : 0
);

const emitirActualizacion = () => {
  window.dispatchEvent(new Event(eventoMetricasActualizadas));
};

export const registrarVisita = () => {
  try {
    const visitasGuardadas = localStorage.getItem(claveVisitasDiarias);
    const visitas: Record<string, number> = visitasGuardadas
      ? JSON.parse(visitasGuardadas) as Record<string, number>
      : {};
    const hoy = fechaLocal(new Date());
    visitas[hoy] = numeroValido(visitas[hoy]) + 1;
    localStorage.setItem(claveVisitasDiarias, JSON.stringify(visitas));
    emitirActualizacion();
  } catch (error) {
    console.error('No se pudo registrar la visita en las métricas locales.', error);
  }
};

export const notificarCambioMetricas = emitirActualizacion;

export const cargarMetricasAdmin = (): MetricasAdmin => {
  const dias: DiaMetricas[] = [];
  const porFecha = new Map<string, DiaMetricas>();
  const hoy = new Date();

  for (let desplazamiento = 6; desplazamiento >= 0; desplazamiento -= 1) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - desplazamiento);
    const clave = fechaLocal(fecha);
    const dia: DiaMetricas = {
      clave,
      etiqueta: new Intl.DateTimeFormat('es-CL', { weekday: 'short' }).format(fecha),
      visitas: 0,
      registros: 0,
      compras: 0,
      ventas: 0,
    };
    dias.push(dia);
    porFecha.set(clave, dia);
  }

  try {
    const visitasGuardadas = localStorage.getItem(claveVisitasDiarias);
    if (visitasGuardadas) {
      const visitas: unknown = JSON.parse(visitasGuardadas);
      if (typeof visitas === 'object' && visitas !== null && !Array.isArray(visitas)) {
        Object.entries(visitas).forEach(([fecha, cantidad]) => {
          const dia = porFecha.get(fecha);
          if (dia && typeof cantidad === 'number' && Number.isFinite(cantidad)) {
            dia.visitas = Math.max(0, cantidad);
          }
        });
      } else {
        console.error('El registro de visitas guardado no tiene el formato esperado.');
      }
    }
  } catch (error) {
    console.error('No se pudieron leer las visitas locales para las métricas.', error);
  }

  let registros = 0;
  let compras = 0;
  let ventas = 0;
  let puntosUsados = 0;

  for (let indice = 0; indice < localStorage.length; indice += 1) {
    const clave = localStorage.key(indice);
    if (!clave?.startsWith(clavePerfil)) continue;

    try {
      const perfil: unknown = JSON.parse(localStorage.getItem(clave) ?? 'null');
      if (typeof perfil !== 'object' || perfil === null || Array.isArray(perfil)) {
        console.error(`Se omitió el perfil local "${clave}" por tener formato inválido.`);
        continue;
      }

      const datos = perfil as PerfilRegistrado;
      registros += 1;
      const fechaRegistro = fechaValida(datos.registradoEn);
      if (fechaRegistro) {
        const diaRegistro = porFecha.get(fechaRegistro);
        if (diaRegistro) diaRegistro.registros += 1;
      }

      if (!Array.isArray(datos.compras)) continue;
      datos.compras.forEach((compra: CompraRegistrada) => {
        if (typeof compra !== 'object' || compra === null) return;
        const fechaCompra = fechaValida(compra.fecha);
        const total = numeroValido(compra.total);
        const puntos = numeroValido(compra.descuentoPuntos);
        compras += 1;
        ventas += total;
        puntosUsados += puntos;
        const diaCompra = fechaCompra ? porFecha.get(fechaCompra) : undefined;
        if (diaCompra) {
          diaCompra.compras += 1;
          diaCompra.ventas += total;
        }
      });
    } catch (error) {
      console.error(`No se pudo leer el perfil local "${clave}" para las métricas.`, error);
    }
  }

  return {
    visitas: dias.reduce((total, dia) => total + dia.visitas, 0),
    registros,
    compras,
    ventas,
    puntosUsados,
    dias,
  };
};

export const suscribirMetricasAdmin = (actualizar: () => void) => {
  window.addEventListener(eventoMetricasActualizadas, actualizar);
  window.addEventListener('storage', actualizar);
  return () => {
    window.removeEventListener(eventoMetricasActualizadas, actualizar);
    window.removeEventListener('storage', actualizar);
  };
};
