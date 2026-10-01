import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
  AlertTriangle,
  Check,
  TrendingUp,
  HelpCircle,
  Shield,
  Trash2,
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatARS } from '../utils/formatters';

interface EditListingViewProps {
  vehicle: Vehicle;
  onBack: () => void;
  onViewAsUser: (vehicle: Vehicle) => void;
  onSaveVehicle: (updated: Vehicle) => void;
  onViewReservationDetail: () => void;
}

export const EditListingView: React.FC<EditListingViewProps> = ({
  vehicle,
  onBack,
  onViewAsUser,
  onSaveVehicle,
  onViewReservationDetail,
}) => {
  const [dailyPrice, setDailyPrice] = useState(vehicle.pricePerDay);
  const [weeklyDiscount, setWeeklyDiscount] = useState(vehicle.weeklyDiscountPercent);
  const [minDays, setMinDays] = useState(vehicle.minDays);
  const [instantBooking, setInstantBooking] = useState(vehicle.instantBooking);
  const [neighborhood, setNeighborhood] = useState(vehicle.neighborhood);
  const [pickupPoint, setPickupPoint] = useState(vehicle.pickupPoint);
  const [isPaused, setIsPaused] = useState(vehicle.status === 'pausada');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // November 2024 day states
  // 12..16: confirmed
  // 20..21: blocked
  const [calendarDays, setCalendarDays] = useState<Record<number, 'available' | 'confirmed' | 'blocked'>>({
    12: 'confirmed',
    13: 'confirmed',
    14: 'confirmed',
    15: 'confirmed',
    16: 'confirmed',
    20: 'blocked',
    21: 'blocked',
  });

  const toggleDayStatus = (day: number) => {
    if (day < 1 || day > 30) return;
    const current = calendarDays[day] || 'available';
    if (current === 'confirmed') return; // Locked by actual active booking

    const nextState = current === 'available' ? 'blocked' : 'available';
    setCalendarDays((prev) => ({
      ...prev,
      [day]: nextState,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSaveVehicle({
      ...vehicle,
      pricePerDay: dailyPrice,
      weeklyDiscountPercent: weeklyDiscount,
      minDays,
      instantBooking,
      neighborhood,
      pickupPoint,
      status: isPaused ? 'pausada' : 'activa',
    });
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const netEstimate = Math.round(dailyPrice * 0.85);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#7D766E] mb-3 flex-wrap">
        <button onClick={onBack} className="hover:text-[#15110D] cursor-pointer">
          PANEL DE PROPIETARIO
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-[#15110D] cursor-pointer">
          MIS PUBLICACIONES
        </button>
        <span>/</span>
        <span className="text-[#15110D] font-medium">
          EDITAR: {vehicle.brand.toUpperCase()} {vehicle.model.toUpperCase()} ({vehicle.plate})
        </span>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#7D766E] font-mono">PUBLICACIÓN #PUB-91204</span>
            <span className="text-[#CEC5BC]">·</span>
            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                isPaused ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-600' : 'bg-emerald-600'}`} />
              {isPaused ? 'Pausada' : 'Activa'}
            </span>
          </div>

          <h1 className="text-3xl font-serif text-[#15110D] font-normal tracking-tight">Editar Publicación</h1>
          <p className="text-xs text-[#7D766E] mt-0.5">
            {vehicle.brand} {vehicle.model} {vehicle.year} · Caja {vehicle.transmission} · {vehicle.fuel} · Patente{' '}
            {vehicle.plate}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Pause Toggle */}
          <div className="flex items-center gap-2 text-xs text-[#4B463F]">
            <span>Pausar publicación</span>
            <button
              onClick={() => {
                setIsPaused(!isPaused);
                setHasChanges(true);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                isPaused ? 'bg-[#755A2A]' : 'bg-[#E4E2DF]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  isPaused ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* View as User Button */}
          <button
            onClick={() => onViewAsUser(vehicle)}
            className="flex items-center gap-1.5 text-xs text-[#15110D] border border-[#15110D] hover:bg-[#FAF8F5] px-3.5 py-2 rounded transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver como usuario</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Sections */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Tarifas y Condiciones */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#15110D] flex items-center gap-2">
                <span>Tarifas y Condiciones de Alquiler</span>
              </h3>
              <span className="text-[10px] text-[#7D766E] uppercase font-semibold">PASO 1 DE 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Tarifa diaria base (ARS)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7D766E]">$</span>
                  <input
                    type="number"
                    value={dailyPrice}
                    onChange={(e) => {
                      setDailyPrice(Number(e.target.value));
                      setHasChanges(true);
                    }}
                    className="w-full pl-7 pr-12 py-2 text-sm bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7D766E]">/ día</span>
                </div>
                <p className="text-[11px] text-[#7D766E] mt-1">
                  Ganancia estimada neta: <strong className="text-[#15110D]">${formatARS(netEstimate)} ARS</strong> por día
                  (comisión de plataforma 15%).
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Descuento semanal (7 o más días)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weeklyDiscount}
                    onChange={(e) => {
                      setWeeklyDiscount(Number(e.target.value));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 pr-8 py-2 text-sm bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7D766E]">%</span>
                </div>
                <p className="text-[11px] text-[#7D766E] mt-1">
                  Incentiva alquileres de media y larga duración para optimizar el vehículo.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                Estadía mínima de reserva
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#DCD4C7] rounded bg-white overflow-hidden">
                  <button
                    onClick={() => {
                      setMinDays(Math.max(1, minDays - 1));
                      setHasChanges(true);
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#FAF8F5] text-sm font-bold border-r border-[#DCD4C7]"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold tabular-nums text-[#15110D]">
                    {minDays}
                  </span>
                  <button
                    onClick={() => {
                      setMinDays(minDays + 1);
                      setHasChanges(true);
                    }}
                    className="w-9 h-9 flex items-center justify-center hover:bg-[#FAF8F5] text-sm font-bold border-l border-[#DCD4C7]"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#7D766E]">días · Cantidad mínima de jornadas consecutivas para admitir un viaje.</span>
              </div>
            </div>
          </div>

          {/* 2. Disponibilidad y Bloqueo de Fechas (Interactive Calendar) */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h3 className="font-serif text-lg text-[#15110D]">Disponibilidad y Bloqueo de Fechas</h3>
              <div className="flex items-center gap-4 text-xs text-[#7D766E]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-[#DCD4C7] bg-white" />
                  Disponible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FDD79C]" />
                  Confirmado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2A2621]" />
                  Bloqueado
                </span>
              </div>
            </div>

            <p className="text-xs text-[#7D766E] mb-4">
              Marcá días puntuales para mantenimiento preventivo, uso personal o descanso de la unidad haciendo clic
              sobre las fechas.
            </p>

            {/* Calendar UI */}
            <div className="border border-[#E8E2D8] rounded-md p-4 bg-[#FAF8F5]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-xs text-[#15110D]">Noviembre 2024</span>
                <div className="flex items-center gap-1 text-[#7D766E]">
                  <button className="p-1 hover:text-[#15110D] cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:text-[#15110D] cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#7D766E] mb-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>

              {/* Calendar Grid: Nov 2024 starts on Friday (idx 4) */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty offset days from Oct (28, 29, 30, 31) */}
                <div className="p-2 text-center text-xs text-[#CEC5BC]">28</div>
                <div className="p-2 text-center text-xs text-[#CEC5BC]">29</div>
                <div className="p-2 text-center text-xs text-[#CEC5BC]">30</div>
                <div className="p-2 text-center text-xs text-[#CEC5BC]">31</div>

                {/* Days 1 to 30 */}
                {Array.from({ length: 30 }).map((_, idx) => {
                  const day = idx + 1;
                  const status = calendarDays[day] || 'available';

                  let cellStyle = 'bg-white text-[#15110D] hover:bg-[#F4EFEB]';
                  if (status === 'confirmed') {
                    cellStyle = 'bg-[#FDD79C] text-[#785C2C] font-semibold cursor-default';
                  } else if (status === 'blocked') {
                    cellStyle = 'bg-[#2A2621] text-white font-semibold line-through';
                  }

                  return (
                    <button
                      key={day}
                      onClick={() => toggleDayStatus(day)}
                      title={
                        status === 'confirmed'
                          ? `Día ${day}: Reserva confirmada`
                          : status === 'blocked'
                          ? `Día ${day}: Bloqueado (clic para desbloquear)`
                          : `Día ${day}: Disponible (clic para bloquear)`
                      }
                      className={`p-2 text-center text-xs rounded border border-[#E8E2D8] transition-all cursor-pointer ${cellStyle}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Modo de Aceptación */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <h3 className="font-serif text-lg text-[#15110D] mb-3">Modo de Aceptación de Solicitudes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => {
                  setInstantBooking(true);
                  setHasChanges(true);
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  instantBooking ? 'border-[#15110D] bg-[#FAF8F5]' : 'border-[#E8E2D8] bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    checked={instantBooking}
                    onChange={() => {}}
                    className="text-[#15110D] focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-[#15110D]">Aceptación instantánea</span>
                </div>
                <p className="text-[11px] text-[#7D766E] pl-5">
                  Las solicitudes se aprueban de forma automática si las fechas están libres.
                </p>
              </label>

              <label
                onClick={() => {
                  setInstantBooking(false);
                  setHasChanges(true);
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  !instantBooking ? 'border-[#15110D] bg-[#FAF8F5]' : 'border-[#E8E2D8] bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    checked={!instantBooking}
                    onChange={() => {}}
                    className="text-[#15110D] focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-[#15110D]">Revisión manual</span>
                </div>
                <p className="text-[11px] text-[#7D766E] pl-5">
                  Tendrás hasta 24 hs para evaluar el perfil del conductor antes de confirmar.
                </p>
              </label>
            </div>
          </div>

          {/* 4. Ubicación y Punto de Entrega */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <h3 className="font-serif text-lg text-[#15110D] mb-4">Ubicación y Punto de Entrega</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Barrio o Localidad
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => {
                    setNeighborhood(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Punto de entrega de referencia
                </label>
                <input
                  type="text"
                  value={pickupPoint}
                  onChange={(e) => {
                    setPickupPoint(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-[11px] text-[#7D766E] flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#755A2A] shrink-0" />
              <span>
                Por seguridad, la dirección exacta y las instrucciones detalladas de entrega se revelan al conductor
                únicamente una vez confirmada la reserva.
              </span>
            </div>
          </div>

          {/* 5. Galería de Fotos */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg text-[#15110D]">Galería de Fotos</h3>
              <span className="text-xs text-[#7D766E]">{vehicle.images.length} de 15 fotos</span>
            </div>
            <p className="text-xs text-[#7D766E] mb-4">
              Arrastrá las imágenes para reorganizar el orden. La primera foto se mostrará como portada principal en los
              resultados de búsqueda.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {vehicle.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden border border-[#E8E2D8] group"
                >
                  <img src={img} alt="Auto" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-[#15110D] text-white text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold tracking-wider">
                      FOTO PRINCIPAL
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="border border-dashed border-[#DCD4C7] rounded-lg p-6 text-center bg-[#FAF8F5]">
              <Upload className="w-6 h-6 text-[#755A2A] mx-auto mb-2" />
              <div className="text-xs font-semibold text-[#15110D]">Subir nuevas imágenes del vehículo</div>
              <div className="text-[11px] text-[#7D766E] mt-0.5">Formato JPG o PNG de alta resolución (máx. 12 MB por foto)</div>
            </div>
          </div>

          {/* 6. Zona Crítica */}
          <div className="bg-white border border-red-200 rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 text-red-700 font-serif text-base mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Zona Crítica de la Publicación</span>
            </div>
            <p className="text-xs text-[#7D766E] mb-4">
              Pausar la publicación ocultará el vehículo del catálogo público de Volanta sin perder su historial ni las
              métricas acumuladas.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsPaused(!isPaused);
                  setHasChanges(true);
                }}
                className="text-xs border border-[#DCD4C7] hover:bg-[#FAF8F5] text-[#15110D] px-4 py-2 rounded transition-colors cursor-pointer"
              >
                {isPaused ? 'Reactivar publicación' : 'Pausar indefinidamente'}
              </button>
              <button
                onClick={() => alert('Para dar de baja una publicación con reservas completadas contactá a Soporte.')}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded transition-colors cursor-pointer"
              >
                Dar de baja publicación
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Performance & Upcoming booking */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          {/* Rendimiento Histórico */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E]">
                RENDIMIENTO HISTÓRICO
              </span>
              <TrendingUp className="w-4 h-4 text-[#755A2A]" />
            </div>

            <div className="mb-4">
              <span className="text-[11px] text-[#7D766E] block mb-0.5">Facturación total acumulada</span>
              <div className="text-2xl font-bold font-serif text-[#15110D] tabular-nums">
                $2.550.000 <span className="text-xs font-sans font-normal text-[#7D766E]">ARS</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F4EFEB] text-xs">
              <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                <span className="text-[10px] text-[#7D766E] block">Viajes finalizados</span>
                <span className="text-base font-semibold text-[#15110D]">34</span>
              </div>

              <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                <span className="text-[10px] text-[#7D766E] block">Calificación</span>
                <span className="text-base font-semibold text-[#15110D]">★ 4.98 (31)</span>
              </div>
            </div>
          </div>

          {/* Próximo Alquiler */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E]">
                PRÓXIMO ALQUILER
              </span>
              <span className="text-[10px] text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded font-semibold uppercase">
                Confirmado
              </span>
            </div>

            <div className="text-sm font-semibold text-[#15110D] mb-0.5">
              12 Nov 2024 — 16 Nov 2024 <span className="text-xs font-normal text-[#7D766E]">(4 días)</span>
            </div>
            <div className="text-xs text-[#7D766E] mb-2">
              Reserva #VOL-84920 · <strong className="text-[#15110D] font-medium">$300.000 ARS</strong>
            </div>
            <div className="text-xs text-[#4B463F] mb-4">
              👤 Conductor: Mariano G. (Nivel verificado)
            </div>

            <button
              onClick={onViewReservationDetail}
              className="w-full text-center text-xs border border-[#15110D] hover:bg-[#15110D] hover:text-white py-2 rounded transition-colors cursor-pointer"
            >
              Ver detalles de la reserva
            </button>
          </div>

          {/* Política Tarifaria */}
          <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg text-xs text-[#7D766E]">
            <span className="font-semibold text-[#15110D] block mb-1">
              Política sobre Modificación de Tarifas
            </span>
            Los cambios en la tarifa aplicarán únicamente a nuevas solicitudes, sin afectar reservas ya confirmadas o en
            curso bajo acuerdos previos.
          </div>

          {/* Help box */}
          <div className="p-4 bg-white border border-[#E8E2D8] rounded-lg text-xs text-[#7D766E]">
            <span className="font-semibold text-[#15110D] block mb-1">¿Dudas sobre la publicación?</span>
            Nuestro equipo de soporte para anfitriones de Volanta está disponible para asesorarte sobre precios
            sugeridos según estacionalidad.
            <div className="mt-2 text-[#15110D] font-medium underline underline-offset-2 cursor-pointer">
              Consultar con Soporte Anfitriones →
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Changes Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#15110D] text-white px-6 py-3.5 rounded-lg shadow-2xl flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#FDD79C] animate-pulse" />
            <span>Tenés cambios no guardados en tarifas y disponibilidad.</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                setDailyPrice(vehicle.pricePerDay);
                setWeeklyDiscount(vehicle.weeklyDiscountPercent);
                setMinDays(vehicle.minDays);
                setIsPaused(vehicle.status === 'pausada');
                setHasChanges(false);
              }}
              className="text-[#CEC5BC] hover:text-white transition-colors cursor-pointer"
            >
              Descartar cambios
            </button>
            <button
              onClick={handleSave}
              className="bg-white text-[#15110D] hover:bg-[#FAF8F5] px-4 py-2 rounded font-medium transition-colors cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="fixed bottom-6 right-6 bg-emerald-800 text-white px-5 py-3 rounded-lg shadow-lg text-xs flex items-center gap-2 z-50">
          <Check className="w-4 h-4" />
          <span>¡Cambios guardados con éxito en Volanta!</span>
        </div>
      )}
    </div>
  );
};
