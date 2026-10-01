import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Calendar,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Reservation } from '../types';
import { formatARS } from '../utils/formatters';

interface BookingSuccessViewProps {
  reservation: Reservation;
  onViewMyBookings: () => void;
  onExploreMore: () => void;
}

export const BookingSuccessView: React.FC<BookingSuccessViewProps> = ({
  reservation,
  onViewMyBookings,
  onExploreMore,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservation.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const { vehicle } = reservation;

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
      {/* Top Success Badge and Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-16 h-16 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-3">
          ¡Tu reserva ha sido confirmada con éxito!
        </h1>
        <p className="text-xs text-[#4B463F] leading-relaxed mb-6">
          El anfitrión ha recibido los detalles de tu solicitud. Te enviamos el comprobante y los detalles a tu correo
          electrónico.
        </p>

        {/* Code capsule */}
        <div className="inline-flex items-center gap-3 bg-white border border-[#E8E2D8] px-4 py-2 rounded-lg text-xs shadow-xs">
          <span className="text-[#7D766E]">CÓDIGO DE RESERVA:</span>
          <span className="font-semibold text-[#15110D] tracking-wide">{reservation.id}</span>
          <button
            onClick={handleCopyCode}
            title="Copiar código de reserva"
            className="text-[#7D766E] hover:text-[#15110D] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[#CEC5BC]">·</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Confirmada / Pago aprobado
          </span>
        </div>
      </div>

      {/* Main Grid 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        {/* Left: Vehicle Details & Receipt */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEB]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E]">
              VEHÍCULO SELECCIONADO
            </span>
            <span className="text-xs text-[#755A2A] font-medium">Sedán Ejecutivo</span>
          </div>

          <div className="flex gap-4">
            <div className="w-28 h-20 bg-[#EFEEEB] rounded overflow-hidden shrink-0">
              <img
                src={vehicle.images[0]}
                alt={vehicle.model}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#15110D]">
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </h3>
              <div className="text-xs text-[#7D766E] flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 text-[#755A2A]" />
                <span>
                  {vehicle.neighborhood}, {vehicle.city}
                </span>
              </div>
              <div className="text-[11px] text-[#4B463F] flex items-center gap-2">
                <span>{vehicle.transmission}</span>
                <span>·</span>
                <span>{vehicle.seats} asientos</span>
                <span>·</span>
                <span>{vehicle.fuel}</span>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F4EFEB] text-xs">
            <div className="bg-[#FAF8F5] p-3 rounded border border-[#E8E2D8]">
              <span className="text-[10px] uppercase text-[#7D766E] block mb-0.5">RETIRO</span>
              <div className="font-medium text-[#15110D]">{reservation.startDate}</div>
              <div className="text-[11px] text-[#7D766E]">{reservation.startTime}</div>
              <div className="text-[10px] text-[#7D766E] mt-1">Palermo, CABA</div>
            </div>

            <div className="bg-[#FAF8F5] p-3 rounded border border-[#E8E2D8]">
              <span className="text-[10px] uppercase text-[#7D766E] block mb-0.5">DEVOLUCIÓN</span>
              <div className="font-medium text-[#15110D]">{reservation.endDate}</div>
              <div className="text-[11px] text-[#7D766E]">{reservation.endTime}</div>
              <div className="text-[10px] text-[#7D766E] mt-1">Palermo, CABA</div>
            </div>
          </div>

          {/* Payment breakdown snapshot */}
          <div className="pt-3 border-t border-[#F4EFEB] text-xs space-y-2">
            <div className="flex justify-between text-[#7D766E]">
              <span>Método de pago utilizado</span>
              <span className="text-[#15110D] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {reservation.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-[#7D766E]">
              <span>ID de transacción</span>
              <span className="text-[#15110D] font-mono">{reservation.mpTransactionId}</span>
            </div>

            <div className="pt-3 border-t border-[#E8E2D8] flex items-baseline justify-between">
              <div>
                <span className="text-sm font-semibold text-[#15110D] block">Total abonado</span>
                <span className="text-[10px] text-[#7D766E]">Período de {reservation.days} días completos</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-serif text-[#15110D] tabular-nums">
                  ${formatARS(reservation.totalAmount)}
                </span>
                <span className="text-[11px] text-[#7D766E] block">ARS</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#4B463F] hover:text-[#15110D] border border-[#DCD4C7] hover:bg-[#FAF8F5] py-2.5 rounded transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? '✓ Comprobante generado' : 'Descargar comprobante en PDF'}</span>
          </button>
        </div>

        {/* Right: Next steps & Host Contact */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-lg text-[#15110D] mb-4">Próximos pasos</h2>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#15110D] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-[#15110D]">Revisá tu email con el comprobante</h4>
                  <p className="text-[#7D766E] mt-0.5">
                    Te hemos enviado la confirmación detallada con el resumen fiscal y la guía de inicio.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#15110D] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-[#15110D]">Coordiná el punto de encuentro</h4>
                  <p className="text-[#7D766E] mt-0.5">
                    El anfitrión se contactará para convenir la dirección exacta en Palermo para la entrega de llaves.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#15110D] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-[#15110D]">Presentá tu registro de conducir</h4>
                  <p className="text-[#7D766E] mt-0.5">
                    Recordá llevar tu licencia vigente y tu documento nacional de identidad al momento de retirar el auto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Host Card */}
          <div className="pt-4 border-t border-[#F4EFEB]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E]">
                CONTACTO DEL ANFITRIÓN
              </span>
              <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Propietario verificado
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EAE8E5] text-[#15110D] flex items-center justify-center font-serif font-bold text-sm">
                MS
              </div>
              <div>
                <h4 className="font-medium text-[#15110D] text-xs">{reservation.hostName}</h4>
                <p className="text-[11px] text-[#7D766E]">
                  Propietario en Palermo · Responde en &lt; 15 min
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`https://wa.me/5491149201122?text=Hola%20${encodeURIComponent(reservation.hostName)},%20tengo%20confirmada%20la%20reserva%20${reservation.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#FAF8F5] border border-[#E8E2D8] hover:bg-[#F4EFEB] text-[#15110D] font-medium transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => alert(`Llamando al anfitrión ${reservation.hostName}: ${reservation.hostPhone}`)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#FAF8F5] border border-[#E8E2D8] hover:bg-[#F4EFEB] text-[#15110D] font-medium transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#755A2A]" />
                <span>Enviar mensaje</span>
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#F4EFEB] space-y-2">
            <button
              onClick={onViewMyBookings}
              className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white py-3 rounded text-xs font-medium transition-colors cursor-pointer"
            >
              Ver en Mis Reservas
            </button>
            <button
              onClick={onExploreMore}
              className="w-full text-center text-xs text-[#4B463F] hover:text-[#15110D] py-2 transition-colors cursor-pointer"
            >
              Volver a Explorar Vehículos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
