import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calcularPrecioDetalle,
  validarRangoEnDisponibilidad,
  formatearMoneda,
  formatearFecha,
  hoyString,
  sumarDias,
} from '../utils/pricing';
import { Button } from '../components/ui/Button';
import { getEstadoPublicacionBadge } from '../utils/formatters';

export const VehicleDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const paramInicio = searchParams.get('inicio');
  const paramFin = searchParams.get('fin');

  const navigate = useNavigate();
  const {
    getPublicacionCompleta,
    getDisponibilidadesPorPublicacion,
    agregarAlCarrito,
    currentUser,
  } = useApp();

  const publicacion = id ? getPublicacionCompleta(id) : undefined;
  const rangosDisponibilidad = id ? getDisponibilidadesPorPublicacion(id) : [];

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const hoy = hoyString();
  const [fechaInicio, setFechaInicio] = useState(() => {
    if (paramInicio && paramInicio >= hoy) return paramInicio;
    if (rangosDisponibilidad.length > 0 && rangosDisponibilidad[0].fechaInicio >= hoy) {
      return rangosDisponibilidad[0].fechaInicio;
    }
    return sumarDias(hoy, 1);
  });

  const [fechaFin, setFechaFin] = useState(() => {
    if (paramFin && paramFin > fechaInicio) return paramFin;
    return sumarDias(fechaInicio, 3);
  });

  const [cartError, setCartError] = useState<string | null>(null);

  if (!publicacion) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1b1c1a]">Publicación no encontrada</h2>
        <p className="text-xs sm:text-sm text-[#4b463f]">
          La publicación solicitada no existe o no se encuentra disponible.
        </p>
        <Link to="/">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Volver al catálogo
          </Button>
        </Link>
      </div>
    );
  }

  const v = publicacion.vehiculo;
  const u = publicacion.ubicacion;
  const imagenes = v?.imagenes || [];
  const fotoActual =
    imagenes[activePhotoIndex]?.url ||
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';

  const esPropietario = currentUser?.idUsuario === v?.idUsuarioPropietario;
  const publicacionDisponibleParaAlquiler = publicacion.estado === 'ACTIVA';

  const calculo = useMemo(() => {
    return calcularPrecioDetalle(
      publicacion.precioDia,
      publicacion.descuentoPorcentaje,
      fechaInicio,
      fechaFin
    );
  }, [publicacion.precioDia, publicacion.descuentoPorcentaje, fechaInicio, fechaFin]);

  const cabeEnDisponibilidad = useMemo(() => {
    return validarRangoEnDisponibilidad(fechaInicio, fechaFin, rangosDisponibilidad);
  }, [fechaInicio, fechaFin, rangosDisponibilidad]);

  const handleAddToCart = () => {
    setCartError(null);

    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (fechaFin <= fechaInicio) {
      setCartError('La fecha de devolución debe ser posterior a la fecha de retiro.');
      return;
    }

    if (!cabeEnDisponibilidad) {
      setCartError(
        'El período seleccionado no cabe dentro de un rango de disponibilidad habilitado para esta publicación.'
      );
      return;
    }

    const res = agregarAlCarrito(publicacion.idPublicacion, fechaInicio, fechaFin);
    if (res.ok) {
      navigate('/carrito');
    } else {
      setCartError(res.message || 'No se pudo agregar al carrito.');
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Top back bar & owner state banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </Link>

        {esPropietario && (
          <div className="inline-flex items-center gap-2 bg-[#f4efeb] border border-[#e8e2d8] px-3 py-1.5 rounded-[4px] text-xs text-[#4b463f]">
            <span className="font-semibold text-[#1b1c1a]">Vista de propietario:</span>
            <span
              className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold ${
                getEstadoPublicacionBadge(publicacion.estado).classes
              }`}
            >
              {getEstadoPublicacionBadge(publicacion.estado).label}
            </span>
            <Link
              to={`/publicaciones/${publicacion.idPublicacion}/editar`}
              className="text-[#755a2a] hover:underline ml-2 font-semibold"
            >
              Editar publicación
            </Link>
          </div>
        )}
      </div>

      {!publicacionDisponibleParaAlquiler && (
        <div className="p-4 bg-[#f4efeb] border border-[#e8e2d8] rounded-[8px] flex items-center gap-3 text-xs text-[#4b463f]">
          <ShieldAlert className="w-5 h-5 text-[#755a2a] shrink-0" />
          <div>
            <p className="font-bold text-[#1b1c1a]">
              Esta publicación se encuentra {publicacion.estado.toLowerCase()}
            </p>
            <p>
              No está visible en el catálogo público ni admite nuevas reservas en este momento.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left Details & Right Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (7 cols): Gallery & Information */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Photo & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-[#f4efeb] rounded-[8px] overflow-hidden border border-[#e8e2d8]">
              <img
                src={fotoActual}
                alt={`${v?.marca} ${v?.modelo}`}
                className="w-full h-full object-cover"
              />
              {publicacion.descuentoPorcentaje > 0 && (
                <div className="absolute top-4 left-4 bg-[#755a2a] text-white text-[11px] font-bold tracking-[0.06em] px-2.5 py-1 rounded-[3px] shadow-xs">
                  -{publicacion.descuentoPorcentaje}% DESCUENTO
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {imagenes.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {imagenes.map((img, idx) => (
                  <button
                    key={img.idImagenVehiculo}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-[4px] overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activePhotoIndex === idx
                        ? 'border-[#755a2a]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Vehicle Specs */}
          <div className="space-y-4 border-b border-[#e8e2d8] pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#755a2a]">
                {v?.tipoVehiculo}
              </span>
              <h1 className="font-serif text-3xl font-normal text-[#15110d] mt-1">
                {v?.marca} {v?.modelo}
              </h1>
              <p className="text-xs text-[#7d766e] mt-1">
                Año {v?.anio} · {v?.color} · Patente {v?.patente}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#f4efeb] rounded-[4px] border border-[#e8e2d8]">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e] block">
                  Capacidad
                </span>
                <span className="text-xs font-semibold text-[#1b1c1a] flex items-center gap-1.5 mt-1">
                  <Users className="w-3.5 h-3.5 text-[#755a2a]" />
                  {v?.cantidadAsientos} pasajeros
                </span>
              </div>

              <div className="p-3 bg-[#f4efeb] rounded-[4px] border border-[#e8e2d8]">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e] block">
                  Retiro y entrega
                </span>
                <span className="text-xs font-semibold text-[#1b1c1a] flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-[#755a2a]" />
                  {publicacion.horaRetiroDevolucion} hs fija
                </span>
              </div>

              <div className="p-3 bg-[#f4efeb] rounded-[4px] border border-[#e8e2d8] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e] block">
                  Zona
                </span>
                <span className="text-xs font-semibold text-[#1b1c1a] flex items-center gap-1.5 mt-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#755a2a] shrink-0" />
                  {u?.localidad || u?.ciudad}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 border-b border-[#e8e2d8] pb-6">
            <h2 className="font-serif text-lg text-[#1b1c1a]">Descripción</h2>
            <p className="text-xs sm:text-sm text-[#4b463f] leading-[1.7] whitespace-pre-line">
              {publicacion.descripcion || 'Sin descripción adicional provista por el propietario.'}
            </p>
          </div>

          {/* Location details */}
          <div className="space-y-3 border-b border-[#e8e2d8] pb-6">
            <h2 className="font-serif text-lg text-[#1b1c1a]">Punto de retiro y devolución</h2>
            <div className="bg-white border border-[#e8e2d8] rounded-[4px] p-4 text-xs text-[#4b463f] space-y-1">
              <p className="font-semibold text-sm text-[#1b1c1a]">{u?.direccion}</p>
              <p>
                {u?.zona ? `${u.zona} · ` : ''}
                {u?.localidad}, {u?.ciudad} ({u?.codigoPostal}), {u?.provincia}
              </p>
              <p className="text-[11px] text-[#7d766e] pt-1">
                Horario fijo fijado por el propietario: {publicacion.horaRetiroDevolucion} hs.
              </p>
            </div>
          </div>

          {/* Availability Ranges Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-[#1b1c1a]">
                Períodos habilitados para reserva
              </h2>
              <span className="text-xs text-[#7d766e]">
                {rangosDisponibilidad.length} rangos configurados
              </span>
            </div>

            <p className="text-xs text-[#7d766e]">
              Las reservas deben caber íntegramente dentro de alguno de estos rangos:
            </p>

            {rangosDisponibilidad.length === 0 ? (
              <p className="text-xs text-[#9b2c2c] bg-[#ffdad6]/30 p-3 rounded-[4px] border border-[#9b2c2c]/30">
                Esta publicación no tiene rangos de disponibilidad configurados actualmente.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rangosDisponibilidad.map((rango) => (
                  <div
                    key={rango.idDisponibilidad}
                    className="flex items-center gap-2 text-xs bg-white border border-[#e8e2d8] p-2.5 rounded-[4px]"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#755a2a]" />
                    <span className="font-medium text-[#1b1c1a]">
                      {formatearFecha(rango.fechaInicio)} al {formatearFecha(rango.fechaFin)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Booking Box */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-6">
            {/* Daily Price Header */}
            <div className="border-b border-[#f4efeb] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e] block">
                Tarifa diaria
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-serif font-semibold text-[#15110d]">
                  {formatearMoneda(calculo.precioDiaFinal)}
                </span>
                <span className="text-xs text-[#7d766e]">/ día</span>
                {publicacion.descuentoPorcentaje > 0 && (
                  <span className="text-xs text-[#7d766e] line-through ml-1">
                    {formatearMoneda(publicacion.precioDia)}
                  </span>
                )}
              </div>
              {publicacion.descuentoPorcentaje > 0 && (
                <p className="text-xs text-[#755a2a] font-medium mt-1">
                  Incluye {publicacion.descuentoPorcentaje}% de descuento diario
                </p>
              )}
            </div>

            {/* Date Pickers */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e]">
                    Retiro
                  </label>
                  <input
                    type="date"
                    min={hoy}
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d8] rounded-[4px] text-xs text-[#1b1c1a] focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
                  />
                  <span className="text-[10px] text-[#7d766e] block">
                    A las {publicacion.horaRetiroDevolucion} hs
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e]">
                    Devolución
                  </label>
                  <input
                    type="date"
                    min={fechaInicio || hoy}
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d8] rounded-[4px] text-xs text-[#1b1c1a] focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
                  />
                  <span className="text-[10px] text-[#7d766e] block">
                    A las {publicacion.horaRetiroDevolucion} hs
                  </span>
                </div>
              </div>

              {/* Range validity feedback */}
              {cabeEnDisponibilidad ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-[4px] border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Fechas dentro del rango disponible</span>
                </div>
              ) : (
                <div className="flex items-start gap-1.5 text-xs text-[#9b2c2c] bg-[#ffdad6]/30 p-2.5 rounded-[4px] border border-[#9b2c2c]/30">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    El rango seleccionado no cabe completo dentro de una disponibilidad habilitada.
                  </span>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-[#f4efeb] pt-4 space-y-2 text-xs text-[#4b463f]">
              <div className="flex justify-between">
                <span>
                  {formatearMoneda(calculo.precioDiaBase)} x {calculo.dias} {calculo.dias === 1 ? 'día' : 'días'}
                </span>
                <span>{formatearMoneda(calculo.subtotalBruto)}</span>
              </div>

              {calculo.montoDescuento > 0 && (
                <div className="flex justify-between text-[#755a2a] font-medium">
                  <span>Descuento aplicado ({calculo.descuentoPorcentaje}%):</span>
                  <span>- {formatearMoneda(calculo.montoDescuento)}</span>
                </div>
              )}

              <div className="flex justify-between font-serif text-lg text-[#15110d] pt-2 border-t border-[#f4efeb]">
                <span>Total estimado</span>
                <span>{formatearMoneda(calculo.total)}</span>
              </div>
            </div>

            {/* Error message */}
            {cartError && (
              <p className="text-xs text-[#9b2c2c] bg-[#ffdad6]/30 p-2.5 rounded-[4px] border border-[#9b2c2c]/30">
                {cartError}
              </p>
            )}

            {/* Action Button */}
            <div>
              {publicacionDisponibleParaAlquiler ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#15110d]"
                  disabled={!cabeEnDisponibilidad || esPropietario}
                  onClick={handleAddToCart}
                >
                  {esPropietario ? 'Eres el propietario de este vehículo' : 'Agregar al carrito'}
                </Button>
              ) : (
                <Button variant="outline" size="lg" className="w-full" disabled>
                  Publicación no disponible para alquiler
                </Button>
              )}
            </div>

            <p className="text-[11px] text-center text-[#7d766e]">
              El período quedará reservado provisionalmente durante 15 minutos en tu carrito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
