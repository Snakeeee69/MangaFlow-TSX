import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AccesoRequerido } from '../componentes/moleculas/AccesoRequerido';
import {
  contarItemsCarrito,
  formatearCLP,
  type CarritoItem,
} from '../data/carrito';
import { PRECIO_MANGA_DIGITAL } from '../data/catalogo';
import { puntosDeSesion, type LibroBiblioteca, type SesionUsuario } from '../data/sesion';

const descuentoCuponDigital = PRECIO_MANGA_DIGITAL;
const puntosPorCadaMilPesosFisicos = 10;

interface Boleta {
  folio: string;
  fecha: string;
  items: CarritoItem[];
  subtotalNeto: number;
  iva: number;
  total: number;
  puntosUsados: number;
  descuentoCupon: number;
  cuponAplicado?: string;
  cuponesGanados: number;
  puntosGanados: number;
  medioPago: string;
  tipoEntrega: 'despacho' | 'retiro' | 'digital';
  direccionEntrega: string;
  tieneProductosDigitales: boolean;
}

type TipoEntrega = 'despacho' | 'retiro';
const mediosPago = ['Débito', 'Crédito', 'Transferencia', 'Efectivo al retirar'];

interface CarritosProps {
  items: CarritoItem[];
  sesion: SesionUsuario | null;
  alActualizarSesion: (sesion: SesionUsuario) => void;
  alCambiarCantidad: (id: string, cambio: number) => void;
  alEliminar: (id: string) => void;
  alVaciar: () => void;
}

export const Carritos = ({
  items,
  sesion,
  alActualizarSesion,
  alCambiarCantidad,
  alEliminar,
  alVaciar,
}: CarritosProps) => {
  const [puntosAplicar, setPuntosAplicar] = useState(0);
  const [usarCupon, setUsarCupon] = useState(false);
  const [boleta, setBoleta] = useState<Boleta | null>(null);
  const [error, setError] = useState('');
  const [medioPago, setMedioPago] = useState('Débito');
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('despacho');
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');

  const usuarioAutenticado = Boolean(sesion && !sesion.isGuest);
  const puntosDisponibles = puntosDeSesion(sesion);
  const cantidadItems = contarItemsCarrito(items);
  const subtotalBruto = items.reduce((total, item) => total + item.precio * item.quantity, 0);
  const cuponesDisponibles = Array.isArray(sesion?.cuponesFisicos) ? sesion.cuponesFisicos : [];
  const tieneProductosFisicos = items.some(item => item.formato.toLocaleLowerCase('es') !== 'digital');
  const tieneProductosDigitales = items.some(item => item.formato.toLocaleLowerCase('es') === 'digital');
  const subtotalFisico = items.reduce(
    (total, item) => total + (item.formato.toLocaleLowerCase('es') !== 'digital' ? item.precio * item.quantity : 0),
    0,
  );
  const cuponAplicable = usarCupon && cuponesDisponibles.length > 0 && tieneProductosFisicos;
  const descuentoCupon = cuponAplicable ? Math.min(descuentoCuponDigital, subtotalFisico) : 0;
  const maxPuntosCanjeables = Math.min(puntosDisponibles, subtotalBruto - descuentoCupon);
  const descuentoPuntos = Math.min(puntosAplicar, maxPuntosCanjeables);
  const puntosDescontadosDeCompraFisica = Math.min(descuentoPuntos, Math.max(0, subtotalFisico - descuentoCupon));
  const puntosGanables = tieneProductosFisicos
    ? Math.floor(Math.max(0, subtotalFisico - descuentoCupon - puntosDescontadosDeCompraFisica) / 1000)
      * puntosPorCadaMilPesosFisicos
    : 0;
  const totalConDescuento = subtotalBruto - descuentoPuntos - descuentoCupon;
  const subtotalNeto = Math.round(totalConDescuento / 1.19);
  const iva = totalConDescuento - subtotalNeto;
  const mediosPagoDisponibles = mediosPago.filter(medio => (
    medio !== 'Efectivo al retirar' || (tieneProductosFisicos && tipoEntrega === 'retiro')
  ));

  const pagar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usuarioAutenticado) {
      setError('Debes iniciar sesión para completar una compra.');
      return;
    }
    if (items.length === 0) return;
    if (tieneProductosFisicos && tipoEntrega === 'despacho' && (!direccion.trim() || !comuna.trim())) {
      setError('Completa la dirección y comuna para despachar los productos físicos.');
      return;
    }
    if (!mediosPago.includes(medioPago)) {
      setError('Selecciona un medio de pago válido.');
      return;
    }

    try {
      if (!sesion) return;
      const puntosGanados = puntosGanables;
      const nuevosPuntos = Math.max(0, puntosDisponibles - descuentoPuntos + puntosGanados);
      const folio = `MF-${String((sesion.compras?.length ?? 0) + 1).padStart(5, '0')}`;
      const fecha = new Date().toISOString();
      const codigoCuponAplicado = cuponAplicable ? cuponesDisponibles[0] : undefined;
      const cantidadCuponesGanados = items
        .filter(item => item.formato.toLocaleLowerCase('es') === 'digital')
        .reduce((total, item) => total + item.quantity, 0);
      const nuevosCupones = Array.from(
        { length: cantidadCuponesGanados },
        (_, indice) => `MF-${folio.slice(-5)}-D${indice + 1}`,
      );
      const itemsComprados = items.map(item => ({
        id: item.id,
        titulo: item.titulo,
        precio: item.precio,
        quantity: item.quantity,
        imagen: item.imagen,
        formato: item.formato,
      }));
      const librosDigitales: LibroBiblioteca[] = items
        .filter(item => item.formato.toLocaleLowerCase('es') === 'digital')
        .map(item => ({
          id: item.id,
          titulo: item.titulo,
          imagen: item.imagen,
          formato: 'Digital',
          fechaAdquisicion: fecha,
          cantidad: item.quantity,
        }));
      const bibliotecaActual = sesion.biblioteca ?? [];
      const bibliotecaActualizada = [...bibliotecaActual];
      librosDigitales.forEach(libro => {
        const existente = bibliotecaActualizada.find(item => item.id === libro.id);
        if (existente) existente.cantidad += libro.cantidad;
        else bibliotecaActualizada.push(libro);
      });
      const tipoEntregaFinal = tieneProductosFisicos
        ? tipoEntrega
        : 'digital';
      const direccionEntrega = tipoEntregaFinal === 'despacho'
        ? `${direccion.trim()}, ${comuna.trim()}`
        : tipoEntregaFinal === 'retiro'
          ? 'Retiro en tienda MangaFlow'
          : 'Entrega digital en Mi Biblioteca';
      alActualizarSesion({
        ...sesion,
        puntos: nuevosPuntos,
        points: nuevosPuntos,
        biblioteca: bibliotecaActualizada,
        cuponesFisicos: [
          ...cuponesDisponibles.filter(codigo => codigo !== codigoCuponAplicado),
          ...nuevosCupones,
        ],
        compras: [{
          id: folio,
          folio,
          fecha,
          total: totalConDescuento,
          subtotalNeto,
          iva,
          descuentoPuntos,
          descuentoCupon,
          cuponAplicado: codigoCuponAplicado,
          puntosGanados,
          medioPago,
          tipoEntrega: tipoEntregaFinal,
          direccionEntrega,
          items: itemsComprados,
        }, ...(sesion.compras ?? [])],
      });
      setBoleta({
        folio,
        fecha: new Date(fecha).toLocaleDateString('sv-SE'),
        items: items.map(item => ({ ...item })),
        subtotalNeto,
        iva,
        total: totalConDescuento,
        puntosUsados: descuentoPuntos,
        descuentoCupon,
        cuponAplicado: codigoCuponAplicado,
        cuponesGanados: cantidadCuponesGanados,
        puntosGanados,
        medioPago,
        tipoEntrega: tipoEntregaFinal,
        direccionEntrega,
        tieneProductosDigitales,
      });
      setError('');
      alVaciar();
      setPuntosAplicar(0);
    } catch (cause) {
      console.error('No se pudo guardar la compra simulada.', cause);
      setError('No se pudo completar la compra. Revisa el almacenamiento del navegador e inténtalo nuevamente.');
    }
  };

  if (!usuarioAutenticado) {
    return (
      <AccesoRequerido
        titulo="Inicia sesión para comprar"
        descripcion="El carrito y el proceso de compra están disponibles solo para usuarios con sesión iniciada."
      />
    );
  }

  return (
    <>
      <main className="container cart-page py-4 py-lg-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to="/catalogo" className="text-secondary cart-back-link" aria-label="Volver al catálogo" title="Volver al catálogo">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          </Link>
          <h1 className="text-white fw-bold fs-3 mb-0">Carrito</h1>
          <span className="cart-page-count">{cantidadItems}</span>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
            {error}
            <button type="button" className="btn-close btn-close-white" aria-label="Cerrar" onClick={() => setError('')} />
          </div>
        )}

        {items.length === 0 ? (
          <div className="cart-empty-state text-center py-5 my-5">
            <i className="fa-solid fa-cart-shopping display-3 text-secondary mb-3" aria-hidden="true" />
            <h2 className="text-white fw-bold mb-2 fs-3">Tu carrito está vacío</h2>
            <p className="text-secondary mb-4 small">Agrega mangas desde el catálogo para continuar.</p>
            <Link to="/catalogo" className="btn-magenta d-inline-block">Ir al catálogo</Link>
          </div>
        ) : (
          <div className="row g-4">
            <section className="col-lg-8" aria-label="Productos en el carrito">
              {items.map(item => (
                <article className="cart-item-card p-3 rounded-4 d-flex align-items-center gap-3 mb-3" key={item.id}>
                  <img
                    className="cart-item-image rounded-3"
                    src={item.imagen}
                    alt={item.titulo}
                    onError={event => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = '/images/logo/logoMangaFlow.png';
                    }}
                  />
                  <div className="flex-grow-1 min-w-0">
                    <h2 className="text-white fw-semibold mb-1 fs-6 text-truncate">{item.titulo}</h2>
                    <p className="text-secondary small mb-0">{item.demografia} · Formato {item.formato}</p>
                    <div className="d-flex align-items-center mt-2 gap-2">
                      <button
                        className="cart-quantity-button"
                        type="button"
                        onClick={() => alCambiarCantidad(item.id, -1)}
                        aria-label={`Disminuir cantidad de ${item.titulo}`}
                      >−</button>
                      <span className="text-white small fw-bold" aria-live="polite">{item.quantity}</span>
                      <button
                        className="cart-quantity-button"
                        type="button"
                        onClick={() => alCambiarCantidad(item.id, 1)}
                        aria-label={`Aumentar cantidad de ${item.titulo}`}
                      >+</button>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <p className="text-white fw-bold mb-1">{formatearCLP(item.precio * item.quantity)}</p>
                    <button
                      className="btn btn-link text-danger p-0 text-decoration-none mt-1"
                      type="button"
                      title="Eliminar producto"
                      aria-label={`Eliminar ${item.titulo} del carrito`}
                      onClick={() => alEliminar(item.id)}
                    >
                      <i className="fa-regular fa-trash-can small" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="col-lg-4">
              <section className="cart-summary p-4 rounded-4">
                <h2 className="text-white fw-semibold mb-4 fs-6">Resumen del pedido</h2>
                <div className="d-flex justify-content-between text-secondary small mb-3">
                  <span>Subtotal ({cantidadItems} {cantidadItems === 1 ? 'artículo' : 'artículos'})</span>
                  <span className="text-white fw-medium">{formatearCLP(subtotalBruto)}</span>
                </div>

                <div className="border-top border-secondary border-opacity-20 pt-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-white small fw-medium">
                      <i className="fa-solid fa-star cart-points-icon me-2" aria-hidden="true" />
                      Usar puntos
                    </span>
                    <span className="text-secondary extra-small">
                      Disponibles: {puntosDisponibles.toLocaleString('es-CL')}
                    </span>
                  </div>
                  <input
                    className="w-100 custom-range mb-2"
                    type="range"
                    min="0"
                    max={maxPuntosCanjeables}
                    step="100"
                    value={Math.min(puntosAplicar, maxPuntosCanjeables)}
                    onChange={event => setPuntosAplicar(Number(event.target.value))}
                    aria-label="Puntos a aplicar como descuento"
                  />
                  <div className="d-flex justify-content-between text-secondary cart-range-labels">
                    <span>0 pts</span>
                    <span className="cart-points-value fw-semibold">
                      {descuentoPuntos > 0 ? `-${formatearCLP(descuentoPuntos)}` : 'Sin descuento'}
                    </span>
                    <span>{maxPuntosCanjeables.toLocaleString('es-CL')} pts</span>
                  </div>
                </div>

                {tieneProductosFisicos && (
                  <fieldset className="checkout-section mb-3">
                    <legend className="text-white small fw-semibold mb-2">Cupón para manga físico</legend>
                    {cuponesDisponibles.length > 0 ? (
                      <label className="checkout-choice">
                        <input
                          type="checkbox"
                          checked={cuponAplicable}
                          onChange={event => setUsarCupon(event.target.checked)}
                          aria-label="Usar cupón de descuento"
                        />
                        <span>
                          Usar cupón de $2.300 ({cuponesDisponibles.length} disponible{cuponesDisponibles.length === 1 ? '' : 's'})
                        </span>
                      </label>
                    ) : (
                      <p className="text-secondary small mb-0">
                        No tienes cupones disponibles. Compra un tomo digital para recibir $2.300 de descuento en una compra física.
                      </p>
                    )}
                  </fieldset>
                )}

                <div className="border-top border-secondary border-opacity-20 pt-3 mb-4">
                  {descuentoCupon > 0 && (
                    <div className="d-flex justify-content-between small text-secondary mb-2">
                      <span>Cupón físico</span>
                      <span className="text-success">−{formatearCLP(descuentoCupon)}</span>
                    </div>
                  )}
                  {descuentoPuntos > 0 && (
                    <div className="d-flex justify-content-between small text-secondary mb-2">
                      <span>Descuento puntos</span>
                      <span className="text-success">−{formatearCLP(descuentoPuntos)}</span>
                    </div>
                  )}
                  {puntosGanables > 0 && (
                    <div className="d-flex justify-content-between small text-secondary mb-2">
                      <span>Puntos por compra física</span>
                      <span className="text-accent">+{puntosGanables} pts</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>Subtotal neto</span><span className="text-white">{formatearCLP(subtotalNeto)}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-2">
                    <span>IVA (19%)</span><span className="text-white">{formatearCLP(iva)}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-6 pt-2 border-top border-secondary border-opacity-20">
                    <span className="text-white">Total</span>
                    <span className="cart-total">{formatearCLP(totalConDescuento)}</span>
                  </div>
                </div>

                <form onSubmit={pagar}>
                  {tieneProductosFisicos && (
                    <fieldset className="checkout-section mb-3">
                      <legend className="text-white small fw-semibold mb-2">Entrega de productos físicos</legend>
                      <div className="d-flex flex-column gap-2">
                        <label className="checkout-choice">
                          <input
                            type="radio"
                            name="tipo-entrega"
                            value="despacho"
                            checked={tipoEntrega === 'despacho'}
                            onChange={() => {
                              setTipoEntrega('despacho');
                              if (medioPago === 'Efectivo al retirar') setMedioPago('Débito');
                            }}
                          />
                          <span>Despacho a domicilio</span>
                        </label>
                        <label className="checkout-choice">
                          <input
                            type="radio"
                            name="tipo-entrega"
                            value="retiro"
                            checked={tipoEntrega === 'retiro'}
                            onChange={() => setTipoEntrega('retiro')}
                          />
                          <span>Retiro en tienda</span>
                        </label>
                      </div>
                      {tipoEntrega === 'despacho' && (
                        <div className="row g-2 mt-1">
                          <div className="col-12">
                            <label className="form-label text-secondary small" htmlFor="checkout-address">Dirección *</label>
                            <input
                              id="checkout-address"
                              className="form-control checkout-input"
                              autoComplete="street-address"
                              value={direccion}
                              onChange={event => setDireccion(event.target.value)}
                              required
                              maxLength={160}
                              placeholder="Calle y número"
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label text-secondary small" htmlFor="checkout-commune">Comuna o ciudad *</label>
                            <input
                              id="checkout-commune"
                              className="form-control checkout-input"
                              autoComplete="address-level2"
                              value={comuna}
                              onChange={event => setComuna(event.target.value)}
                              required
                              maxLength={100}
                              placeholder="Ej. Providencia, Santiago"
                            />
                          </div>
                        </div>
                      )}
                    </fieldset>
                  )}

                  <fieldset className="checkout-section mb-3">
                    <legend className="text-white small fw-semibold mb-2">Medio de pago</legend>
                    <div className="d-flex flex-column gap-2">
                      {mediosPagoDisponibles.map(medio => (
                        <label className="checkout-choice" key={medio}>
                          <input
                            type="radio"
                            name="medio-pago"
                            value={medio}
                            checked={medioPago === medio}
                            onChange={() => setMedioPago(medio)}
                          />
                          <span>{medio}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-secondary cart-simulation-note mt-2 mb-0">
                      Solo seleccionas el medio. No ingreses datos de tarjetas ni cuentas; el pago es simulado.
                    </p>
                  </fieldset>

                  {tieneProductosDigitales && (
                    <p className="checkout-digital-note small mb-3">
                      <i className="fa-solid fa-book-open me-2" aria-hidden="true" />
                      Los mangas digitales se agregarán a Mi Biblioteca al confirmar la compra.
                    </p>
                  )}

                  <button className="btn-magenta w-100 py-3" type="submit">
                    <i className="fa-solid fa-bag-shopping me-2" aria-hidden="true" />
                    Confirmar compra
                  </button>
                  <p className="text-secondary text-center cart-simulation-note mt-3 mb-0">
                    La boleta quedará guardada en Mi cuenta. El envío por correo requiere configurar un servicio de correo.
                  </p>
                </form>
              </section>
            </aside>
          </div>
        )}
      </main>

      {boleta && (
        <div className="receipt-backdrop" role="presentation" onMouseDown={event => {
          if (event.target === event.currentTarget) setBoleta(null);
        }}>
          <section className="receipt-dialog" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
            <header className="receipt-header">
              <div className="d-flex align-items-center gap-3">
                <span className="receipt-success-icon"><i className="fa-solid fa-check" aria-hidden="true" /></span>
                <div>
                  <h2 className="receipt-title" id="receipt-title">Compra aprobada</h2>
                  <p className="small text-white-50 mb-0">Boleta electrónica simulada</p>
                </div>
              </div>
              <button className="reader-close" type="button" aria-label="Cerrar boleta" onClick={() => setBoleta(null)}>
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </header>
            <div className="receipt-body">
              <div className="d-flex justify-content-between text-secondary small mb-3">
                <span>N° {boleta.folio}</span><span>{boleta.fecha}</span>
              </div>
              <div className="receipt-company p-3 rounded-3 mb-4">
                <div className="row g-1 small">
                  <span className="col-5 text-secondary">Razón Social</span><strong className="col-7 text-end">MangaFlow SpA</strong>
                  <span className="col-5 text-secondary">RUT</span><span className="col-7 text-end">77.555.333-2</span>
                  <span className="col-5 text-secondary">Giro</span><span className="col-7 text-end">Comercio electrónico de libros y revistas</span>
                  <span className="col-5 text-secondary">Casa Matriz</span><span className="col-7 text-end">Av. Los Leones 2450, Providencia, Santiago</span>
                </div>
              </div>
              <div className="mb-4">
                {boleta.items.map(item => (
                  <div className="d-flex justify-content-between align-items-center gap-3 mb-2" key={item.id}>
                    <span className="text-white fw-semibold small">
                      {item.titulo} <span className="text-secondary fw-normal">(x{item.quantity})</span>
                    </span>
                    <span className="text-white fw-bold small flex-shrink-0">
                      {formatearCLP(item.precio * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-top border-secondary border-opacity-20 pt-3 mb-4">
                {boleta.descuentoCupon > 0 && (
                  <div className="d-flex justify-content-between text-secondary small mb-2">
                    <span>Cupón físico ({boleta.cuponAplicado})</span>
                    <span className="text-success">−{formatearCLP(boleta.descuentoCupon)}</span>
                  </div>
                )}
                {boleta.puntosUsados > 0 && (
                  <div className="d-flex justify-content-between text-secondary small mb-2">
                    <span>Descuento puntos</span><span className="text-success">−{formatearCLP(boleta.puntosUsados)}</span>
                  </div>
                )}
                {boleta.puntosGanados > 0 && (
                  <div className="d-flex justify-content-between text-secondary small mb-2">
                    <span>Puntos por compra física</span>
                    <span className="text-accent">+{boleta.puntosGanados} pts</span>
                  </div>
                )}
                <div className="d-flex justify-content-between text-secondary small mb-2">
                  <span>Subtotal neto</span><span className="text-white">{formatearCLP(boleta.subtotalNeto)}</span>
                </div>
                <div className="d-flex justify-content-between text-secondary small mb-2">
                  <span>IVA (19%)</span><span className="text-white">{formatearCLP(boleta.iva)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 pt-2 border-top border-secondary border-opacity-20">
                  <span className="text-white">Total</span><span className="cart-total">{formatearCLP(boleta.total)}</span>
                </div>
              </div>
              <div className="receipt-payment p-3 rounded-3 d-flex justify-content-between align-items-center mb-3">
                <span className="text-secondary small">Medio de pago</span>
                <span className="fw-semibold text-white small">{boleta.medioPago} (Simulado)</span>
              </div>
              {boleta.tipoEntrega !== 'digital' && (
                <div className="receipt-payment p-3 rounded-3 d-flex justify-content-between gap-3 mb-3">
                  <span className="text-secondary small flex-shrink-0">Entrega</span>
                  <span className="fw-semibold text-white small text-end">
                    {boleta.tipoEntrega === 'retiro' ? 'Retiro en tienda' : boleta.direccionEntrega}
                  </span>
                </div>
              )}
              <div className="receipt-note p-3 rounded-3 text-center">
                <p className="mb-0 small fw-semibold">
                  {boleta.cuponesGanados > 0
                    ? boleta.cuponesGanados === 1
                      ? '¡Tu cupón de $2.300 se ha añadido a tu cuenta!'
                      : `¡Tus ${boleta.cuponesGanados} cupones de $2.300 se han añadido a tu cuenta!`
                    : boleta.tipoEntrega === 'digital'
                      ? 'Tus mangas digitales ya están en Mi Biblioteca.'
                      : boleta.tieneProductosDigitales
                        ? 'Los mangas digitales ya están en Mi Biblioteca; los físicos seguirán la opción de entrega seleccionada.'
                        : 'Tu compra y boleta están guardadas en Mi cuenta.'}
                  {boleta.puntosGanados > 0 && (
                    <span className="d-block mt-2">
                      ¡Sumaste {boleta.puntosGanados} puntos por tu compra física!
                    </span>
                  )}
                  {boleta.cuponesGanados > 0 && (
                    <span className="d-block mt-2">
                      {boleta.tipoEntrega === 'digital'
                        ? 'Tu manga digital ya está en Mi Biblioteca.'
                        : 'Los mangas digitales ya están en Mi Biblioteca; los físicos seguirán la opción de entrega seleccionada.'}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <footer className="receipt-footer">
              <button className="btn-magenta px-4" type="button" onClick={() => setBoleta(null)}>Cerrar</button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
};