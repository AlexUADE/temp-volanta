import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Fuel,
  Users,
  Car,
  Clock,
  Navigation,
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatARS } from '../utils/formatters';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  onAddToCart: (bookingDetails: {
    vehicle: Vehicle;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    days: number;
    dailyRate: number;
    discountAmount: number;
    totalAmount: number;
  }) => void;
  onBackToCatalog: () => void;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicle,
  onAddToCart,
  onBackToCatalog,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [startDate, setStartDate] = useState('12 Nov');
  const [endDate, setEndDate] = useState('16 Nov');
  const [startTime, setStartTime] = useState('10:00 hs');
  const [endTime, setEndTime] = useState('10:00 hs');
  const [rentalDays, setRentalDays] = useState(4);

  // Calculations
  const dailyRate = vehicle.pricePerDay;
  const grossTotal = dailyRate * rentalDays;
  const discountPercent = rentalDays >= 3 ? vehicle.weeklyDiscountPercent : 0;
  const discountAmount = Math.round((grossTotal * discountPercent) / 100);
  const finalTotal = grossTotal - discountAmount;

  const handleBooking = () => {
    onAddToCart({
      vehicle,
      startDate,
      endDate,
      startTime,
      endTime,
      days: rentalDays,
      dailyRate,
      discountAmount,
      totalAmount: finalTotal,
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#7D766E] mb-6">
        <button onClick={onBackToCatalog} className="hover:text-[#15110D] transition-colors cursor-pointer">
          Inicio
        </button>
        <ChevronRight className="w-3 h-3 text-[#CEC5BC]" />
        <button onClick={onBackToCatalog} className="hover:text-[#15110D] transition-colors cursor-pointer">
          Catálogo
        </button>
        <ChevronRight className="w-3 h-3 text-[#CEC5BC]" />
        <span className="text-[#15110D] font-medium">
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </span>
      </nav>

      {/* Header Info */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded mb-2">
          <ShieldCheck className="w-3 h-3" />
          <span>Vehículo Verificado</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-1.5">
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </h1>

        <div className="text-xs text-[#7D766E] flex items-center gap-2">
          <span>{vehicle.category}</span>
          <span>·</span>
          <span>Color {vehicle.color}</span>
          <span>·</span>
          <span>{vehicle.seats} Asientos</span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visuals, Description & Map */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Main Photo Display */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-2 overflow-hidden shadow-xs">
            <div className="relative aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden">
              <img
                src={vehicle.images[selectedPhotoIndex] || vehicle.images[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded">
                Foto {selectedPhotoIndex + 1} de {vehicle.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden border-2 transition-all cursor-pointer relative ${
                    selectedPhotoIndex === idx ? 'border-[#15110D]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  {selectedPhotoIndex === idx && (
                    <div className="absolute inset-0 bg-black/5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-lg border border-[#E8E2D8] text-xs">
            <div className="flex items-center gap-2.5 text-[#4B463F]">
              <Car className="w-4 h-4 text-[#755A2A]" />
              <div>
                <div className="text-[10px] text-[#7D766E] uppercase">Caja</div>
                <div className="font-medium text-[#15110D]">{vehicle.transmission}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-[#4B463F]">
              <Fuel className="w-4 h-4 text-[#755A2A]" />
              <div>
                <div className="text-[10px] text-[#7D766E] uppercase">Combustible</div>
                <div className="font-medium text-[#15110D]">{vehicle.fuel}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-[#4B463F]">
              <Users className="w-4 h-4 text-[#755A2A]" />
              <div>
                <div className="text-[10px] text-[#7D766E] uppercase">Capacidad</div>
                <div className="font-medium text-[#15110D]">{vehicle.seats} Asientos</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-[#4B463F]">
              <Clock className="w-4 h-4 text-[#755A2A]" />
              <div>
                <div className="text-[10px] text-[#7D766E] uppercase">Mínimo</div>
                <div className="font-medium text-[#15110D]">{vehicle.minDays} Días</div>
              </div>
            </div>
          </div>

          {/* Vehicle Description */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <h2 className="font-serif text-xl text-[#15110D] mb-4">Descripción del vehículo</h2>
            <div className="text-sm text-[#4B463F] leading-relaxed whitespace-pre-line space-y-4">
              {vehicle.description}
            </div>
          </div>

          {/* Pickup and Delivery Point */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-[#15110D]">Punto de entrega y retiro</h2>
              <span className="text-[11px] uppercase tracking-wider text-[#7D766E] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#E8E2D8]">
                Zona aproximada
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#4B463F] mb-4">
              <MapPin className="w-4 h-4 text-[#755A2A]" />
              <span>
                {vehicle.neighborhood}, {vehicle.city === 'CABA' ? 'Ciudad Autónoma de Buenos Aires' : vehicle.city}
              </span>
            </div>

            {/* Stylized Argentine Map Preview */}
            <div className="relative h-64 bg-[#E4E2DF] rounded-md overflow-hidden border border-[#DCD4C7] flex flex-col justify-end p-4">
              {/* Map grid lines simulation */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#15110D 1px, transparent 1px), radial-gradient(#15110D 1px, #E4E2DF 1px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 bg-[#755A2A]/15 rounded-full animate-ping" />
                  <div className="absolute w-10 h-10 bg-[#15110D] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Navigation className="w-5 h-5 text-[#FAF8F5]" />
                  </div>
                </div>
              </div>

              {/* Inset Label */}
              <div className="relative z-10 bg-white/95 backdrop-blur-sm border border-[#E8E2D8] rounded p-3 text-xs shadow-sm max-w-sm">
                <div className="font-medium text-[#15110D]">
                  {vehicle.pickupNotes || 'Retiro coordinado en Palermo Soho / Hollywood'}
                </div>
                <div className="text-[11px] text-[#7D766E] mt-0.5">
                  La dirección exacta se revela automáticamente una vez confirmada la reserva.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-sm">
            {/* Price Header */}
            <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-[#F4EFEB]">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-serif text-[#15110D] tabular-nums">
                  ${formatARS(dailyRate)}
                </span>
                <span className="text-xs text-[#7D766E]">/ día</span>
              </div>

              {vehicle.weeklyDiscountPercent > 0 && (
                <span className="text-[11px] font-medium text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded">
                  -{vehicle.weeklyDiscountPercent}% por +3 días
                </span>
              )}
            </div>

            {/* Dates Selection Box */}
            <div className="border border-[#E8E2D8] rounded-md p-3 mb-4 bg-[#FAF8F5]">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E] mb-2">
                Período de reserva
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border-r border-[#E8E2D8] pr-2">
                  <span className="text-[10px] text-[#7D766E] block mb-1">RETIRO</span>
                  <div className="flex items-center gap-1.5 font-medium text-[#15110D]">
                    <Calendar className="w-3.5 h-3.5 text-[#755A2A]" />
                    <span>{startDate}</span>
                  </div>
                  <span className="text-[11px] text-[#7D766E] block mt-0.5">{startTime}</span>
                </div>

                <div className="pl-2">
                  <span className="text-[10px] text-[#7D766E] block mb-1">DEVOLUCIÓN</span>
                  <div className="flex items-center gap-1.5 font-medium text-[#15110D]">
                    <Calendar className="w-3.5 h-3.5 text-[#755A2A]" />
                    <span>{endDate}</span>
                  </div>
                  <span className="text-[11px] text-[#7D766E] block mt-0.5">{endTime}</span>
                </div>
              </div>
            </div>

            {/* Availability Indicator */}
            <div className="flex items-center gap-2 text-xs text-[#755A2A] mb-5 bg-[#FDD79C]/20 px-3 py-2 rounded">
              <span className="w-2 h-2 rounded-full bg-[#755A2A]" />
              <span>Disponible para las fechas seleccionadas</span>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-[#4B463F] mb-6">
              <div className="flex justify-between">
                <span>
                  {rentalDays} días x ${formatARS(dailyRate)}
                </span>
                <span className="tabular-nums text-[#15110D] font-medium">${formatARS(grossTotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#755A2A]">
                  <span>Descuento aplicado ({discountPercent}%)</span>
                  <span className="tabular-nums font-medium">-${formatARS(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E8E2D8] flex items-baseline justify-between">
                <span className="text-sm font-semibold text-[#15110D]">Total final</span>
                <div className="text-right">
                  <span className="text-xl font-bold font-serif text-[#15110D] tabular-nums">
                    ${formatARS(finalTotal)}
                  </span>
                  <span className="text-[11px] text-[#7D766E] block">ARS</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleBooking}
              className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white py-3 px-4 rounded-md font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mb-3"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al carrito</span>
            </button>

            <p className="text-[11px] text-[#7D766E] text-center">
              Podrás revisar el resumen completo antes de completar tu pedido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
