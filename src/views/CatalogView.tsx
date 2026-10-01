import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Tag, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatearMoneda } from '../utils/pricing';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export const CatalogView: React.FC = () => {
  const { getPublicacionesActivas } = useApp();
  const publicaciones = getPublicacionesActivas();

  // Simple backend-compatible filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');
  const [maxPrecio, setMaxPrecio] = useState<number | ''>('');

  // Extract unique types and locations
  const vehicleTypes = useMemo(() => {
    const set = new Set<string>();
    publicaciones.forEach((p) => {
      if (p.vehiculo?.tipoVehiculo) set.add(p.vehiculo.tipoVehiculo);
    });
    return Array.from(set);
  }, [publicaciones]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    publicaciones.forEach((p) => {
      if (p.ubicacion?.ciudad) set.add(p.ubicacion.ciudad);
    });
    return Array.from(set);
  }, [publicaciones]);

  // Filtered publications
  const filtered = useMemo(() => {
    return publicaciones.filter((pub) => {
      const v = pub.vehiculo;
      const u = pub.ubicacion;

      // Text search in brand or model
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const brandMatch = v?.marca.toLowerCase().includes(query);
        const modelMatch = v?.modelo.toLowerCase().includes(query);
        if (!brandMatch && !modelMatch) return false;
      }

      // Filter by vehicle type
      if (selectedTipo && v?.tipoVehiculo !== selectedTipo) {
        return false;
      }

      // Filter by location (city)
      if (selectedUbicacion && u?.ciudad !== selectedUbicacion) {
        return false;
      }

      // Filter by max price
      if (maxPrecio !== '' && pub.precioDia > Number(maxPrecio)) {
        return false;
      }

      return true;
    });
  }, [publicaciones, searchTerm, selectedTipo, selectedUbicacion, maxPrecio]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedTipo('');
    setSelectedUbicacion('');
    setMaxPrecio('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Editorial Header */}
      <section className="border-b border-[#e4e2df] pb-8 pt-2">
        <span className="text-xs uppercase tracking-widest text-[#755a2a] font-semibold block mb-2">
          Movilidad compartida en Argentina
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#15110d] font-bold tracking-tight max-w-2xl mb-3">
          Alquiler de vehículos directamente entre particulares
        </h1>
        <p className="text-sm sm:text-base text-[#4b463f] max-w-2xl leading-relaxed">
          Encuentra el auto adecuado para tus viajes o paseos. Alquila de forma simple con gestión de reservas y tarifas transparentes.
        </p>
      </section>

      {/* Backend-compatible simple filters */}
      <section className="bg-white border border-[#cec5bc] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#efeeeb] text-xs font-semibold text-[#1b1c1a] uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#755a2a]" />
          <span>Filtros de búsqueda</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Marca / Modelo Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4b463f]">Marca o modelo</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Toyota, Taos, Cruze..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#cec5bc] rounded-md focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
              />
              <Search className="w-3.5 h-3.5 text-[#7d766e] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Tipo de vehículo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4b463f]">Tipo de vehículo</label>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#cec5bc] rounded-md focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
            >
              <option value="">Todos los tipos</option>
              {vehicleTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Ubicación */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4b463f]">Ciudad / Ubicación</label>
            <select
              value={selectedUbicacion}
              onChange={(e) => setSelectedUbicacion(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#cec5bc] rounded-md focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
            >
              <option value="">Todas las ciudades</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Precio máximo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4b463f]">Precio máximo por día</label>
            <input
              type="number"
              placeholder="Ej. 90000"
              value={maxPrecio}
              onChange={(e) => setMaxPrecio(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 text-xs bg-white border border-[#cec5bc] rounded-md focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] outline-none"
            />
          </div>
        </div>

        {(searchTerm || selectedTipo || selectedUbicacion || maxPrecio !== '') && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#755a2a] hover:underline cursor-pointer font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      {/* Publications Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[#7d766e]">
            Mostrando <span className="font-semibold text-[#1b1c1a]">{filtered.length}</span>{' '}
            publicaciones disponibles
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Sin publicaciones para los filtros seleccionados"
            description="No encontramos vehículos activos que coincidan con tus criterios de búsqueda. Prueba modificando los filtros."
            actionText="Ver todas las publicaciones"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pub) => {
              const v = pub.vehiculo;
              const u = pub.ubicacion;
              const portada = v?.imagenes?.[0]?.url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';
              const precioConDescuento = pub.descuentoPorcentaje
                ? Math.round(pub.precioDia * (1 - pub.descuentoPorcentaje / 100))
                : pub.precioDia;

              return (
                <div
                  key={pub.idPublicacion}
                  className="group bg-white border border-[#e4e2df] hover:border-[#cec5bc] rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Photo container */}
                  <div className="relative aspect-[16/10] bg-[#efeeeb] overflow-hidden">
                    <img
                      src={portada}
                      alt={`${v?.marca} ${v?.modelo}`}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    {pub.descuentoPorcentaje > 0 && (
                      <div className="absolute top-3 left-3 bg-[#755a2a] text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{pub.descuentoPorcentaje}% OFF</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                      {v?.tipoVehiculo}
                    </div>
                  </div>

                  {/* Vehicle specs and info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#15110d] group-hover:text-[#755a2a] transition-colors">
                        {v?.marca} {v?.modelo}
                      </h3>
                      <p className="text-xs text-[#7d766e] mt-0.5">
                        Año {v?.anio} · {v?.color}
                      </p>

                      <div className="mt-3 flex items-center gap-4 text-xs text-[#4b463f]">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#7d766e]" />
                          {v?.cantidadAsientos} asientos
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#7d766e]" />
                          {u?.localidad || u?.ciudad}, {u?.ciudad}
                        </span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-3 border-t border-[#efeeeb] flex items-end justify-between">
                      <div>
                        <span className="text-[11px] text-[#7d766e] uppercase tracking-wider block">
                          Tarifa por día
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#15110d]">
                            {formatearMoneda(precioConDescuento)}
                          </span>
                          {pub.descuentoPorcentaje > 0 && (
                            <span className="text-xs text-[#7d766e] line-through">
                              {formatearMoneda(pub.precioDia)}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link to={`/publicacion/${pub.idPublicacion}`}>
                        <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Ver detalle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
