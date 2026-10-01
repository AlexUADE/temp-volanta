import React, { useState, useMemo } from 'react';
import { Plus, Search, MapPin, Eye, PauseCircle, PlayCircle, Edit3, HelpCircle, Star } from 'lucide-react';
import { Vehicle } from '../types';
import { formatARS } from '../utils/formatters';

interface MyListingsViewProps {
  vehicles: Vehicle[];
  onEditVehicle: (vehicle: Vehicle) => void;
  onPublishNew: () => void;
  onToggleStatus: (vehicleId: string) => void;
}

export const MyListingsView: React.FC<MyListingsViewProps> = ({
  vehicles,
  onEditVehicle,
  onPublishNew,
  onToggleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'paused' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Host vehicles (we can filter by the user's vehicles or display the owner fleet)
  const hostVehicles = useMemo(() => {
    return vehicles.slice(0, 4); // First 3-4 belong to Martín
  }, [vehicles]);

  const filtered = useMemo(() => {
    return hostVehicles.filter((v) => {
      if (activeTab === 'active' && v.status !== 'activa') return false;
      if (activeTab === 'paused' && v.status !== 'pausada') return false;
      if (activeTab === 'review' && v.status !== 'en_revision') return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          v.model.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.plate.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [hostVehicles, activeTab, searchQuery]);

  const counts = {
    all: hostVehicles.length,
    active: hostVehicles.filter((v) => v.status === 'activa').length,
    paused: hostVehicles.filter((v) => v.status === 'pausada').length,
    review: hostVehicles.filter((v) => v.status === 'en_revision').length,
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#7D766E] mb-1">
            <span>PANEL DE PROPIETARIO</span>
            <span>·</span>
            <span>GESTIÓN DE VEHÍCULOS</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-2">
            Mis Publicaciones
          </h1>
          <p className="text-xs text-[#4B463F] max-w-2xl">
            Administrá tus vehículos en alquiler, consultá el estado de disponibilidad y editá las condiciones de cada
            publicación.
          </p>
        </div>

        <button
          onClick={onPublishNew}
          className="flex items-center gap-1.5 bg-[#15110D] hover:bg-[#2A2621] text-white text-xs font-medium px-4 py-2.5 rounded shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar nuevo auto</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'text-[#4B463F] hover:bg-[#F4EFEB]'
            }`}
          >
            Todas ({counts.all})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'text-[#4B463F] hover:bg-[#F4EFEB]'
            }`}
          >
            Activas ({counts.active})
          </button>
          <button
            onClick={() => setActiveTab('paused')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'paused'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'text-[#4B463F] hover:bg-[#F4EFEB]'
            }`}
          >
            Pausadas ({counts.paused})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'review'
                ? 'bg-[#15110D] text-white shadow-xs'
                : 'text-[#4B463F] hover:bg-[#F4EFEB]'
            }`}
          >
            En revisión ({counts.review})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#7D766E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por modelo o patente..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
          />
        </div>
      </div>

      {/* Car Cards List */}
      <div className="space-y-4 mb-10">
        {filtered.map((car) => {
          const isActive = car.status === 'activa';

          return (
            <div
              key={car.id}
              className="bg-white border border-[#E8E2D8] rounded-lg p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                {/* Visual + Title */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
                  <div className="w-full sm:w-48 aspect-[16/10] bg-[#EFEEEB] rounded overflow-hidden shrink-0 relative">
                    <img
                      src={car.images[0]}
                      alt={car.model}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/95 text-[9px] font-semibold uppercase tracking-wider text-[#15110D] px-2 py-0.5 rounded shadow-xs">
                      {car.category} {car.category === 'Sedán' ? 'Ejecutivo' : car.category === 'SUV' ? 'Premium' : 'Urbano'}
                    </div>
                  </div>

                  <div>
                    {/* Status Pill & Plate */}
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                          isActive ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-amber-600'}`}
                        />
                        {isActive ? 'Activa · Visible en catálogo' : 'Pausada · No visible para reservas'}
                      </span>

                      <span className="text-[10px] font-mono bg-[#FAF8F5] border border-[#E8E2D8] px-2 py-0.5 rounded text-[#4B463F]">
                        Patente: {car.plate}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#15110D] mb-1">
                      {car.brand} {car.model} {car.year}
                    </h3>

                    <div className="text-xs text-[#7D766E] flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-[#755A2A]" />
                      <span>
                        {car.neighborhood}, {car.city === 'CABA' ? 'Ciudad Autónoma de Buenos Aires' : car.city}
                      </span>
                    </div>

                    {/* Meta stats */}
                    <div className="text-xs text-[#7D766E] flex flex-wrap items-center gap-2">
                      {car.activeBookingsCount ? (
                        <>
                          <span className="text-[#15110D] font-medium">
                            ⏱ {car.activeBookingsCount} reserva activa en curso
                          </span>
                          <span>·</span>
                        </>
                      ) : car.nextBookingDate ? (
                        <>
                          <span>📅 Próxima reserva: {car.nextBookingDate}</span>
                          <span>·</span>
                        </>
                      ) : null}

                      {car.pauseReason ? (
                        <span className="text-amber-800 text-[11px]">🔧 {car.pauseReason}</span>
                      ) : (
                        <>
                          <span>{car.hostTrips} alquileres completados</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-[#15110D] font-medium">
                            <Star className="w-3 h-3 text-[#755A2A] fill-[#755A2A]" />
                            {car.hostRating}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#F4EFEB]">
                  <div className="text-left lg:text-right">
                    <span className="text-2xl font-serif font-bold text-[#15110D] tabular-nums">
                      ${formatARS(car.pricePerDay)}
                    </span>
                    <span className="text-xs text-[#7D766E]"> / día</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(car.id)}
                      className="text-xs border border-[#DCD4C7] hover:bg-[#FAF8F5] text-[#15110D] px-3.5 py-2 rounded transition-colors cursor-pointer"
                    >
                      {isActive ? 'Pausar publicación' : 'Reactivar publicación'}
                    </button>

                    <button
                      onClick={() => onEditVehicle(car)}
                      className="text-xs bg-[#15110D] hover:bg-[#2A2621] text-white px-3.5 py-2 rounded transition-colors cursor-pointer font-medium"
                    >
                      Editar publicación
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support advisory footer card */}
      <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-[#755A2A]" />
          </div>
          <div>
            <h4 className="font-serif text-base text-[#15110D] mb-1">
              ¿Necesitás asesoramiento con tus publicaciones?
            </h4>
            <p className="text-xs text-[#7D766E] max-w-xl">
              ¿Querés optimizar tus tarifas según la estacionalidad de Buenos Aires o actualizar la documentación de tu
              vehículo? Nuestro equipo de soporte para anfitriones está disponible las 24 horas.
            </p>
          </div>
        </div>

        <a
          href="#soporte"
          onClick={(e) => {
            e.preventDefault();
            alert('Centro de Asistencia a Propietarios Volanta: Línea WhatsApp exclusiva para anfitriones.');
          }}
          className="text-xs text-[#15110D] hover:underline font-semibold shrink-0 cursor-pointer"
        >
          Ir al Centro de ayuda para anfitriones →
        </a>
      </div>
    </div>
  );
};
