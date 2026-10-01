import React, { useState } from 'react';
import { Trash2, Calendar, MapPin, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Vehicle } from '../types';
import { formatARS } from '../utils/formatters';

export interface CartBookingItem {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  days: number;
  dailyRate: number;
  discountAmount: number;
  totalAmount: number;
}

interface CartViewProps {
  cartItem: CartBookingItem | null;
  onRemoveItem: () => void;
  onProceedToCheckout: () => void;
  onContinueBrowsing: () => void;
  onUpdateDays?: (newDays: number) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItem,
  onRemoveItem,
  onProceedToCheckout,
  onContinueBrowsing,
  onUpdateDays,
}) => {
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [selectedDays, setSelectedDays] = useState(cartItem?.days || 4);

  if (!cartItem) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 text-center">
        <div className="max-w-md mx-auto bg-white border border-[#E8E2D8] rounded-lg p-10 shadow-xs">
          <ShoppingBag className="w-12 h-12 text-[#CEC5BC] mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-[#15110D] mb-2">Tu carrito está vacío</h2>
          <p className="text-xs text-[#7D766E] mb-6">
            Aún no has seleccionado ningún vehículo para tu próximo viaje en Argentina.
          </p>
          <button
            onClick={onContinueBrowsing}
            className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white text-xs font-medium py-3 rounded transition-colors cursor-pointer"
          >
            Explorar catálogo de vehículos
          </button>
        </div>
      </div>
    );
  }

  const { vehicle } = cartItem;
  const currentGross = cartItem.dailyRate * selectedDays;
  const discountPercent = selectedDays >= 3 ? vehicle.weeklyDiscountPercent : 0;
  const currentDiscount = Math.round((currentGross * discountPercent) / 100);
  const currentFinal = currentGross - currentDiscount;

  const handleSaveDates = () => {
    if (onUpdateDays) {
      onUpdateDays(selectedDays);
    }
    setIsEditingDates(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Top Header & Step Info */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-1">
            Tu carrito
          </h1>
          <p className="text-xs text-[#7D766E]">1 vehículo seleccionado para reserva</p>
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7D766E]">
          PASO 1 DE 2: REVISIÓN
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Selected Vehicle Card */}
        <div className="lg:col-span-8 bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Thumbnail */}
            <div className="w-full sm:w-56 aspect-[4/3] bg-[#EFEEEB] rounded overflow-hidden shrink-0 relative">
              <img
                src={vehicle.images[0]}
                alt={vehicle.model}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info and Booking parameters */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#755A2A] block mb-1">
                  {vehicle.category.toUpperCase()} EJECUTIVO
                </span>
                <h2 className="font-serif text-2xl text-[#15110D] mb-1.5">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#7D766E] mb-5">
                  <MapPin className="w-3.5 h-3.5 text-[#755A2A]" />
                  <span>
                    {vehicle.neighborhood}, {vehicle.city}
                  </span>
                </div>

                {/* Itinerary Specs Box */}
                <div className="grid grid-cols-3 gap-3 bg-[#FAF8F5] p-3 rounded border border-[#E8E2D8] text-xs mb-4">
                  <div>
                    <span className="text-[10px] uppercase text-[#7D766E] block mb-0.5">RETIRO</span>
                    <span className="font-medium text-[#15110D] block">{cartItem.startDate}</span>
                    <span className="text-[11px] text-[#7D766E]">{cartItem.startTime}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#7D766E] block mb-0.5">DEVOLUCIÓN</span>
                    <span className="font-medium text-[#15110D] block">{cartItem.endDate}</span>
                    <span className="text-[11px] text-[#7D766E]">{cartItem.endTime}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#7D766E] block mb-0.5">DURACIÓN</span>
                    <span className="font-medium text-[#15110D] block">{selectedDays} días</span>
                  </div>
                </div>

                {/* Price and tag */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-xl font-bold font-serif text-[#15110D] tabular-nums">
                    ${formatARS(cartItem.dailyRate)}
                  </span>
                  <span className="text-xs text-[#7D766E]">/ día</span>

                  {discountPercent > 0 && (
                    <span className="text-[10px] font-medium text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded">
                      {discountPercent}% OFF aplicado por +3 días
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Date Modal / Inline Stepper */}
              {isEditingDates && (
                <div className="p-3 bg-[#F4EFEB] rounded border border-[#DCD4C7] mb-4">
                  <div className="text-xs font-semibold text-[#15110D] mb-2">Ajustar días de alquiler:</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedDays((d) => Math.max(vehicle.minDays, d - 1))}
                      className="w-8 h-8 rounded bg-white border border-[#DCD4C7] flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold text-[#15110D] tabular-nums">{selectedDays} días</span>
                    <button
                      onClick={() => setSelectedDays((d) => d + 1)}
                      className="w-8 h-8 rounded bg-white border border-[#DCD4C7] flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                    <button
                      onClick={handleSaveDates}
                      className="ml-auto text-xs bg-[#15110D] text-white px-3 py-1.5 rounded"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F4EFEB] text-xs">
                <button
                  onClick={() => setIsEditingDates(!isEditingDates)}
                  className="text-[#4B463F] hover:text-[#15110D] font-medium underline underline-offset-4 cursor-pointer"
                >
                  {isEditingDates ? 'Cerrar selector' : 'Cambiar fechas'}
                </button>

                <button
                  onClick={onRemoveItem}
                  className="flex items-center gap-1.5 text-[#7D766E] hover:text-red-700 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Quitar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-4 bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
          <h2 className="font-serif text-lg text-[#15110D] mb-5">Resumen de reserva</h2>

          <div className="space-y-3 text-xs text-[#4B463F] mb-6">
            <div className="flex justify-between">
              <span>
                {selectedDays} días x ${formatARS(cartItem.dailyRate)}
              </span>
              <span className="tabular-nums text-[#15110D] font-medium">${formatARS(currentGross)}</span>
            </div>

            {currentDiscount > 0 && (
              <div className="flex justify-between text-[#755A2A]">
                <span>Descuento aplicado ({discountPercent}%)</span>
                <span className="tabular-nums font-medium">-${formatARS(currentDiscount)}</span>
              </div>
            )}

            <div className="pt-4 border-t border-[#E8E2D8] flex items-baseline justify-between">
              <div>
                <span className="text-base font-semibold text-[#15110D] block">Total final</span>
                <span className="text-[10px] uppercase text-[#7D766E] tracking-wider">IMPUESTOS INCLUIDOS</span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-serif text-[#15110D] tabular-nums">
                  ${formatARS(currentFinal)}
                </span>
                <span className="text-[11px] text-[#7D766E] block">ARS</span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToCheckout}
            className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white py-3 px-4 rounded-md font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mb-4"
          >
            <span>Continuar con la reserva</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onContinueBrowsing}
            className="w-full text-center text-xs text-[#4B463F] hover:text-[#15110D] transition-colors cursor-pointer py-1"
          >
            Continuar explorando vehículos
          </button>
        </div>
      </div>
    </div>
  );
};
