import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Clock,
  ArrowRight,
  Calendar,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calcularPrecioDetalle,
  validarRangoEnDisponibilidad,
  formatearMoneda,
  formatearFecha,
  hoyString,
} from '../utils/pricing';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export const CartView: React.FC = () => {
  const {
    carrito,
    vaciarCarrito,
    modificarFechasCarrito,
    getPublicacionCompleta,
    getDisponibilidadesPorPublicacion,
    tiempoRestanteCarrito,
    carritoExpirado,
    currentUser,
  } = useApp();
  const navigate = useNavigate();

  const publicacion = carrito ? getPublicacionCompleta(carrito.idPublicacion) : undefined;
  const rangos = carrito ? getDisponibilidadesPorPublicacion(carrito.idPublicacion) : [];

  const hoy = hoyString();

  const calculo = useMemo(() => {
    if (!publicacion || !carrito) return null;
    return calcularPrecioDetalle(
      publicacion.precioDia,
      publicacion.descuentoPorcentaje,
      carrito.fechaInicio,
      carrito.fechaFin
    );
  }, [publicacion, carrito]);

  const cabeEnDisponibilidad = useMemo(() => {
    if (!carrito) return false;
    return validarRangoEnDisponibilidad(carrito.fechaInicio, carrito.fechaFin, rangos);
  }, [carrito, rangos]);

  const minutes = Math.floor(tiempoRestanteCarrito / 60);
  const seconds = tiempoRestanteCarrito % 60;
  const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1b1c1a]">Inicia sesión</h2>
        <p className="text-xs sm:text-sm text-[#4b463f]">
          Debes iniciar sesión para ver o gestionar tu carrito de reserva.
        </p>
        <Link to="/login">
          <Button variant="primary" size="md">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  if (!carrito || !publicacion) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <EmptyState
          icon={<ShoppingBag className="w-7 h-7 text-[#755a2a]" />}
          title="Tu carrito está vacío"
          description="Explora el catálogo de vehículos disponibles y selecciona las fechas de tu viaje para comenzar una reserva."
          actionText="Explorar vehículos"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  if (carritoExpirado) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#9b2c2c] flex items-center justify-center mx-auto">
          <Clock className="w-5 h-5" />
        </div>
        <h2 className="font-serif text-2xl text-[#1b1c1a]">
          El tiempo de tu carrito ha expirado
        </h2>
        <p className="text-xs sm:text-sm text-[#4b463f]">
          La reserva provisional de 15 minutos caducó para liberar las fechas a otros usuarios.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={vaciarCarrito}>
            Vaciar carrito
          </Button>
          <Link to={`/publicacion/${publicacion.idPublicacion}`}>
            <Button variant="primary" size="sm">
              Seleccionar nuevamente
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const v = publicacion.vehiculo;
  const u = publicacion.ubicacion;
  const portada =
    v?.imagenes?.[0]?.url ||
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header with 15-minute countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d8] pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#755a2a] block mb-1">
            Reserva en curso
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#15110d]">Carrito de Reserva</h1>
          <p className="text-xs sm:text-sm text-[#4b463f] mt-1">
            Revisa las fechas y el desglose de tu alquiler antes de proceder al pago.
          </p>
        </div>

        {/* Expiration Timer Card */}
        <div className="flex items-center gap-3 bg-[#f4efeb] border border-[#e8e2d8] px-4 py-2.5 rounded-[8px]">
          <Clock className="w-4 h-4 text-[#755a2a] animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-[#7d766e] block">
              Tiempo restante:
            </span>
            <span className="font-mono text-sm font-bold text-[#15110d]">
              {formattedTimer} minutos
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Publication Card & Date Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] overflow-hidden shadow-[0_1px_2px_rgba(21,17,13,0.06)]">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-56 aspect-[16/10] sm:aspect-auto bg-[#f4efeb] shrink-0">
                <img
                  src={portada}
                  alt={`${v?.marca} ${v?.modelo}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-[#755a2a] font-bold uppercase tracking-[0.1em]">
                        {v?.tipoVehiculo}
                      </span>
                      <h3 className="font-serif text-lg text-[#15110d]">
                        {v?.marca} {v?.modelo}
                      </h3>
                      <p className="text-xs text-[#7d766e]">
                        Año {v?.anio} · {v?.color} · Patente {v?.patente}
                      </p>
                    </div>

                    <button
                      onClick={vaciarCarrito}
                      className="p-1.5 rounded text-[#7d766e] hover:text-[#9b2c2c] hover:bg-[#ffdad6]/30 transition-colors cursor-pointer"
                      title="Quitar del carrito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-[#4b463f] space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#755a2a]" />
                      <span>{u?.direccion}, {u?.localidad || u?.ciudad}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#755a2a]" />
                      <span>Retiro y entrega fijados a las {publicacion.horaRetiroDevolucion} hs</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f4efeb] flex items-center justify-between text-xs">
                  <span className="text-[#7d766e]">Tarifa diaria base:</span>
                  <span className="font-semibold text-sm text-[#15110d]">
                    {formatearMoneda(publicacion.precioDia)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Date Pickers */}
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-4">
            <h3 className="font-serif text-base text-[#15110d] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#755a2a]" />
              <span>Modificar fechas de alquiler</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e]">
                  Fecha de Retiro
                </label>
                <input
                  type="date"
                  min={hoy}
                  value={carrito.fechaInicio}
                  onChange={(e) => modificarFechasCarrito(e.target.value, carrito.fechaFin)}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d8] rounded-[4px] text-xs text-[#15110d] focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e]">
                  Fecha de Devolución
                </label>
                <input
                  type="date"
                  min={carrito.fechaInicio || hoy}
                  value={carrito.fechaFin}
                  onChange={(e) => modificarFechasCarrito(carrito.fechaInicio, e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d8] rounded-[4px] text-xs text-[#15110d] focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
                />
              </div>
            </div>

            {!cabeEnDisponibilidad && (
              <div className="flex items-start gap-2 p-3 bg-[#ffdad6]/30 border border-[#9b2c2c]/30 rounded-[4px] text-xs text-[#9b2c2c]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Fechas no disponibles:</span>
                  El período elegido no cabe dentro de una disponibilidad configurada para esta publicación. Modifica las fechas para continuar.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout CTA */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-6">
            <h3 className="font-serif text-base text-[#15110d] border-b border-[#f4efeb] pb-3">
              Resumen de la reserva
            </h3>

            {calculo && (
              <div className="space-y-3 text-xs text-[#4b463f]">
                <div className="flex justify-between">
                  <span className="text-[#7d766e]">Período:</span>
                  <span className="font-medium text-[#1b1c1a]">
                    {formatearFecha(carrito.fechaInicio)} al {formatearFecha(carrito.fechaFin)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#7d766e]">Duración:</span>
                  <span className="font-medium text-[#1b1c1a]">
                    {calculo.dias} {calculo.dias === 1 ? 'día' : 'días'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#7d766e]">Tarifa base:</span>
                  <span>{formatearMoneda(calculo.subtotalBruto)}</span>
                </div>

                {calculo.montoDescuento > 0 && (
                  <div className="flex justify-between text-[#755a2a] font-medium">
                    <span>Descuento ({calculo.descuentoPorcentaje}%):</span>
                    <span>- {formatearMoneda(calculo.montoDescuento)}</span>
                  </div>
                )}

                <div className="flex justify-between font-serif text-lg text-[#15110d] pt-3 border-t border-[#f4efeb]">
                  <span>Total estimado</span>
                  <span>{formatearMoneda(calculo.total)}</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full bg-[#15110d]"
                disabled={!cabeEnDisponibilidad || carrito.fechaFin <= carrito.fechaInicio}
                onClick={() => navigate('/checkout')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continuar al pago y confirmación
              </Button>
            </div>

            <p className="text-[11px] text-[#7d766e] text-center">
              Al confirmar, la reserva y el pago se crearán en estado pendiente hasta su acreditación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
