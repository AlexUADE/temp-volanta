import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Edit,
  Calendar,
  Pause,
  Play,
  Ban,
  Tag,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EstadoPublicacion, Publicacion } from '../types';
import { formatearMoneda } from '../utils/pricing';
import { getEstadoPublicacionBadge } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';

export const MyListingsView: React.FC = () => {
  const {
    getPublicacionesPropias,
    pausarPublicacion,
    reactivarPublicacion,
    desactivarPublicacion,
    currentUser,
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<EstadoPublicacion | 'TODAS'>('TODAS');
  const [selectedPubForDeactivate, setSelectedPubForDeactivate] = useState<Publicacion | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">Inicia sesión</h2>
        <p className="text-sm text-[#4b463f]">
          Debes estar autenticado para ver y administrar tus publicaciones.
        </p>
        <Link to="/login">
          <Button variant="primary" size="md">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  const misPublicaciones = getPublicacionesPropias();

  const filtered =
    activeTab === 'TODAS'
      ? misPublicaciones
      : misPublicaciones.filter((p) => p.estado === activeTab);

  const handleConfirmDeactivate = () => {
    if (!selectedPubForDeactivate) return;
    desactivarPublicacion(selectedPubForDeactivate.idPublicacion);
    setSelectedPubForDeactivate(null);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e2df] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#755a2a] font-semibold block mb-1">
            Gestión de alquiler
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#15110d]">Mis Publicaciones</h1>
          <p className="text-sm text-[#4b463f] mt-1">
            Administra los precios, ubicaciones, horarios y disponibilidad de tus vehículos publicados.
          </p>
        </div>

        <Link to="/publicaciones/nueva">
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Crear publicación
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e4e2df] pb-3 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
        {(['TODAS', 'ACTIVA', 'PAUSADA', 'DESACTIVADA'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#15110d] text-white'
                : 'text-[#4b463f] hover:text-[#1b1c1a] hover:bg-[#efeeeb]'
            }`}
          >
            {tab === 'TODAS' ? 'Todas' : tab} (
            {tab === 'TODAS'
              ? misPublicaciones.length
              : misPublicaciones.filter((p) => p.estado === tab).length}
            )
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6 text-[#755a2a]" />}
          title="No hay publicaciones en este estado"
          description="Crea una nueva publicación a partir de uno de tus vehículos registrados o cambia el filtro de estado."
          actionText="Crear nueva publicación"
          onAction={() => navigate('/publicaciones/nueva')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pub) => {
            const v = pub.vehiculo;
            const u = pub.ubicacion;
            const portada =
              v?.imagenes?.[0]?.url ||
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';
            const badge = getEstadoPublicacionBadge(pub.estado);

            return (
              <div
                key={pub.idPublicacion}
                className="bg-white border border-[#cec5bc] rounded-lg overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative aspect-[16/10] bg-[#efeeeb] overflow-hidden">
                    <img
                      src={portada}
                      alt={`${v?.marca} ${v?.modelo}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold shadow-xs ${badge.classes}`}>
                        {badge.label}
                      </span>
                    </div>
                    {pub.descuentoPorcentaje > 0 && (
                      <div className="absolute top-3 left-3 bg-[#755a2a] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{pub.descuentoPorcentaje}% OFF</span>
                      </div>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#1b1c1a]">
                        {v?.marca} {v?.modelo}
                      </h3>
                      <p className="text-xs text-[#7d766e]">
                        Año {v?.anio} · Patente {v?.patente}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#4b463f] pt-2 border-t border-[#efeeeb]">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#755a2a] shrink-0" />
                        <span>
                          {u?.localidad || u?.ciudad}, {u?.ciudad}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#755a2a] shrink-0" />
                        <span>Retiro y devolución fijo: {pub.horaRetiroDevolucion} hs</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#efeeeb] flex items-baseline justify-between">
                      <span className="text-xs text-[#7d766e]">Tarifa diaria:</span>
                      <span className="text-base font-bold text-[#15110d]">
                        {formatearMoneda(pub.precioDia)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer according to state */}
                <div className="p-4 bg-[#fbf9f6] border-t border-[#efeeeb] flex flex-col gap-2">
                  {pub.estado === 'ACTIVA' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/publicaciones/${pub.idPublicacion}/editar`}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full" icon={<Edit className="w-3.5 h-3.5" />}>
                            Editar
                          </Button>
                        </Link>
                        <Link
                          to={`/publicaciones/${pub.idPublicacion}/disponibilidad`}
                          className="flex-1"
                        >
                          <Button variant="secondary" size="sm" className="w-full" icon={<Calendar className="w-3.5 h-3.5" />}>
                            Disponibilidad
                          </Button>
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs"
                          icon={<Pause className="w-3.5 h-3.5" />}
                          onClick={() => pausarPublicacion(pub.idPublicacion)}
                        >
                          Pausar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                          icon={<Ban className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedPubForDeactivate(pub)}
                        >
                          Desactivar
                        </Button>
                      </div>
                    </>
                  )}

                  {pub.estado === 'PAUSADA' && (
                    <>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/publicaciones/${pub.idPublicacion}/editar`}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full" icon={<Edit className="w-3.5 h-3.5" />}>
                            Editar
                          </Button>
                        </Link>
                        <Link
                          to={`/publicaciones/${pub.idPublicacion}/disponibilidad`}
                          className="flex-1"
                        >
                          <Button variant="secondary" size="sm" className="w-full" icon={<Calendar className="w-3.5 h-3.5" />}>
                            Disponibilidad
                          </Button>
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1 text-xs"
                          icon={<Play className="w-3.5 h-3.5" />}
                          onClick={() => reactivarPublicacion(pub.idPublicacion)}
                        >
                          Reactivar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                          icon={<Ban className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedPubForDeactivate(pub)}
                        >
                          Desactivar
                        </Button>
                      </div>
                    </>
                  )}

                  {pub.estado === 'DESACTIVADA' && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-[#7d766e] text-center">
                        Publicación histórica en solo lectura. No se puede reactivar.
                      </p>
                      <Link to={`/publicacion/${pub.idPublicacion}`}>
                        <Button variant="outline" size="sm" className="w-full" icon={<Eye className="w-3.5 h-3.5" />}>
                          Ver ficha histórica
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog for Deactivation */}
      <ConfirmDialog
        isOpen={Boolean(selectedPubForDeactivate)}
        title="¿Desactivar esta publicación?"
        message={`Estás a punto de desactivar la publicación de ${selectedPubForDeactivate?.vehiculo?.marca} ${selectedPubForDeactivate?.vehiculo?.modelo}.\n\nEsta acción convertirá la publicación en histórica y ya no podrá reactivarse. Tu vehículo seguirá registrado y podrás crear una nueva publicación cuando lo desees.`}
        confirmText="Sí, desactivar publicación"
        cancelText="Volver"
        isDestructive
        onConfirm={handleConfirmDeactivate}
        onClose={() => setSelectedPubForDeactivate(null)}
      />
    </div>
  );
};
