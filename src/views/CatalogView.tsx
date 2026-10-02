import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ChevronDown,
  Search,
  RotateCcw,
  Car,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatearMoneda } from '../utils/pricing';
import { Publicacion } from '../types';

export const CatalogView: React.FC = () => {
  const { getPublicacionesActivas } = useApp();
  const publicaciones = getPublicacionesActivas();
  const navigate = useNavigate();

  // SearchBar states
  const [selectedZona, setSelectedZona] = useState<string>('all');
  const [fechaRetiro, setFechaRetiro] = useState<string>('');
  const [fechaDevolucion, setFechaDevolucion] = useState<string>('');

  // Category & Sorting states (outside search bar)
  const [selectedTipo, setSelectedTipo] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Extract unique locations and vehicle types
  const zonas = useMemo(() => {
    const set = new Set<string>();
    publicaciones.forEach((p) => {
      if (p.ubicacion?.zona) set.add(p.ubicacion.zona);
      else if (p.ubicacion?.ciudad) set.add(p.ubicacion.ciudad);
    });
    return Array.from(set).sort();
  }, [publicaciones]);

  const vehicleTypes = useMemo(() => {
    const set = new Set<string>();
    publicaciones.forEach((p) => {
      if (p.vehiculo?.tipoVehiculo) set.add(p.vehiculo.tipoVehiculo);
    });
    return Array.from(set);
  }, [publicaciones]);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let result = publicaciones.filter((pub) => {
      const v = pub.vehiculo;
      const u = pub.ubicacion;

      // Filter by zona/city
      if (selectedZona !== 'all') {
        const matchesZona = u?.zona === selectedZona || u?.ciudad === selectedZona;
        if (!matchesZona) return false;
      }

      // Filter by vehicle type
      if (selectedTipo !== 'all' && v?.tipoVehiculo !== selectedTipo) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      const descA = a.descuentoPorcentaje ? Math.round(a.precioDia * (1 - a.descuentoPorcentaje / 100)) : a.precioDia;
      const descB = b.descuentoPorcentaje ? Math.round(b.precioDia * (1 - b.descuentoPorcentaje / 100)) : b.precioDia;

      if (sortBy === 'price-asc') return descA - descB;
      if (sortBy === 'price-desc') return descB - descA;
      if (sortBy === 'year-desc') return (b.vehiculo?.anio || 0) - (a.vehiculo?.anio || 0);
      return 0; // recommended
    });

    return result;
  }, [publicaciones, selectedZona, selectedTipo, sortBy]);

  const hayFiltros = selectedZona !== 'all' || selectedTipo !== 'all' || sortBy !== 'recommended';

  const resetFiltros = () => {
    setSelectedZona('all');
    setSelectedTipo('all');
    setSortBy('recommended');
  };

  const handleSearchScroll = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('fleet-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-14 space-y-10">
      {/* Hero Section */}
      <section className="max-w-[42rem]">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.12] tracking-[-0.02em] text-[#15110d] font-normal mb-5">
          Movilidad privada <br />
          <em className="italic text-[#8a6d3b]">sin compromisos.</em>
        </h1>
        <p className="text-[15px] sm:text-base leading-[1.7] text-[#4b463f]">
          Alquiler directo de vehículos entre particulares. Gestiona tus reservas con tarifas transparentes y entrega acordada en tu zona.
        </p>
      </section>

      {/* Integrated Search Bar (16px radius desktop, 12px mobile) */}
      <form
        onSubmit={handleSearchScroll}
        className="flex flex-col lg:flex-row items-stretch lg:items-center bg-white border border-[#e8e2d8] rounded-[12px] lg:rounded-[16px] p-2 lg:p-2.5 shadow-[0_1px_2px_rgba(21,17,13,0.06)]"
      >
        {/* Field 1: Location */}
        <label className="flex-1 block p-3 sm:px-4 sm:py-3 cursor-pointer">
          <span className="block mb-1 text-[10px] font-bold tracking-[0.1em] uppercase text-[#7d766e]">
            Ubicación de retiro
          </span>
          <span className="relative flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#755a2a] shrink-0" />
            <select
              value={selectedZona}
              onChange={(e) => setSelectedZona(e.target.value)}
              className="w-full p-0 bg-transparent border-0 text-[13px] font-medium text-[#15110d] appearance-none pr-6 outline-none cursor-pointer"
            >
              <option value="all">Todas las zonas</option>
              {zonas.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#7d766e] absolute right-0 pointer-events-none" />
          </span>
        </label>

        {/* Field 2: Pickup date (desktop border left) */}
        <label className="flex-1 block p-3 sm:px-4 sm:py-3 border-t lg:border-t-0 lg:border-l border-[#e8e2d8] cursor-pointer">
          <span className="block mb-1 text-[10px] font-bold tracking-[0.1em] uppercase text-[#7d766e]">
            Fecha de retiro
          </span>
          <span className="relative flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#755a2a] shrink-0" />
            <input
              type="date"
              value={fechaRetiro}
              max={fechaDevolucion || undefined}
              onChange={(e) => setFechaRetiro(e.target.value)}
              className="w-full p-0 bg-transparent border-0 text-[13px] font-medium text-[#15110d] outline-none cursor-pointer"
            />
          </span>
        </label>

        {/* Field 3: Return date (desktop border left) */}
        <label className="flex-1 block p-3 sm:px-4 sm:py-3 border-t lg:border-t-0 lg:border-l border-[#e8e2d8] cursor-pointer">
          <span className="block mb-1 text-[10px] font-bold tracking-[0.1em] uppercase text-[#7d766e]">
            Fecha de devolución
          </span>
          <span className="relative flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#755a2a] shrink-0" />
            <input
              type="date"
              value={fechaDevolucion}
              min={fechaRetiro || undefined}
              onChange={(e) => setFechaDevolucion(e.target.value)}
              className="w-full p-0 bg-transparent border-0 text-[13px] font-medium text-[#15110d] outline-none cursor-pointer"
            />
          </span>
        </label>

        {/* Submit button (8px radius) */}
        <button
          type="submit"
          className="m-2 lg:m-0 lg:ml-2 px-7 py-3.5 lg:py-4 bg-[#15110d] hover:bg-[#2a2621] text-white rounded-[8px] text-[11px] font-bold tracking-[0.06em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Explorar flota</span>
        </button>
      </form>

      {/* Fleet Section */}
      <section id="fleet-results" className="space-y-6 pt-2">
        {/* Toolbar: Category filters & Sort select */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category filter pills (4px radius) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar" role="group">
            <button
              type="button"
              onClick={() => setSelectedTipo('all')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-[11px] font-bold tracking-[0.06em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                selectedTipo === 'all'
                  ? 'bg-[#15110d] text-white'
                  : 'bg-[#f4efeb] text-[#4b463f] hover:bg-[#ebe4dc] hover:text-[#15110d]'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Todos los vehículos</span>
            </button>
            {vehicleTypes.map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setSelectedTipo(tipo)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-[11px] font-bold tracking-[0.06em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTipo === tipo
                    ? 'bg-[#15110d] text-white'
                    : 'bg-[#f4efeb] text-[#4b463f] hover:bg-[#ebe4dc] hover:text-[#15110d]'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>

          {/* Sort select */}
          <label className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#7d766e]">
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-[#e8e2d8] rounded-[4px] text-xs text-[#15110d] cursor-pointer outline-none focus:border-[#755a2a]"
            >
              <option value="recommended">Recomendados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="year-desc">Más nuevos</option>
            </select>
          </label>
        </div>

        {/* Summary text */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#7d766e]">
          <span>
            Mostrando <strong className="text-[#15110d]">{filteredAndSorted.length}</strong>{' '}
            publicaciones activas
          </span>
          {hayFiltros && (
            <button
              type="button"
              onClick={resetFiltros}
              className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#15110d] transition-colors cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer filtros</span>
            </button>
          )}
        </div>

        {/* Vehicle Grid */}
        {filteredAndSorted.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#7d766e]">
            No se encontraron publicaciones activas para esta selección.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((pub) => {
              const v = pub.vehiculo;
              const u = pub.ubicacion;
              const descuento = pub.descuentoPorcentaje || 0;
              const tieneDescuento = descuento > 0;
              const precioDiaFinal = tieneDescuento
                ? Math.round(pub.precioDia * (1 - descuento / 100))
                : pub.precioDia;
              const portada =
                v?.imagenes?.[0]?.url ||
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';

              // Carry over dates from search bar to detail if provided
              const detailUrl =
                fechaRetiro && fechaDevolucion
                  ? `/publicacion/${pub.idPublicacion}?inicio=${fechaRetiro}&fin=${fechaDevolucion}`
                  : `/publicacion/${pub.idPublicacion}`;

              return (
                <article
                  key={pub.idPublicacion}
                  className="flex flex-col overflow-hidden bg-white border border-[#e8e2d8] rounded-[8px] transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(21,17,13,0.1)] group"
                >
                  {/* Media */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#f4efeb]">
                    <img
                      src={portada}
                      alt={`${v?.marca} ${v?.modelo}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    {tieneDescuento ? (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-[3px] bg-[#755a2a] text-white text-[10px] font-bold tracking-[0.06em]">
                        -{descuento}%
                      </span>
                    ) : (
                      v?.tipoVehiculo && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-[3px] bg-[#15110d]/85 backdrop-blur-xs text-white text-[9px] font-semibold tracking-[0.08em] uppercase">
                          {v.tipoVehiculo}
                        </span>
                      )
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-lg tracking-[-0.01em] text-[#15110d] mb-1">
                      {v?.marca} {v?.modelo} {v?.anio}
                    </h3>
                    <p className="flex flex-wrap items-center text-xs text-[#7d766e] mb-5">
                      {v?.tipoVehiculo && <span>{v.tipoVehiculo}</span>}
                      {v?.tipoVehiculo && <span className="mx-1.5">·</span>}
                      <span>{v?.cantidadAsientos} asientos</span>
                      <span className="mx-1.5">·</span>
                      <span>
                        {u?.localidad || u?.ciudad}, {u?.ciudad}
                      </span>
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-[#f4efeb]">
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="font-serif text-lg font-semibold text-[#15110d]">
                          {formatearMoneda(precioDiaFinal)}
                        </span>
                        <span className="text-xs text-[#7d766e]">/ día</span>
                        {tieneDescuento && (
                          <span className="w-full text-xs line-through text-[#7d766e]">
                            {formatearMoneda(pub.precioDia)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(detailUrl)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-[#e8e2d8] rounded-[4px] bg-transparent text-[#15110d] text-xs font-medium hover:bg-[#15110d] hover:text-white hover:border-[#15110d] transition-colors cursor-pointer"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
