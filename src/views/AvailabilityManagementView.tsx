import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Disponibilidad } from '../types';
import { formatearFecha, hoyString, sumarDias } from '../utils/pricing';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FormField, inputClass } from '../components/ui/FormField';

export const AvailabilityManagementView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const recienCreada = searchParams.get('creada') === 'true';

  const navigate = useNavigate();
  const {
    getPublicacionCompleta,
    getDisponibilidadesPorPublicacion,
    agregarDisponibilidad,
    actualizarDisponibilidad,
    eliminarDisponibilidad,
    currentUser,
  } = useApp();

  const publicacion = id ? getPublicacionCompleta(id) : undefined;
  const rangos = id ? getDisponibilidadesPorPublicacion(id) : [];

  const hoy = hoyString();

  // Add new range states
  const [nuevoInicio, setNuevoInicio] = useState(sumarDias(hoy, 1));
  const [nuevoFin, setNuevoFin] = useState(sumarDias(hoy, 15));
  const [formError, setFormError] = useState<string | null>(null);

  // Edit range state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInicio, setEditInicio] = useState('');
  const [editFin, setEditFin] = useState('');

  // Delete dialog state
  const [rangoToDelete, setRangoToDelete] = useState<Disponibilidad | null>(null);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (!publicacion) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-sm text-[#4b463f]">Publicación no encontrada.</p>
        <Link to="/mis-publicaciones">
          <Button variant="outline" size="sm" className="mt-4">
            Volver a mis publicaciones
          </Button>
        </Link>
      </div>
    );
  }

  const v = publicacion.vehiculo;

  const handleCreateRange = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nuevoInicio || !nuevoFin) {
      setFormError('Indica ambas fechas para el rango.');
      return;
    }
    if (nuevoInicio < hoy) {
      setFormError('La fecha de inicio no puede ser anterior a hoy.');
      return;
    }
    if (nuevoFin <= nuevoInicio) {
      setFormError('La fecha de fin debe ser estrictamente posterior a la de inicio.');
      return;
    }

    agregarDisponibilidad(publicacion.idPublicacion, nuevoInicio, nuevoFin);
    // Reset to next default range
    setNuevoInicio(sumarDias(nuevoFin, 2));
    setNuevoFin(sumarDias(nuevoFin, 16));
  };

  const handleStartEdit = (rango: Disponibilidad) => {
    setEditingId(rango.idDisponibilidad);
    setEditInicio(rango.fechaInicio);
    setEditFin(rango.fechaFin);
  };

  const handleSaveEdit = (idDisponibilidad: string) => {
    if (editInicio < hoy) {
      alert('La fecha de inicio no puede ser anterior a hoy.');
      return;
    }
    if (editFin <= editInicio) {
      alert('La fecha de fin debe ser posterior a la de inicio.');
      return;
    }
    actualizarDisponibilidad(idDisponibilidad, editInicio, editFin);
    setEditingId(null);
  };

  const handleConfirmDelete = () => {
    if (!rangoToDelete) return;
    eliminarDisponibilidad(rangoToDelete.idDisponibilidad);
    setRangoToDelete(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/mis-publicaciones"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a mis publicaciones</span>
        </Link>

        {recienCreada && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">¡Publicación creada exitosamente!</p>
              <p>
                Tu publicación ya está activa. Ahora agrega los rangos de fechas en los que estará disponible para ser alquilada.
              </p>
            </div>
          </div>
        )}

        <h1 className="font-serif text-3xl font-bold text-[#15110d]">
          Disponibilidad: {v?.marca} {v?.modelo}
        </h1>
        <p className="text-sm text-[#4b463f] mt-1">
          Define los períodos habilitados en los que este auto podrá recibir reservas. Las reservas deben caber íntegramente dentro de un rango existente.
        </p>
      </div>

      {/* Add New Range Form */}
      <div className="bg-white border border-[#cec5bc] rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#efeeeb]">
          <Calendar className="w-4 h-4 text-[#755a2a]" />
          <h3 className="font-serif font-bold text-sm text-[#1b1c1a] uppercase tracking-wider">
            Agregar nuevo rango habilitado
          </h3>
        </div>

        <form onSubmit={handleCreateRange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Fecha desde (Inicio)" required>
              <input
                type="date"
                min={hoy}
                value={nuevoInicio}
                onChange={(e) => setNuevoInicio(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Fecha hasta (Fin)" required>
              <input
                type="date"
                min={nuevoInicio || hoy}
                value={nuevoFin}
                onChange={(e) => setNuevoFin(e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {formError && (
            <div className="flex items-center gap-2 text-xs text-[#ba1a1a] bg-[#ffdad6]/40 p-2.5 rounded border border-[#ba1a1a]/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#7d766e]">
              * Nota: El backend admite rangos superpuestos y los almacena como registros independientes.
            </span>
            <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
              Agregar rango
            </Button>
          </div>
        </form>
      </div>

      {/* Ranges List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
            Rangos configurados ({rangos.length})
          </h3>
          <span className="text-xs text-[#7d766e]">
            Horario de entrega y devolución fijado: {publicacion.horaRetiroDevolucion} hs
          </span>
        </div>

        {rangos.length === 0 ? (
          <div className="bg-[#f5f3f0] border border-[#cec5bc] rounded-lg p-8 text-center text-sm text-[#7d766e]">
            Esta publicación aún no tiene períodos de disponibilidad configurados. Agrega al menos uno para permitir reservas de conductores.
          </div>
        ) : (
          <div className="space-y-3">
            {rangos.map((rango) => {
              const isEditing = editingId === rango.idDisponibilidad;

              return (
                <div
                  key={rango.idDisponibilidad}
                  className="bg-white border border-[#e4e2df] hover:border-[#cec5bc] rounded-lg p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  {isEditing ? (
                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="date"
                        min={hoy}
                        value={editInicio}
                        onChange={(e) => setEditInicio(e.target.value)}
                        className={`${inputClass} text-xs py-1.5`}
                      />
                      <span className="text-xs text-[#7d766e]">al</span>
                      <input
                        type="date"
                        min={editInicio}
                        value={editFin}
                        onChange={(e) => setEditFin(e.target.value)}
                        className={`${inputClass} text-xs py-1.5`}
                      />
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSaveEdit(rango.idDisponibilidad)}
                          icon={<Save className="w-3.5 h-3.5" />}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(null)}
                          icon={<X className="w-3.5 h-3.5" />}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#efeeeb] text-[#755a2a] flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1b1c1a]">
                            Del {formatearFecha(rango.fechaInicio)} al {formatearFecha(rango.fechaFin)}
                          </p>
                          <p className="text-xs text-[#7d766e] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Retiro y devolución: {publicacion.horaRetiroDevolucion} hs
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(rango)}
                          className="p-1.5 rounded text-[#4b463f] hover:bg-[#efeeeb] hover:text-[#1b1c1a] transition-colors cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRangoToDelete(rango)}
                          className="p-1.5 rounded text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Done button */}
      <div className="flex justify-end pt-4 border-t border-[#e4e2df]">
        <Link to="/mis-publicaciones">
          <Button variant="primary" size="md">
            Finalizar y volver a Mis Publicaciones
          </Button>
        </Link>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(rangoToDelete)}
        title="¿Eliminar este rango de disponibilidad?"
        message={`Estás a punto de eliminar el rango del ${formatearFecha(
          rangoToDelete?.fechaInicio || ''
        )} al ${formatearFecha(rangoToDelete?.fechaFin || '')}.\n\nImportante: Eliminar disponibilidad no cancela las reservas que ya hayan sido confirmadas o se encuentren pendientes dentro de este período.`}
        confirmText="Sí, eliminar rango"
        cancelText="Conservar rango"
        isDestructive
        onConfirm={handleConfirmDelete}
        onClose={() => setRangoToDelete(null)}
      />
    </div>
  );
};
