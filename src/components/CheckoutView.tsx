import React, { useState } from 'react';
import { ShieldCheck, MapPin, Calendar, CreditCard, Banknote, ArrowLeft, Check, Lock } from 'lucide-react';
import { Vehicle } from '../types';
import { formatARS } from '../utils/formatters';

interface CheckoutViewProps {
  bookingData: {
    vehicle: Vehicle;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    days: number;
    dailyRate: number;
    discountAmount: number;
    totalAmount: number;
  };
  onConfirmBooking: (paymentMethod: 'Mercado Pago' | 'Efectivo') => void;
  onBackToCart: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  bookingData,
  onConfirmBooking,
  onBackToCart,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'Mercado Pago' | 'Efectivo'>('Mercado Pago');
  const [isProcessing, setIsProcessing] = useState(false);

  const { vehicle } = bookingData;
  const grossAmount = bookingData.dailyRate * bookingData.days;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmBooking(paymentMethod);
    }, 600);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Step Indicator & Header */}
      <div className="mb-8">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7D766E] block mb-1">
          Reserva · Paso 2 de 2: Pago y confirmación
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-2">
          Confirmar Reserva
        </h1>
        <p className="text-xs text-[#4B463F]">
          Revisá los datos de tu alquiler y seleccioná la modalidad de pago para completar la operación.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Confirmation forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Vehículo Seleccionado Card */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7D766E]">
                VEHÍCULO SELECCIONADO
              </span>
              <span className="text-xs text-[#755A2A] bg-[#FDD79C]/30 px-2.5 py-0.5 rounded font-medium">
                Categoría {vehicle.category}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-full sm:w-44 aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden shrink-0">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.model}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#15110D] mb-1">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#7D766E] mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#755A2A]" />
                  <span>
                    {vehicle.neighborhood}, {vehicle.city}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-[#4B463F]">
                  <span className="bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded">
                    {vehicle.fuel}
                  </span>
                  <span className="bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded">
                    {vehicle.transmission}
                  </span>
                  <span className="bg-[#FAF8F5] border border-[#E8E2D8] px-2.5 py-1 rounded">
                    {vehicle.seats} plazas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Itinerario y Entrega */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#755A2A]" />
              <h3 className="font-serif text-lg text-[#15110D]">Itinerario y entrega</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="p-3.5 bg-[#FAF8F5] rounded border border-[#E8E2D8] text-xs">
                <span className="text-[10px] text-[#7D766E] uppercase font-semibold block mb-1">RETIRO</span>
                <div className="font-medium text-[#15110D] text-sm mb-0.5">
                  {bookingData.startDate}, {bookingData.startTime}
                </div>
                <div className="text-[11px] text-[#7D766E]">
                  {vehicle.neighborhood}, Ciudad Autónoma de Buenos Aires
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded border border-[#E8E2D8] text-xs">
                <span className="text-[10px] text-[#7D766E] uppercase font-semibold block mb-1">DEVOLUCIÓN</span>
                <div className="font-medium text-[#15110D] text-sm mb-0.5">
                  {bookingData.endDate}, {bookingData.endTime}
                </div>
                <div className="text-[11px] text-[#7D766E]">Mismo punto de entrega</div>
              </div>
            </div>

            {/* Punto de retiro acordado */}
            <div className="p-3.5 bg-[#FAF8F5] rounded border border-[#E8E2D8] text-xs flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#755A2A] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#15110D] block mb-0.5">
                  Punto de retiro y entrega acordado
                </span>
                <span className="text-[#4B463F]">
                  {vehicle.neighborhood}, Ciudad de Buenos Aires (zona aproximada: cercanías de Av. Libertador y Scalabrini Ortiz).
                </span>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-[#755A2A]" />
              <h3 className="font-serif text-lg text-[#15110D]">Método de pago</h3>
            </div>
            <p className="text-xs text-[#7D766E] mb-5">
              Elegí la forma de pago más conveniente para finalizar tu reserva.
            </p>

            <div className="space-y-3">
              {/* Mercado Pago */}
              <label
                onClick={() => setPaymentMethod('Mercado Pago')}
                className={`flex items-start gap-3.5 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'Mercado Pago'
                    ? 'border-[#15110D] bg-[#FAF8F5]'
                    : 'border-[#E8E2D8] bg-white hover:border-[#DCD4C7]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Mercado Pago'}
                  onChange={() => setPaymentMethod('Mercado Pago')}
                  className="mt-1 text-[#15110D] focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#15110D]">Mercado Pago</span>
                    <span className="text-[10px] font-semibold uppercase text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded">
                      INSTANTÁNEO
                    </span>
                  </div>
                  <p className="text-xs text-[#4B463F]">
                    Tarjetas de crédito, débito o dinero disponible en tu cuenta. Serás redirigido para completar el pago seguro.
                  </p>
                </div>
              </label>

              {/* Efectivo al momento de la entrega */}
              <label
                onClick={() => setPaymentMethod('Efectivo')}
                className={`flex items-start gap-3.5 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'Efectivo'
                    ? 'border-[#15110D] bg-[#FAF8F5]'
                    : 'border-[#E8E2D8] bg-white hover:border-[#DCD4C7]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Efectivo'}
                  onChange={() => setPaymentMethod('Efectivo')}
                  className="mt-1 text-[#15110D] focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#15110D]">
                      Efectivo al momento de la entrega
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-[#7D766E] bg-[#EAE8E5] px-2 py-0.5 rounded">
                      SIN ANTICIPO
                    </span>
                  </div>
                  <p className="text-xs text-[#4B463F]">
                    Abonás el importe total directamente en pesos argentinos al momento de recibir las llaves del vehículo.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onBackToCart}
              className="flex items-center gap-1.5 text-xs text-[#4B463F] hover:text-[#15110D] font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al carrito</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="bg-[#15110D] hover:bg-[#2A2621] text-white text-xs font-medium px-6 py-3 rounded shadow-xs transition-colors cursor-pointer"
            >
              {isProcessing ? 'Procesando reserva...' : 'Confirmar reserva'}
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Guarantee */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#15110D]">Resumen del pago</h3>
              <span className="text-xs text-[#7D766E]">{bookingData.days} días totales</span>
            </div>

            <div className="space-y-3 text-xs text-[#4B463F] mb-6">
              <div className="flex justify-between">
                <span>
                  {bookingData.days} días x ${formatARS(bookingData.dailyRate)}
                </span>
                <span className="tabular-nums font-medium text-[#15110D]">${formatARS(grossAmount)}</span>
              </div>

              {bookingData.discountAmount > 0 && (
                <div className="flex justify-between text-[#755A2A]">
                  <span>Descuento aplicado (10%)</span>
                  <span className="tabular-nums font-medium">-${formatARS(bookingData.discountAmount)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#E8E2D8] flex items-baseline justify-between">
                <div>
                  <span className="text-base font-semibold text-[#15110D] block">Total a pagar</span>
                  <span className="text-[10px] uppercase text-[#7D766E] tracking-wider">
                    (IMPUESTOS INCLUIDOS)
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold font-serif text-[#15110D] tabular-nums">
                    ${formatARS(bookingData.totalAmount)}
                  </span>
                  <span className="text-[11px] text-[#7D766E] block">ARS</span>
                </div>
              </div>
            </div>

            {/* Informative text */}
            <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-[11px] text-[#4B463F] mb-5 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-[#755A2A] shrink-0 mt-0.5" />
              <span>
                {paymentMethod === 'Mercado Pago'
                  ? 'Al confirmar, serás redirigido a la pasarela segura de Mercado Pago para abonar con tarjeta o tu cuenta.'
                  : 'El pago se realiza en efectivo de forma directa en el punto de encuentro convenido.'}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white py-3 px-4 rounded-md font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mb-3"
            >
              <span>{isProcessing ? 'Procesando...' : 'Confirmar reserva'}</span>
            </button>

            <button
              onClick={onBackToCart}
              className="w-full text-center text-xs text-[#7D766E] hover:text-[#15110D] transition-colors cursor-pointer mb-6"
            >
              Volver al carrito
            </button>

            <div className="pt-4 border-t border-[#F4EFEB] text-[11px] text-[#7D766E] text-center">
              Tarifa final garantizada. Sin comisiones sorpresa ni cargos adicionales.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
