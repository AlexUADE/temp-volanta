import React, { useState } from 'react';
import {
  Upload,
  ShieldCheck,
  Check,
  Car,
  TrendingUp,
  MapPin,
  Lock,
  Plus,
  Users,
  DoorClosed,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatARS } from '../utils/formatters';

interface PublishCarViewProps {
  onVehicleCreated: (newVehicle: Vehicle) => void;
  onCancel: () => void;
}

export const PublishCarView: React.FC<PublishCarViewProps> = ({ onVehicleCreated, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('Corolla 2.0 SEG');
  const [year, setYear] = useState(2022);
  const [category, setCategory] = useState<'Sedán' | 'Hatchback' | 'SUV' | 'Camioneta'>('Sedán');
  const [plate, setPlate] = useState('AF 392 PK');
  const [transmission, setTransmission] = useState<'Automática' | 'Manual'>('Automática');
  const [fuel, setFuel] = useState<'Nafta' | 'Diésel' | 'Híbrido' | 'Eléctrico'>('Nafta');
  const [seats, setSeats] = useState(5);
  const [doors, setDoors] = useState(4);
  const [mileage, setMileage] = useState(45000);
  const [neighborhood, setNeighborhood] = useState('Palermo Soho, CABA');
  const [pickupPoint, setPickupPoint] = useState('Cerca de Plaza Armenia (a coordinar)');
  const [pricePerDay, setPricePerDay] = useState(75000);

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: Vehicle = {
      id: `car-${Date.now()}`,
      brand,
      model,
      year,
      category,
      plate,
      color: 'Gris Plata',
      seats,
      doors,
      transmission,
      transmissionDetail: transmission === 'Automática' ? 'CVT / Secuencial' : '5 o 6 marchas',
      fuel,
      mileage,
      neighborhood: neighborhood.split(',')[0].trim(),
      city: 'CABA',
      pickupPoint,
      pricePerDay,
      minDays: 2,
      weeklyDiscountPercent: 10,
      instantBooking: true,
      images,
      description: `Excelente ${brand} ${model} ${year} en óptimas condiciones mecánicas y estéticas. Mantenimiento al día con services oficiales.`,
      hostName: 'Martín Gómez',
      hostPhone: '+54 11 4920-1122',
      hostRating: 5.0,
      hostTrips: 0,
      hostVerified: true,
      status: 'activa',
    };
    onVehicleCreated(newCar);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-wider text-[#7D766E] mb-1">
          PANEL DE PROPIETARIO · ALTA DE VEHÍCULO
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-2">
          Publicar mi Auto
        </h1>
        <p className="text-xs text-[#4B463F]">
          Completá los datos de tu vehículo para empezar a recibir solicitudes de alquiler en Volanta.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-4 border-b border-[#E8E2D8] text-xs">
        <div className="border-t-2 border-[#15110D] pt-2">
          <span className="font-semibold text-[#15110D] block">01 Información básica</span>
          <span className="text-[11px] text-[#755A2A] font-medium">EN CURSO</span>
        </div>
        <div className="border-t-2 border-[#DCD4C7] pt-2 text-[#7D766E]">
          <span className="font-medium block">02 Características</span>
          <span className="text-[11px] text-[#CEC5BC]">Pendiente</span>
        </div>
        <div className="border-t-2 border-[#DCD4C7] pt-2 text-[#7D766E]">
          <span className="font-medium block">03 Fotos</span>
          <span className="text-[11px] text-[#CEC5BC]">Pendiente</span>
        </div>
        <div className="border-t-2 border-[#DCD4C7] pt-2 text-[#7D766E]">
          <span className="font-medium block">04 Tarifas y calendario</span>
          <span className="text-[11px] text-[#CEC5BC]">Pendiente</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* 1. Datos del vehículo */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#DCD4C7] text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-serif text-lg text-[#15110D]">Datos del vehículo</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Marca *
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                >
                  <option value="Toyota">Toyota</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Ford">Ford</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Peugeot">Peugeot</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="BMW">BMW</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ej. Corolla 2.0 SEG"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Año de fabricación *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                >
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                  <option value={2021}>2021</option>
                  <option value={2020}>2020</option>
                  <option value={2019}>2019</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Tipo / Categoría *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                >
                  <option value="Sedán">Sedán</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
                  <option value="Camioneta">Camioneta</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="w-full sm:w-64">
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Patente / Dominio *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="AF 392 PK"
                    required
                    className="w-full px-3 py-2 pr-10 text-xs font-mono bg-white border border-[#DCD4C7] rounded uppercase tracking-wider focus:border-[#15110D] focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#7D766E] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E2D8]">
                    AR
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#7D766E] sm:pt-6">
                <Lock className="w-3 h-3 text-[#755A2A]" />
                <span>No será pública en el catálogo</span>
              </div>
            </div>
          </div>

          {/* 2. Especificaciones técnicas */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#DCD4C7] text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-serif text-lg text-[#15110D]">Especificaciones técnicas</h3>
            </div>

            {/* Transmisión */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-2">
                Transmisión *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setTransmission('Automática')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    transmission === 'Automática'
                      ? 'border-[#15110D] bg-[#FAF8F5]'
                      : 'border-[#E8E2D8] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    checked={transmission === 'Automática'}
                    onChange={() => {}}
                    className="text-[#15110D]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#15110D] block">Automática</span>
                    <span className="text-[11px] text-[#7D766E]">CVT / Secuencial</span>
                  </div>
                </label>

                <label
                  onClick={() => setTransmission('Manual')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    transmission === 'Manual'
                      ? 'border-[#15110D] bg-[#FAF8F5]'
                      : 'border-[#E8E2D8] bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    checked={transmission === 'Manual'}
                    onChange={() => {}}
                    className="text-[#15110D]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#15110D] block">Manual</span>
                    <span className="text-[11px] text-[#7D766E]">5 o 6 marchas</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Combustible */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-2">
                Combustible *
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {(['Nafta', 'Diésel', 'Híbrido', 'Eléctrico'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFuel(type)}
                    className={`px-4 py-2 rounded border transition-colors cursor-pointer ${
                      fuel === type
                        ? 'bg-[#15110D] text-white border-[#15110D]'
                        : 'bg-white text-[#4B463F] border-[#DCD4C7] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Asientos, Puertas, KM */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Asientos
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                  />
                  <Users className="w-3.5 h-3.5 text-[#7D766E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Puertas
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={doors}
                    onChange={(e) => setDoors(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                  />
                  <DoorClosed className="w-3.5 h-3.5 text-[#7D766E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Kilometraje actual
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                  />
                  <Gauge className="w-3.5 h-3.5 text-[#7D766E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Ubicación y entrega */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#DCD4C7] text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-serif text-lg text-[#15110D]">Ubicación y entrega</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Barrio / Localidad *
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Palermo Soho, CABA"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  Punto de entrega sugerido
                </label>
                <input
                  type="text"
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  placeholder="Cerca de Plaza Armenia (a coordinar)"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#7D766E]">
              La dirección exacta no se muestra públicamente hasta que una reserva sea confirmada y aceptada por vos.
            </p>
          </div>

          {/* 4. Fotos del vehículo */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#DCD4C7] text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="font-serif text-lg text-[#15110D]">Fotos del vehículo</h3>
              </div>
              <span className="text-xs text-[#7D766E]">{images.length} de 8 fotos cargadas</span>
            </div>

            <div className="border border-dashed border-[#DCD4C7] rounded-lg p-6 text-center bg-[#FAF8F5] mb-4">
              <Upload className="w-6 h-6 text-[#755A2A] mx-auto mb-2" />
              <div className="text-xs font-semibold text-[#15110D]">
                Subí hasta 8 fotos de tu vehículo (exterior e interior)
              </div>
              <div className="text-[11px] text-[#7D766E] mt-0.5 mb-3">
                Archivos JPG o PNG en alta resolución (mínimo 1200x800px).
              </div>

              <button
                type="button"
                onClick={() => {
                  setImages((prev) => [
                    ...prev,
                    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
                  ]);
                }}
                className="text-xs border border-[#15110D] hover:bg-[#15110D] hover:text-white px-4 py-1.5 rounded transition-colors cursor-pointer"
              >
                Seleccionar archivos
              </button>
            </div>

            {/* Uploaded thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden border border-[#E8E2D8]"
                >
                  <img src={img} alt="Foto" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-[#15110D] text-white text-[8px] font-bold px-1 rounded uppercase">
                      PRINCIPAL
                    </span>
                  )}
                </div>
              ))}

              {images.length < 8 && (
                <button
                  type="button"
                  onClick={() => {
                    setImages((prev) => [
                      ...prev,
                      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
                    ]);
                  }}
                  className="aspect-[16/10] border border-dashed border-[#DCD4C7] rounded bg-[#FAF8F5] flex flex-col items-center justify-center text-[#7D766E] hover:text-[#15110D] text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 mb-1" />
                  <span>Agregar</span>
                </button>
              )}
            </div>
          </div>

          {/* 5. Tarifa diaria sugerida */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#DCD4C7] text-[11px] font-bold flex items-center justify-center">
                5
              </span>
              <h3 className="font-serif text-lg text-[#15110D]">Tarifa diaria sugerida</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
                  PRECIO POR DÍA (ARS) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7D766E]">$</span>
                  <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(Number(e.target.value))}
                    className="w-full pl-7 pr-16 py-2.5 text-base font-semibold bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7D766E]">ARS / día</span>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg text-xs text-[#4B463F] flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-[#755A2A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#15110D] block mb-1">
                    Recomendación para este modelo
                  </span>
                  Vehículos similares ({brand} {model.split(' ')[0]} 2021–2023) en CABA tienen una tarifa promedio de{' '}
                  <strong className="text-[#15110D]">$72.000 a $82.000 ARS</strong> por día con alta tasa de ocupación
                  semanal.
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-[#7D766E] hover:text-[#15110D] border border-[#DCD4C7] px-4 py-2.5 rounded transition-colors cursor-pointer"
              >
                Guardar borrador
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-[#7D766E] hover:text-[#15110D] px-2 py-2 cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#15110D] hover:bg-[#2A2621] text-white text-xs font-medium px-6 py-3 rounded shadow-xs transition-colors cursor-pointer"
            >
              <span>Continuar al siguiente paso</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Sticky Preview */}
        <div className="lg:col-span-4 sticky top-20 space-y-6">
          {/* Card Preview */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E]">
                VISTA PREVIA DE LA FICHA
              </span>
              <span className="text-[10px] text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded font-medium">
                ● Borrador
              </span>
            </div>

            {/* Miniature Card */}
            <div className="border border-[#E8E2D8] rounded overflow-hidden mb-3">
              <div className="aspect-[16/10] bg-[#EFEEEB] relative">
                <img
                  src={images[0]}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#15110D] text-white text-[9px] uppercase px-2 py-0.5 rounded">
                  {category.toUpperCase()} · {year}
                </div>
              </div>

              <div className="p-4 bg-white">
                <h4 className="font-serif text-lg text-[#15110D] mb-1">
                  {brand} {model}
                </h4>
                <div className="text-xs text-[#7D766E] flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 text-[#755A2A]" />
                  <span>{neighborhood}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px] text-[#4B463F] mb-4">
                  <span className="bg-[#FAF8F5] border border-[#E8E2D8] px-2 py-0.5 rounded">
                    {transmission}
                  </span>
                  <span className="bg-[#FAF8F5] border border-[#E8E2D8] px-2 py-0.5 rounded">
                    {fuel}
                  </span>
                  <span className="bg-[#FAF8F5] border border-[#E8E2D8] px-2 py-0.5 rounded">
                    {seats} Asientos
                  </span>
                  <span className="bg-[#FAF8F5] border border-[#E8E2D8] px-2 py-0.5 rounded">
                    {doors} Puertas
                  </span>
                </div>

                <div className="pt-3 border-t border-[#F4EFEB] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-[#7D766E] uppercase block">TARIFA POR DÍA</span>
                    <span className="text-xl font-bold font-serif text-[#15110D] tabular-nums">
                      ${formatARS(pricePerDay)}
                    </span>
                    <span className="text-xs text-[#7D766E] ml-1">ARS</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    100% para el titular
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tranquilidad y Control Total */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs text-xs space-y-3">
            <h4 className="font-serif text-sm text-[#15110D] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#755A2A]" />
              <span>Tranquilidad y control total</span>
            </h4>

            <div className="flex items-start gap-2 text-[#4B463F]">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Validación rigurosa de identidad y licencia de cada conductor.</span>
            </div>

            <div className="flex items-start gap-2 text-[#4B463F]">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Vos decidís a quién aceptar y los horarios de retiro de las llaves.</span>
            </div>

            <div className="flex items-start gap-2 text-[#4B463F]">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Sin costos de publicación ni mensualidades fijas.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
