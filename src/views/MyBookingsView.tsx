import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowRight,
  CreditCard,
  Banknote,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EstadoReserva, Reserva } from '../types';
import { formatearMoneda, formatearFecha } from '../utils/pricing';
import {
  getEstadoReservaBadge,
  getEstadoPagoBadge,
  getMetodoPagoLabel,
} from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export const MyBookingsView: React.FC = () => {
  const { getReservasUsuario, currentUser, simularResultadoMercadoPago } = useApp();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState<EstadoReserva | 'TODAS'>('TODAS');

  // Modal to continue payment for pending MP booking
  const [activeMpModalReserva, setActiveMpModalReserva] = useState<Reserva | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1b1c1a]">Inicia sesión</h2>
        <p className="text-xs sm:text-sm text-[#4b463f]">
          Debes estar autenticado para ver tu historial de reservas.
        </p>
        <Link to="/login">
          <Button variant="primary" size="md">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  const reservas = getReservasUsuario();

  const filtered =
    filterStatus === 'TODAS'
      ? reservas
      : reservas.filter((r) => r.estado === filterStatus);

  const handleMpSimulation = (resultado: 'APROBADO' | 'RECHAZADO') => {
    if (!activeMpModalReserva || !activeMpModalReserva.pago) return;
    simularResultadoMercadoPago(activeMpModalReserva.pago.idPago, resultado);
    setActiveMpModalReserva(null);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e8e2d8] pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#755a2a] block mb-1">
          Historial de alquileres
        </span>
        <h1 className="font-serif text-3xl font-normal text-[#15110d]">Mis Reservas</h1>
        <p className="text-xs sm:text-sm text-[#4b463f] mt-1">
          Supervisa el estado de tus solicitudes, confirmaciones y pagos asociados.
        </p>
      </div>

      {/* Filter tabs (4px radius) */}
      <div className="flex items-center gap-2 border-b border-[#e8e2d8] pb-3 overflow-x-auto text-[11px] font-bold tracking-[0.06em] uppercase">
        {(['TODAS', 'CONFIRMADA', 'PENDIENTE', 'RECHAZADA', 'CANCELADA', 'FINALIZADA'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-[#15110d] text-white'
                  : 'text-[#4b463f] hover:text-[#15110d] hover:bg-[#f4efeb]'
              }`}
            >
              {status === 'TODAS' ? 'Todas' : status} (
              {status === 'TODAS'
                ? reservas.length
                : reservas.filter((r) => r.estado === status).length}
              )
            </button>
          )
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6 text-[#755a2a]" />}
          title="No hay reservas en este estado"
          description="Explora los vehículos disponibles para planificar tu próximo viaje."
          actionText="Explorar catálogo"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((res) => {
            const pub = res.publicacion;
            const v = pub?.vehiculo;
            const u = pub?.ubicacion;
            const pago = res.pago;
            const portada =
              v?.imagenes?.[0]?.url ||
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';

            const badgeReserva = getEstadoReservaBadge(res.estado);
            const badgePago = pago ? getEstadoPagoBadge(pago.estado, pago.metodoPago) : null;

            // Check if user still needs to pay through Mercado Pago
            const pendientePagoMp =
              res.estado === 'PENDIENTE' &&
              pago?.metodoPago === 'MERCADO_PAGO' &&
              pago.estado === 'PENDIENTE';

            return (
              <div
                key={res.idReserva}
                className="bg-white border border-[#e8e2d8] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(21,17,13,0.06)] hover:shadow-[0_8px_24px_rgba(21,17,13,0.08)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side: Photo & details */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-36 aspect-[16/10] sm:aspect-[4/3] bg-[#f4efeb] rounded-[4px] overflow-hidden shrink-0">
                    <img
                      src={portada}
                      alt={`${v?.marca} ${v?.modelo}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7d766e]">
                        #{res.idReserva}
                      </span>
                      <span className="text-[#e8e2d8]">·</span>
                      <span className="text-xs text-[#7d766e]">
                        Registrada el {formatearFecha(res.fechaCreacion)}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#15110d]">
                      {v?.marca} {v?.modelo} ({v?.anio})
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#4b463f]">
                      <span className="flex items-center gap-1 font-medium text-[#1b1c1a]">
                        <CalendarDays className="w-3.5 h-3.5 text-[#755a2a]" />
                        {formatearFecha(res.fechaInicio)} al {formatearFecha(res.fechaFin)}
                      </span>
                      <span className="text-[#e8e2d8]">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7d766e]" />
                        {u?.localidad || u?.ciudad}, {u?.ciudad}
                      </span>
                      {pub?.horaRetiroDevolucion && (
                        <>
                          <span className="text-[#e8e2d8]">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#7d766e]" />
                            {pub.horaRetiroDevolucion} hs
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Status tags, Amount, Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-[#f4efeb]">
                  {/* Distinct statuses: only show what provides distinct value */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-[4px] text-[11px] font-bold ${badgeReserva.classes}`}
                    >
                      {badgeReserva.label}
                    </span>
                    {/* Only show payment badge if it gives distinct info (e.g. approved or cash pending in admin) */}
                    {pago && (pago.estado !== 'PENDIENTE' || pago.metodoPago === 'EFECTIVO') && (
                      <span
                        className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold ${badgePago?.classes}`}
                      >
                        {badgePago?.label}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7d766e] block">
                      Total
                    </span>
                    <span className="font-serif text-base font-semibold text-[#15110d]">
                      {formatearMoneda(res.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* "Continuar pago" button for pending Mercado Pago reservation */}
                    {pendientePagoMp && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-[#15110d]"
                        icon={<ExternalLink className="w-3 h-3" />}
                        onClick={() => setActiveMpModalReserva(res)}
                      >
                        Continuar pago
                      </Button>
                    )}

                    <Link to={`/reservas/${res.idReserva}`}>
                      <Button variant="outline" size="sm" icon={<ArrowRight className="w-3 h-3" />}>
                        Ver detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simulated MP Modal from My Bookings */}
      {activeMpModalReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] shadow-[0_8px_24px_rgba(21,17,13,0.12)] max-w-md w-full p-6 space-y-5 text-[#1b1c1a] animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4efeb]">
              <span className="font-serif font-bold text-base text-[#15110d]">
                Completar pago con Mercado Pago
              </span>
              <span className="text-[10px] font-bold uppercase text-[#755a2a] bg-[#f4efeb] px-2 py-0.5 rounded-[4px]">
                Sandbox
              </span>
            </div>

            <p className="text-xs text-[#4b463f] leading-relaxed">
              Reserva #{activeMpModalReserva.idReserva} por un importe de{' '}
              <strong>{formatearMoneda(activeMpModalReserva.total)}</strong>. Simula la resolución del checkout:
            </p>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                className="bg-emerald-700 hover:bg-emerald-800 text-white w-full justify-start"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => handleMpSimulation('APROBADO')}
              >
                Simular Pago Aprobado (Acredita y confirma)
              </Button>

              <Button
                variant="destructive"
                size="md"
                className="w-full justify-start"
                icon={<XCircle className="w-4 h-4" />}
                onClick={() => handleMpSimulation('RECHAZADO')}
              >
                Simular Pago Rechazado (Fondos insuficientes)
              </Button>
            </div>

            <div className="pt-2 border-t border-[#f4efeb] flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setActiveMpModalReserva(null)}>
                Volver
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
