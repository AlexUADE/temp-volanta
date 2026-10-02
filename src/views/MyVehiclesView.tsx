import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Plus, Edit, Image, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { getEstadoPublicacionBadge } from '../utils/formatters';

export const MyVehiclesView: React.FC = () => {
  const { getVehiculosPropios, getPublicacionVigenteDeVehiculo, currentUser } = useApp();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1b1c1a]">Inicia sesión</h2>
        <p className="text-xs sm:text-sm text-[#4b463f]">
          Debes estar autenticado para ver y administrar tus vehículos.
        </p>
        <Link to="/login">
          <Button variant="primary" size="md">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    );
  }

  const misVehiculos = getVehiculosPropios();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d8] pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#755a2a] block mb-1">
            Flota propia
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#15110d]">Mis Vehículos</h1>
          <p className="text-xs sm:text-sm text-[#4b463f] mt-1">
            Administra tus vehículos registrados, fotos y publicaciones asociadas.
          </p>
        </div>

        <Link to="/mis-vehiculos/nuevo">
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Registrar vehículo
          </Button>
        </Link>
      </div>

      {misVehiculos.length === 0 ? (
        <EmptyState
          icon={<Car className="w-6 h-6 text-[#755a2a]" />}
          title="Aún no tienes vehículos registrados"
          description="Registra los datos de tu vehículo para luego poder crear una publicación y ofrecerlo en alquiler."
          actionText="Registrar mi primer vehículo"
          onAction={() => navigate('/mis-vehiculos/nuevo')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {misVehiculos.map((v) => {
            const portada =
              v.imagenes?.[0]?.url ||
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';
            const publicacionVigente = getPublicacionVigenteDeVehiculo(v.idVehiculo);

            return (
              <div
                key={v.idVehiculo}
                className="bg-white border border-[#e8e2d8] rounded-[8px] overflow-hidden shadow-[0_1px_2px_rgba(21,17,13,0.06)] hover:shadow-[0_8px_24px_rgba(21,17,13,0.08)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative aspect-[16/10] bg-[#f4efeb] overflow-hidden">
                    <img
                      src={portada}
                      alt={`${v.marca} ${v.modelo}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#15110d]/80 backdrop-blur-xs text-white text-[9px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-[3px]">
                      {v.tipoVehiculo}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-[#15110d] text-[11px] font-mono font-bold px-2 py-0.5 rounded-[3px] border border-[#e8e2d8]">
                      {v.patente}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif text-lg text-[#15110d]">
                        {v.marca} {v.modelo}
                      </h3>
                      <p className="text-xs text-[#7d766e]">
                        Año {v.anio} · {v.color} · {v.cantidadAsientos} asientos
                      </p>
                    </div>

                    {/* Listing Status Indicator */}
                    <div className="pt-2 border-t border-[#f4efeb]">
                      {publicacionVigente ? (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#7d766e]">Publicación vigente:</span>
                          <span
                            className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold ${
                              getEstadoPublicacionBadge(publicacionVigente.estado).classes
                            }`}
                          >
                            {getEstadoPublicacionBadge(publicacionVigente.estado).label}
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-[#7d766e]">
                          Sin publicación activa o pausada
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-[#faf8f5] border-t border-[#f4efeb] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/mis-vehiculos/${v.idVehiculo}/editar`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full" icon={<Edit className="w-3.5 h-3.5" />}>
                        Editar
                      </Button>
                    </Link>
                    <Link
                      to={`/mis-vehiculos/${v.idVehiculo}/fotos`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full" icon={<Image className="w-3.5 h-3.5" />}>
                        Fotos ({v.imagenes?.length || 0})
                      </Button>
                    </Link>
                  </div>

                  {/* Create or Manage Listing */}
                  {publicacionVigente ? (
                    <Link
                      to={`/publicaciones/${publicacionVigente.idPublicacion}/editar`}
                      className="w-full"
                    >
                      <Button variant="secondary" size="sm" className="w-full" icon={<FileText className="w-3.5 h-3.5" />}>
                        Gestionar publicación
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      to={`/publicaciones/nueva?vehiculoId=${v.idVehiculo}`}
                      className="w-full"
                    >
                      <Button variant="primary" size="sm" className="w-full bg-[#15110d]" icon={<Plus className="w-3.5 h-3.5" />}>
                        Crear publicación
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
