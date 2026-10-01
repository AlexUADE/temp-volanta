import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { FormField, inputClass, selectClass, textareaClass } from '../components/ui/FormField';

export const ListingFormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const preselectedVehiculoId = searchParams.get('vehiculoId');

  const navigate = useNavigate();
  const {
    getPublicacionCompleta,
    getVehiculosPropios,
    getPublicacionVigenteDeVehiculo,
    ubicaciones,
    crearPublicacion,
    actualizarPublicacion,
    currentUser,
  } = useApp();

  const isEdit = Boolean(id);
  const existingPub = id ? getPublicacionCompleta(id) : undefined;
  const misVehiculos = getVehiculosPropios();

  // Form states
  const [idVehiculo, setIdVehiculo] = useState(
    existingPub?.idVehiculo || preselectedVehiculoId || misVehiculos[0]?.idVehiculo || ''
  );
  const [idUbicacion, setIdUbicacion] = useState(
    existingPub?.idUbicacion || ubicaciones[0]?.idUbicacion || ''
  );
  const [precioDia, setPrecioDia] = useState<number | ''>(
    existingPub ? existingPub.precioDia : 75000
  );
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(
    existingPub ? existingPub.descuentoPorcentaje : 0
  );
  const [descripcion, setDescripcion] = useState(existingPub?.descripcion || '');
  const [horaRetiroDevolucion, setHoraRetiroDevolucion] = useState(
    existingPub?.horaRetiroDevolucion || '10:00'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && existingPub) {
      setIdVehiculo(existingPub.idVehiculo);
      setIdUbicacion(existingPub.idUbicacion);
      setPrecioDia(existingPub.precioDia);
      setDescuentoPorcentaje(existingPub.descuentoPorcentaje);
      setDescripcion(existingPub.descripcion);
      setHoraRetiroDevolucion(existingPub.horaRetiroDevolucion);
    }
  }, [isEdit, existingPub]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Check if selected vehicle already has an active or paused publication
  const vehiculoActualPubVigente = !isEdit && idVehiculo
    ? getPublicacionVigenteDeVehiculo(idVehiculo)
    : undefined;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!idVehiculo) errs.idVehiculo = 'Debes seleccionar un vehículo.';
    if (!idUbicacion) errs.idUbicacion = 'Debes seleccionar una ubicación.';
    if (!precioDia || Number(precioDia) <= 0) {
      errs.precioDia = 'El precio por día debe ser un valor mayor a 0.';
    }
    if (descuentoPorcentaje < 0 || descuentoPorcentaje > 50) {
      errs.descuentoPorcentaje = 'El descuento debe ser un porcentaje entre 0% y 50%.';
    }
    if (!descripcion.trim()) {
      errs.descripcion = 'Por favor ingresa una descripción para tu publicación.';
    }
    if (!horaRetiroDevolucion) {
      errs.horaRetiroDevolucion = 'Indica el horario acordado de retiro y entrega.';
    }
    if (vehiculoActualPubVigente) {
      errs.idVehiculo =
        'Este vehículo ya posee una publicación vigente activa o pausada.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && id) {
      actualizarPublicacion(id, {
        idUbicacion,
        precioDia: Number(precioDia),
        descuentoPorcentaje: Number(descuentoPorcentaje),
        descripcion: descripcion.trim(),
        horaRetiroDevolucion,
      });
      navigate('/mis-publicaciones');
    } else {
      const nueva = crearPublicacion({
        idVehiculo,
        idUbicacion,
        precioDia: Number(precioDia),
        descuentoPorcentaje: Number(descuentoPorcentaje),
        descripcion: descripcion.trim(),
        horaRetiroDevolucion,
      });
      // The backend creates publication in ACTIVA state, then redirects to configure availability ranges
      navigate(`/publicaciones/${nueva.idPublicacion}/disponibilidad?creada=true`);
    }
  };

  const selectedVehiculo = misVehiculos.find((v) => v.idVehiculo === idVehiculo);
  const selectedUbicacion = ubicaciones.find((u) => u.idUbicacion === idUbicacion);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/mis-publicaciones"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a mis publicaciones</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-[#15110d]">
          {isEdit ? 'Editar Publicación' : 'Crear Nueva Publicación'}
        </h1>
        <p className="text-sm text-[#4b463f] mt-1">
          {isEdit
            ? 'Actualiza las tarifas, ubicación y condiciones de alquiler.'
            : 'Publica tu vehículo en alquiler. Luego de guardarlo podrás definir los períodos de disponibilidad.'}
        </p>
      </div>

      {misVehiculos.length === 0 ? (
        <div className="bg-white border border-[#cec5bc] rounded-lg p-8 text-center space-y-4">
          <p className="text-sm text-[#4b463f]">
            No tienes vehículos registrados actualmente para publicar.
          </p>
          <Link to="/mis-vehiculos/nuevo">
            <Button variant="primary" size="md">
              Registrar un vehículo primero
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#cec5bc] rounded-lg p-6 shadow-xs space-y-6">
          {/* Vehículo selection */}
          {isEdit ? (
            <div className="p-4 bg-[#f5f3f0] border border-[#cec5bc] rounded-md space-y-1">
              <span className="text-xs text-[#7d766e] font-semibold uppercase tracking-wider block">
                Vehículo asignado (Solo lectura)
              </span>
              <p className="text-base font-serif font-bold text-[#1b1c1a]">
                {existingPub?.vehiculo?.marca} {existingPub?.vehiculo?.modelo} ({existingPub?.vehiculo?.anio})
              </p>
              <p className="text-xs text-[#7d766e]">
                Patente: {existingPub?.vehiculo?.patente} · {existingPub?.vehiculo?.tipoVehiculo}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <FormField label="Seleccionar vehículo propio" required error={errors.idVehiculo}>
                <select
                  value={idVehiculo}
                  onChange={(e) => setIdVehiculo(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Selecciona un vehículo...</option>
                  {misVehiculos.map((v) => (
                    <option key={v.idVehiculo} value={v.idVehiculo}>
                      {v.marca} {v.modelo} ({v.anio}) - Patente {v.patente}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Notice if vehicle has current listing */}
              {vehiculoActualPubVigente && (
                <div className="flex items-start gap-2 p-3 bg-[#fdd79c]/30 border border-[#755a2a]/30 rounded-md text-xs text-[#785c2c]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">
                      Este vehículo ya tiene una publicación vigente ({vehiculoActualPubVigente.estado}).
                    </span>
                    <span>
                      Un vehículo solo puede tener una publicación activa o pausada a la vez.{' '}
                    </span>
                    <Link
                      to={`/publicaciones/${vehiculoActualPubVigente.idPublicacion}/editar`}
                      className="font-bold underline ml-1"
                    >
                      Gestionar publicación vigente
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location selection */}
          <div className="space-y-2">
            <FormField label="Ubicación de entrega y devolución" required error={errors.idUbicacion}>
              <select
                value={idUbicacion}
                onChange={(e) => setIdUbicacion(e.target.value)}
                className={selectClass}
              >
                {ubicaciones.map((u) => (
                  <option key={u.idUbicacion} value={u.idUbicacion}>
                    {u.direccion} — {u.localidad}, {u.ciudad} ({u.provincia})
                  </option>
                ))}
              </select>
            </FormField>

            {selectedUbicacion && (
              <div className="text-[11px] text-[#7d766e] bg-[#f5f3f0] p-2.5 rounded border border-[#e4e2df]">
                <strong>Zona:</strong> {selectedUbicacion.zona} · <strong>CP:</strong>{' '}
                {selectedUbicacion.codigoPostal} · <strong>Coords:</strong>{' '}
                {selectedUbicacion.latitud}, {selectedUbicacion.longitud}
              </div>
            )}
          </div>

          {/* Pricing & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Precio por día (ARS)"
              required
              helperText="Tarifa base por día de alquiler"
              error={errors.precioDia}
            >
              <input
                type="number"
                min={1}
                placeholder="75000"
                value={precioDia}
                onChange={(e) => setPrecioDia(e.target.value ? Number(e.target.value) : '')}
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Descuento opcional (%)"
              helperText="Porcentaje entre 0% y 50% aplicable al día"
              error={errors.descuentoPorcentaje}
            >
              <input
                type="number"
                min={0}
                max={50}
                placeholder="0"
                value={descuentoPorcentaje}
                onChange={(e) => setDescuentoPorcentaje(Number(e.target.value))}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Fixed pickup time */}
          <FormField
            label="Horario fijo de entrega y devolución"
            required
            helperText="Horario único establecido por el propietario para entrega y recepción"
            error={errors.horaRetiroDevolucion}
          >
            <input
              type="time"
              value={horaRetiroDevolucion}
              onChange={(e) => setHoraRetiroDevolucion(e.target.value)}
              className={inputClass}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Descripción del vehículo y condiciones"
            required
            helperText="Describe el estado del auto, facilidades y detalles para el locatario"
            error={errors.descripcion}
          >
            <textarea
              placeholder="Ej. Auto en excelentes condiciones mecánicas, service al día, ideal para viajes..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={textareaClass}
            />
          </FormField>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#efeeeb]">
            <Link to="/mis-publicaciones">
              <Button variant="outline" size="md">
                Cancelar
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={isEdit ? <Save className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            >
              {isEdit ? 'Guardar cambios' : 'Continuar a definir disponibilidad'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
