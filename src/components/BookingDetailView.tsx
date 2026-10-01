import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Download,
  AlertTriangle,
  Car,
  Fuel,
  Users,
  Briefcase,
  Headphones,
} from 'lucide-react';
import { Reservation } from '../types';
import { formatARS } from '../utils/formatters';

interface BookingDetailViewProps {
  reservation: Reservation;
  onBack: () => void;
  onCancelReservation: (reservationId: string) => void;
}

export const BookingDetailView: React.FC<BookingDetailViewProps> = ({
  reservation,
  onBack,
  onCancelReservation,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { vehicle } = reservation;

  const handleDownloadPDF = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleConfirmCancel = () => {
    onCancelReservation(reservation.id);
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#4B463F] hover:text-[#15110D] mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a Mis Reservas</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight">
            Reserva {reservation.id}
          </h1>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded ${
              reservation.bookingStatus === 'Confirmada'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : reservation.bookingStatus === 'Cancelada'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-[#FAF8F5] text-[#7D766E] border border-[#E8E2D8]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                reservation.bookingStatus === 'Confirmada'
                  ? 'bg-emerald-600'
                  : reservation.bookingStatus === 'Cancelada'
                  ? 'bg-red-600'
                  : 'bg-[#7D766E]'
              }`}
            />
            {reservation.bookingStatus}
          </span>
        </div>

        <span className="text-xs text-[#7D766E]">Realizada el {reservation.createdDate}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Vehicle Banner */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Photo */}
              <div className="w-full sm:w-60 aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden shrink-0 relative">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.model}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-white/95 text-[10px] font-mono px-2 py-0.5 rounded shadow-xs text-[#15110D]">
                  Patente: {vehicle.plate}
                </div>
              </div>

              {/* Specs */}
              <div className="flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#755A2A] block mb-1">
                  SEDÁN EJECUTIVO
                </span>
                <h3 className="font-serif text-2xl text-[#15110D] mb-1">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#7D766E] mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#755A2A]" />
                  <span>
                    {vehicle.neighborhood}, {vehicle.city === 'CABA' ? 'Ciudad Autónoma de Buenos Aires' : vehicle.city}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
                  <div className="bg-[#FAF8F5] p-2 rounded border border-[#E8E2D8] flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#755A2A]" />
                    <span>Caja {vehicle.transmission}</span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2 rounded border border-[#E8E2D8] flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-[#755A2A]" />
                    <span>{vehicle.fuel}</span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2 rounded border border-[#E8E2D8] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#755A2A]" />
                    <span>{vehicle.seats} Asientos</span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2 rounded border border-[#E8E2D8] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#755A2A]" />
                    <span>Baúl amplio</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#7D766E]">
                  Tracción delantera & Climatizador bi-zona · Categoría Confort
                </p>
              </div>
            </div>
          </div>

          {/* Itinerario y Entrega */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#755A2A]" />
                <h3 className="font-serif text-lg text-[#15110D]">Itinerario y Entrega</h3>
              </div>
              <span className="text-xs text-[#7D766E]">Duración: {reservation.days} días completos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#FAF8F5] p-4 rounded border border-[#E8E2D8] text-xs">
                <div className="flex items-center gap-2 text-[#7D766E] text-[10px] uppercase font-semibold mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15110D]" />
                  <span>RETIRO DEL VEHÍCULO</span>
                </div>
                <div className="font-semibold text-sm text-[#15110D] mb-1">
                  Martes {reservation.startDate} 2024, {reservation.startTime}
                </div>
                <div className="text-[11px] text-[#7D766E]">
                  {reservation.pickupAddress}
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded border border-[#E8E2D8] text-xs">
                <div className="flex items-center gap-2 text-[#7D766E] text-[10px] uppercase font-semibold mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#755A2A]" />
                  <span>DEVOLUCIÓN</span>
                </div>
                <div className="font-semibold text-sm text-[#15110D] mb-1">
                  Sábado {reservation.endDate} 2024, {reservation.endTime}
                </div>
                <div className="text-[11px] text-[#7D766E]">
                  Mismo punto de entrega ({reservation.pickupAddress})
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-xs text-[#4B463F]">
              <span className="font-semibold text-[#15110D] block mb-0.5">Instrucciones de entrega</span>
              {reservation.notes ||
                'Coordinar entrega de llaves y revisión de kilometraje directamente con el anfitrión 30 minutos antes. Por favor presentá tu licencia de conducir vigente al momento del retiro.'}
            </div>
          </div>

          {/* Cobertura y Asistencia */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#755A2A] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#15110D] text-xs mb-0.5">Cobertura y Asistencia</h4>
                <p className="text-xs text-[#7D766E]">
                  Cobertura básica de responsabilidad y asistencia mecánica 24/7 incluida durante todo el período
                  contratado.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E8E2D8] px-4 py-2 rounded text-right shrink-0">
              <div className="text-[10px] uppercase text-[#7D766E] font-semibold">AUXILIO RÁPIDO 24/7</div>
              <div className="font-serif font-bold text-sm text-[#15110D]">0800-333-VOLANTA</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Anfitrión del Auto */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <h3 className="font-serif text-lg text-[#15110D] mb-4">Anfitrión del Auto</h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EAE8E5] text-[#15110D] flex items-center justify-center font-serif font-bold text-sm">
                MS
              </div>
              <div>
                <h4 className="font-medium text-[#15110D] text-xs">{reservation.hostName}</h4>
                <p className="text-[11px] text-emerald-700">✓ Propietario verificado</p>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-xs text-[#4B463F] mb-4">
              <span className="text-[10px] text-[#7D766E] uppercase block mb-0.5">Teléfono directo:</span>
              <span className="font-mono text-sm font-medium text-[#15110D]">{reservation.hostPhone}</span>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/5491149201122?text=Hola%20${reservation.hostName},%20sobre%20la%20reserva%20${reservation.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-[#F4EFEB] border border-[#E8E2D8] text-[#15110D] text-xs font-medium py-2.5 rounded transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Contactar por WhatsApp</span>
              </a>

              <button
                onClick={() => alert(`Llamando al anfitrión ${reservation.hostName}: ${reservation.hostPhone}`)}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] border border-[#DCD4C7] text-[#4B463F] text-xs py-2 rounded transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#7D766E]" />
                <span>Llamar por teléfono</span>
              </button>
            </div>
          </div>

          {/* Resumen del Pago */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <h3 className="font-serif text-lg text-[#15110D] mb-4">Resumen del Pago</h3>

            <div className="space-y-2 text-xs text-[#4B463F] mb-4">
              <div className="flex justify-between">
                <span>
                  Alquiler ({reservation.days} días x ${formatARS(reservation.dailyRate)})
                </span>
                <span className="tabular-nums font-medium text-[#15110D]">
                  ${formatARS(reservation.grossAmount)}
                </span>
              </div>

              {reservation.discountAmount > 0 && (
                <div className="flex justify-between text-[#755A2A]">
                  <span>Descuento aplicado (10%)</span>
                  <span className="tabular-nums font-medium">-${formatARS(reservation.discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E8E2D8] flex items-baseline justify-between">
                <span className="font-semibold text-[#15110D] text-sm">Total abonado</span>
                <div className="text-right">
                  <span className="text-xl font-bold font-serif text-[#15110D] tabular-nums">
                    ${formatARS(reservation.totalAmount)}
                  </span>
                  <span className="text-[11px] text-[#7D766E] block">ARS</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-[11px] text-[#7D766E] mb-4">
              <span className="block font-medium text-[#15110D]">Medio de pago</span>
              <span>Mercado Pago (Aprobado · ID #{reservation.mpTransactionId})</span>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 text-xs border border-[#DCD4C7] hover:bg-[#FAF8F5] text-[#15110D] py-2 rounded transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? '✓ Comprobante descargado' : 'Descargar recibo / comprobante PDF'}</span>
            </button>
          </div>

          {/* Gestión de la Reserva */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E] block mb-2">
              GESTIÓN DE LA RESERVA
            </span>
            <p className="text-xs text-[#7D766E] leading-relaxed mb-4">
              Cancelación gratuita hasta 48 hs antes del inicio del alquiler (hasta el Domingo 10 Nov a las 10:00 hs).
            </p>

            {reservation.bookingStatus === 'Confirmada' ? (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full text-center text-xs text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 py-2 rounded transition-colors cursor-pointer"
              >
                ✕ Cancelar reserva
              </button>
            ) : (
              <div className="text-center text-xs text-[#7D766E] bg-[#FAF8F5] py-2 rounded">
                Reserva {reservation.bookingStatus.toLowerCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-[#E8E2D8] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#15110D] mb-2">¿Estás seguro de cancelar la reserva?</h3>
            <p className="text-xs text-[#4B463F] leading-relaxed mb-6">
              Esta reserva cuenta con cancelación gratuita. Al confirmar, liberaremos las fechas para otros conductores y
              se emitirá el reembolso automático a tu cuenta de Mercado Pago.
            </p>

            <div className="flex items-center justify-end gap-3 text-xs">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-[#DCD4C7] rounded text-[#4B463F] hover:bg-[#FAF8F5] cursor-pointer"
              >
                No, mantener reserva
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium cursor-pointer"
              >
                Sí, cancelar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
