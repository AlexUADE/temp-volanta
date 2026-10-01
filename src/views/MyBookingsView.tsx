import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowRight,
  CreditCard,
  Banknote,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EstadoReserva } from '../types';
import { formatearMoneda, formatearFecha } from '../utils/pricing';
import {
  getEstadoReservaBadge,
  getEstadoPagoBadge,
  getMetodoPagoLabel,
} from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export const MyBookingsView: React.FC = () => {
  const { getReservasUsuario, currentUser } = useApp();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState<EstadoReserva | 'TODAS'>('TODAS');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">Inicia sesión</h2>
        <p className="text-sm text-[#4b463f]">
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

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e4e2df] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#755a2a] font-semibold block mb-1">
          Historial de alquileres
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#15110d]">Mis Reservas</h1>
        <p className="text-sm text-[#4b463f] mt-1">
          Supervisa el estado de tus solicitudes, confirmaciones y pagos asociados.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-[#e4e2df] pb-3 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
        {(['TODAS', 'CONFIRMADA', 'PENDIENTE', 'RECHAZADA', 'CANCELADA', 'FINALIZADA'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-[#15110d] text-white'
                  : 'text-[#4b463f] hover:text-[#1b1c1a] hover:bg-[#efeeeb]'
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
            const badgePago = pago ? getEstadoPagoBadge(pago.estado) : null;

            return (
              <div
                key={res.idReserva}
                className="bg-white border border-[#e4e2df] hover:border-[#cec5bc] rounded-lg p-5 shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side: Photo & details */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-36 aspect-[16/10] sm:aspect-[4/3] bg-[#efeeeb] rounded-md overflow-hidden shrink-0">
                    <img
                      src={portada}
                      alt={`${v?.marca} ${v?.modelo}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7d766e]">
                        #{res.idReserva}
                      </span>
                      <span className="text-[#cec5bc]">·</span>
                      <span className="text-xs text-[#7d766e]">
                        Creada el {formatearFecha(res.fechaCreacion)}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#15110d]">
                      {v?.marca} {v?.modelo} ({v?.anio})
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#4b463f]">
                      <span className="flex items-center gap-1 font-medium text-[#1b1c1a]">
                        <CalendarDays className="w-3.5 h-3.5 text-[#755a2a]" />
                        {formatearFecha(res.fechaInicio)} al {formatearFecha(res.fechaFin)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7d766e]" />
                        {u?.localidad || u?.ciudad}, {u?.ciudad}
                      </span>
                      {pub?.horaRetiroDevolucion && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#7d766e]" />
                          {pub.horaRetiroDevolucion} hs
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Status tags, Amount, CTA */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-[#efeeeb]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold ${badgeReserva.classes}`}
                    >
                      {badgeReserva.label}
                    </span>
                    {badgePago && (
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${badgePago.classes}`}
                      >
                        {badgePago.label}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#7d766e] block">Total pactado</span>
                    <span className="text-base font-bold text-[#15110d]">
                      {formatearMoneda(res.total)}
                    </span>
                  </div>

                  <Link to={`/reservas/${res.idReserva}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Ver detalle
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
