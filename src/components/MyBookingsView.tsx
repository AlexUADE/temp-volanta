import React, { useState } from 'react';
import { ShieldCheck, Calendar, MapPin, User, ChevronRight, MessageSquare, ExternalLink, HelpCircle } from 'lucide-react';
import { Reservation } from '../types';
import { formatARS } from '../utils/formatters';

interface MyBookingsViewProps {
  reservations: Reservation[];
  onSelectReservation: (res: Reservation) => void;
  onReBook: (vehicleId: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  reservations,
  onSelectReservation,
  onReBook,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const upcomingReservations = reservations.filter((r) => r.bookingStatus === 'Confirmada');
  const completedReservations = reservations.filter((r) => r.bookingStatus === 'Finalizada');
  const cancelledReservations = reservations.filter((r) => r.bookingStatus === 'Cancelada');

  const counts = {
    all: reservations.length,
    active: upcomingReservations.length,
    completed: completedReservations.length,
    cancelled: cancelledReservations.length,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#7D766E] mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#755A2A]" />
          <span>PANEL DE CONDUCTOR</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-1.5">
          Mis Reservas
        </h1>
        <p className="text-xs text-[#7D766E]">
          Consultá el estado de tus alquileres de vehículos, fechas y comprobantes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[#E8E2D8] pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-[#15110D] text-white shadow-xs'
              : 'text-[#4B463F] hover:bg-[#F4EFEB]'
          }`}
        >
          Todas ({counts.all})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'active'
              ? 'bg-[#15110D] text-white shadow-xs'
              : 'text-[#4B463F] hover:bg-[#F4EFEB]'
          }`}
        >
          Activas y Próximas ({counts.active})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'completed'
              ? 'bg-[#15110D] text-white shadow-xs'
              : 'text-[#4B463F] hover:bg-[#F4EFEB]'
          }`}
        >
          Finalizadas ({counts.completed})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'cancelled'
              ? 'bg-[#15110D] text-white shadow-xs'
              : 'text-[#4B463F] hover:bg-[#F4EFEB]'
          }`}
        >
          Canceladas ({counts.cancelled})
        </button>
      </div>

      {/* Active / Próximo Alquiler Highlight Card */}
      {(activeTab === 'all' || activeTab === 'active') && upcomingReservations.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg text-[#15110D]">Próximo Alquiler</h2>
            <span className="text-[11px] text-[#7D766E] font-mono">
              Código: {upcomingReservations[0].id}
            </span>
          </div>

          {upcomingReservations.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Confirmada
                </span>
                <span className="text-xs text-[#7D766E]">
                  Realizada el {res.createdDate}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Image */}
                <div className="lg:col-span-4 relative aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden">
                  <img
                    src={res.vehicle.images[0]}
                    alt={res.vehicle.model}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white/95 text-[10px] font-semibold uppercase tracking-wider text-[#15110D] px-2 py-0.5 rounded">
                    SEDÁN EJECUTIVO
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#15110D] mb-1">
                      {res.vehicle.brand} {res.vehicle.model} {res.vehicle.year}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#7D766E]">
                      <MapPin className="w-3.5 h-3.5 text-[#755A2A]" />
                      <span>
                        {res.vehicle.neighborhood}, {res.vehicle.city} · Retiro en punto acordado
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8F5] p-3 rounded border border-[#E8E2D8]">
                    <div>
                      <span className="text-[10px] text-[#7D766E] uppercase block mb-0.5">PERÍODO DE ALQUILER</span>
                      <div className="font-medium text-[#15110D]">
                        {res.startDate}, {res.startTime}
                      </div>
                      <div className="text-[11px] text-[#7D766E]">
                        hasta {res.endDate}, {res.endTime}
                      </div>
                      <div className="text-[10px] text-[#755A2A] mt-0.5 font-medium">
                        {res.days} días totales
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7D766E] uppercase block mb-0.5">ANFITRIÓN VERIFICADO</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-[#EAE8E5] text-[10px] font-bold flex items-center justify-center">
                          MS
                        </div>
                        <div>
                          <div className="font-medium text-[#15110D]">{res.hostName}</div>
                          <div className="text-[11px] text-[#7D766E]">★ 4.98 (34 alquileres)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="lg:col-span-3 lg:border-l lg:border-[#F4EFEB] lg:pl-6 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase text-[#7D766E] tracking-wider block mb-0.5">
                      TOTAL ABONADO
                    </span>
                    <div className="text-2xl font-bold font-serif text-[#15110D] tabular-nums">
                      ${formatARS(res.totalAmount)} <span className="text-xs font-sans font-normal text-[#7D766E]">ARS</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">
                      Pagado vía Mercado Pago
                    </span>
                  </div>

                  <div className="pt-4 flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => onSelectReservation(res)}
                      className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white text-xs font-medium py-2.5 rounded transition-colors cursor-pointer"
                    >
                      Ver detalle de reserva
                    </button>
                    <a
                      href={`https://wa.me/5491149201122?text=Hola%20${res.hostName},%20tengo%20una%20consulta%20sobre%20la%20reserva%20${res.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center text-xs text-[#4B463F] hover:text-[#15110D] border border-[#DCD4C7] hover:bg-[#FAF8F5] py-2 rounded transition-colors cursor-pointer"
                    >
                      Contactar anfitrión
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Historial de Reservas */}
      {(activeTab === 'all' || activeTab === 'completed') && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-[#15110D]">Historial de Reservas</h2>
            <span className="text-xs text-[#7D766E]">{completedReservations.length} alquileres completados</span>
          </div>

          <div className="space-y-4">
            {completedReservations.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-[#E8E2D8] rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-24 h-16 bg-[#EFEEEB] rounded overflow-hidden shrink-0">
                    <img
                      src={res.vehicle.images[0]}
                      alt={res.vehicle.model}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-serif text-base text-[#15110D]">
                        {res.vehicle.brand} {res.vehicle.model} {res.vehicle.year}
                      </h4>
                      <span className="text-[10px] text-[#7D766E] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E2D8]">
                        Finalizada
                      </span>
                    </div>

                    <div className="text-xs text-[#7D766E]">
                      Retiro: {res.startDate} — {res.endDate} ({res.days} días)
                    </div>
                    <div className="text-[11px] text-[#7D766E] flex items-center gap-2 mt-0.5">
                      <span>{res.pickupAddress}</span>
                      <span>·</span>
                      <span className="font-mono">Código: {res.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#7D766E] block">TOTAL PAGADO</span>
                    <span className="text-base font-bold font-serif text-[#15110D] tabular-nums">
                      ${formatARS(res.totalAmount)} ARS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectReservation(res)}
                      className="text-xs border border-[#DCD4C7] hover:bg-[#FAF8F5] text-[#15110D] px-3 py-1.5 rounded transition-colors cursor-pointer"
                    >
                      Ver detalle
                    </button>
                    <button
                      onClick={() => onReBook(res.vehicleId)}
                      className="text-xs bg-[#FAF8F5] hover:bg-[#EAE8E5] text-[#15110D] border border-[#E8E2D8] px-3 py-1.5 rounded transition-colors cursor-pointer"
                    >
                      Volver a alquilar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Coverage Banner */}
      <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B463F] shadow-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#755A2A] shrink-0" />
          <div>
            <span className="font-semibold text-[#15110D] block">
              Todas tus reservas cuentan con cobertura oficial
            </span>
            <span className="text-[#7D766E]">
              Tenés asistencia 24/7 y gestión digital de comprobantes fiscales descargables en cualquier momento.
            </span>
          </div>
        </div>

        <a
          href="#ayuda"
          onClick={(e) => {
            e.preventDefault();
            alert('Centro de Asistencia Volanta: Línea exclusiva 0800-333-VOLANTA disponible las 24 horas.');
          }}
          className="text-xs text-[#15110D] hover:underline font-medium shrink-0 cursor-pointer"
        >
          Centro de ayuda →
        </a>
      </div>
    </div>
  );
};
