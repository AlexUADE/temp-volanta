import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  ChevronDown,
  Car,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Zap,
  Truck,
  Flame,
  Check,
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatARS } from '../utils/formatters';

interface CatalogViewProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

type CategoryFilter = 'all' | 'sedan' | 'suv' | 'pickup' | 'coupe';

export const CatalogView: React.FC<CatalogViewProps> = ({ vehicles, onSelectVehicle }) => {
  // Main Hero Filter Bar state
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [startDate, setStartDate] = useState('2025-11-14');
  const [endDate, setEndDate] = useState('2025-11-17');

  // Category filter state
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'year-desc'>('recommended');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((v) => {
      // Ignore paused listings
      if (v.status === 'pausada') return false;

      // Location match
      if (selectedLocation !== 'all') {
        const loc = selectedLocation.toLowerCase();
        const matchesNeighborhood = v.neighborhood.toLowerCase().includes(loc);
        const matchesCity = v.city.toLowerCase().includes(loc);
        if (!matchesNeighborhood && !matchesCity) return false;
      }

      // Category filter match
      if (categoryFilter === 'sedan') {
        if (v.category !== 'Sedán') return false;
      } else if (categoryFilter === 'suv') {
        if (v.category !== 'SUV' && v.fuel !== 'Híbrido') return false;
      } else if (categoryFilter === 'pickup') {
        if (v.category !== 'Camioneta') return false;
      } else if (categoryFilter === 'coupe') {
        // High-end sports / BMW
        const isSport =
          v.brand === 'BMW' ||
          v.model.toLowerCase().includes('sport') ||
          v.model.toLowerCase().includes('330i');
        if (!isSport) return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'year-desc') return b.year - a.year;
      // Recommended: highest rating first
      return b.hostRating - a.hostRating;
    });

    return result;
  }, [vehicles, selectedLocation, categoryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / itemsPerPage));
  const currentVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchClick = () => {
    const el = document.getElementById('fleet-results');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedLocation('all');
    setCategoryFilter('all');
    setSortBy('recommended');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
      {/* Hero Headline and Statement matching image.png */}
      <div className="max-w-4xl mb-10">
        <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-serif font-normal text-[#15110D] tracking-tight leading-[1.12] mb-5">
          Movilidad privada <br />
          <span className="italic font-serif text-[#8A6D3B]">sin compromisos.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#4B463F] leading-relaxed max-w-2xl font-sans font-normal">
          Alquiler directo entre propietarios seleccionados y miembros calificados. Cada unidad es entregada con
          rigurosa inspección técnica, póliza Todo Riesgo y atención concierge personal.
        </p>
      </div>

      {/* Floating Filter Bar Card matching image.png */}
      <div className="bg-white border border-[#E8E2D8] rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-sm mb-10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center">
          {/* 1. UBICACIÓN DE RETIRO */}
          <div className="flex-1 px-4 py-2 sm:py-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7D766E] mb-1">
              UBICACIÓN DE RETIRO
            </span>
            <div className="relative flex items-center">
              {/* MapPin with target circle */}
              <div className="relative mr-2.5 text-[#15110D] shrink-0">
                <MapPin className="w-4 h-4 text-[#755A2A]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#755A2A] rounded-full" />
              </div>

              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#15110D] focus:outline-none cursor-pointer pr-6 appearance-none"
              >
                <option value="all">Toda la Ciudad (CABA y GBA)</option>
                <option value="palermo">Palermo (Soho & Hollywood)</option>
                <option value="recoleta">Recoleta & Barrio Norte</option>
                <option value="belgrano">Belgrano & Núñez</option>
                <option value="puerto madero">Puerto Madero</option>
                <option value="caballito">Caballito</option>
                <option value="nordelta">Nordelta & Zona Norte</option>
                <option value="pilar">Pilar & Panamericana</option>
              </select>

              <ChevronDown className="w-3.5 h-3.5 text-[#7D766E] absolute right-0 pointer-events-none" />
            </div>
          </div>

          {/* Hairline Divider */}
          <div className="w-full lg:w-[1px] h-[1px] lg:h-10 bg-[#E8E2D8] my-1 lg:my-0" />

          {/* 2. FECHA DE RETIRO */}
          <div className="flex-1 px-4 py-2 sm:py-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7D766E] mb-1">
              FECHA DE RETIRO
            </span>
            <div className="relative flex items-center">
              <CalendarIcon className="w-4 h-4 text-[#755A2A] mr-2.5 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#15110D] focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Hairline Divider */}
          <div className="w-full lg:w-[1px] h-[1px] lg:h-10 bg-[#E8E2D8] my-1 lg:my-0" />

          {/* 3. FECHA DE DEVOLUCIÓN */}
          <div className="flex-1 px-4 py-2 sm:py-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7D766E] mb-1">
              FECHA DE DEVOLUCIÓN
            </span>
            <div className="relative flex items-center">
              <CalendarIcon className="w-4 h-4 text-[#755A2A] mr-2.5 shrink-0" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#15110D] focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Action Button: EXPLORAR FLOTA */}
          <div className="p-1 sm:p-1.5 shrink-0">
            <button
              onClick={handleSearchClick}
              className="w-full lg:w-auto bg-[#15110D] hover:bg-[#2A2621] text-white px-7 py-3.5 rounded-lg flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>EXPLORAR FLOTA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar + Sort Dropdown matching image.png */}
      <div
        id="fleet-results"
        className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8 pt-2"
      >
        {/* Horizontal Category Filters */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 xl:pb-0 scrollbar-none">
          {/* TODOS LOS VEHÍCULOS */}
          <button
            onClick={() => {
              setCategoryFilter('all');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'bg-[#F4EFEB] hover:bg-[#EAE8E5] text-[#15110D]'
            }`}
          >
            <Car className="w-4 h-4 stroke-[2]" />
            <span>TODOS LOS VEHÍCULOS</span>
          </button>

          {/* SEDANES EJECUTIVOS */}
          <button
            onClick={() => {
              setCategoryFilter('sedan');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'sedan'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'bg-[#F4EFEB] hover:bg-[#EAE8E5] text-[#15110D]'
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>SEDANES EJECUTIVOS</span>
          </button>

          {/* SUVS & HÍBRIDOS */}
          <button
            onClick={() => {
              setCategoryFilter('suv');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'suv'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'bg-[#F4EFEB] hover:bg-[#EAE8E5] text-[#15110D]'
            }`}
          >
            <div className="relative flex items-center">
              <Car className="w-4 h-4 stroke-[2]" />
              <Zap className="w-2.5 h-2.5 text-[#8A6D3B] absolute -top-1 -right-1" />
            </div>
            <span>SUVS & HÍBRIDOS</span>
          </button>

          {/* PICKUPS PREMIUM */}
          <button
            onClick={() => {
              setCategoryFilter('pickup');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'pickup'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'bg-[#F4EFEB] hover:bg-[#EAE8E5] text-[#15110D]'
            }`}
          >
            <Truck className="w-4 h-4 stroke-[2]" />
            <span>PICKUPS PREMIUM</span>
          </button>

          {/* COUPÉS & DEPORTIVOS */}
          <button
            onClick={() => {
              setCategoryFilter('coupe');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === 'coupe'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'bg-[#F4EFEB] hover:bg-[#EAE8E5] text-[#15110D]'
            }`}
          >
            <Flame className="w-4 h-4 stroke-[2]" />
            <span>COUPÉS & DEPORTIVOS</span>
          </button>
        </div>

        {/* ORDENAR POR Dropdown matching image.png */}
        <div className="flex items-center gap-2.5 self-end xl:self-auto shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D766E] whitespace-nowrap">
            ORDENAR POR:
          </span>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-white border border-[#DCD4C7] rounded px-3 py-1.5 pr-7 text-xs font-medium text-[#15110D] focus:border-[#15110D] focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value="recommended">Recomendados / Mejor calificados</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
              <option value="year-desc">Año más reciente</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7D766E] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Counter & Clear state */}
      <div className="flex items-center justify-between text-xs text-[#7D766E] mb-6 px-1">
        <span>
          Mostrando <strong className="text-[#15110D] font-semibold">{filteredVehicles.length}</strong> unidades
          disponibles bajo estándares de certificación
        </span>

        {(selectedLocation !== 'all' || categoryFilter !== 'all' || sortBy !== 'recommended') && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 hover:text-[#15110D] transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer filtros</span>
          </button>
        )}
      </div>

      {/* Vehicles Grid */}
      {currentVehicles.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E8E2D8] p-12 text-center my-6 shadow-xs">
          <Car className="w-12 h-12 text-[#CEC5BC] mx-auto mb-3" />
          <h3 className="font-serif text-lg text-[#15110D] mb-1">No se encontraron vehículos para esta selección</h3>
          <p className="text-xs text-[#7D766E] mb-4">
            Probá seleccionando "Todos los vehículos" o ampliando la zona de retiro en Buenos Aires.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs font-medium text-white bg-[#15110D] px-4 py-2 rounded hover:bg-[#2A2621] transition-colors cursor-pointer"
          >
            Ver toda la flota disponible
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {currentVehicles.map((car) => {
            return (
              <div
                key={car.id}
                className="group bg-white rounded-lg border border-[#E8E2D8] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Image Staging Container */}
                <div className="relative aspect-[16/10] bg-[#F4EFEB] overflow-hidden">
                  <img
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Fallback pattern if image is missing */}
                  <div className="absolute inset-0 -z-10 flex items-center justify-center bg-[#EFEEEB] text-[#7D766E]">
                    <Car className="w-10 h-10 opacity-40" />
                  </div>

                  {/* Discount / Category Badge */}
                  {car.discountBadge ? (
                    <div className="absolute top-3 left-3 bg-[#755A2A] text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded shadow-xs">
                      {car.discountBadge}
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-[#15110D]/85 backdrop-blur-xs text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                      {car.category}
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#15110D] text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                    ★ {car.hostRating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg text-[#15110D] font-normal tracking-tight mb-1">
                    {car.brand} {car.model} {car.year}
                  </h3>

                  <div className="text-xs text-[#7D766E] flex items-center gap-1.5 mb-5">
                    <span>{car.category}</span>
                    <span>·</span>
                    <span>{car.seats} asientos</span>
                    <span>·</span>
                    <span>
                      {car.neighborhood}, {car.city}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#F4EFEB] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-semibold text-[#15110D] tabular-nums font-serif">
                          ${formatARS(car.pricePerDay)}
                        </span>
                        <span className="text-xs text-[#7D766E]">/ día</span>
                      </div>
                      {car.originalPricePerDay && (
                        <div className="text-xs text-[#7D766E] line-through tabular-nums">
                          ${formatARS(car.originalPricePerDay)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectVehicle(car)}
                      className="text-xs font-medium text-[#15110D] hover:text-white border border-[#15110D] hover:bg-[#15110D] px-4 py-2 rounded transition-colors cursor-pointer"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E8E2D8] text-xs text-[#7D766E]">
        <div>
          Mostrando {filteredVehicles.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} de {filteredVehicles.length} vehículos
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              currentPage === 1 ? 'opacity-40 cursor-not-allowed text-[#CEC5BC]' : 'hover:text-[#15110D]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <span className="font-medium text-[#15110D]">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              currentPage === totalPages ? 'opacity-40 cursor-not-allowed text-[#CEC5BC]' : 'hover:text-[#15110D]'
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
