import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { FormField, inputClass, selectClass } from '../components/ui/FormField';

export const VehicleFormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVehiculoPorId, agregarVehiculo, actualizarVehiculo, currentUser } = useApp();

  const isEdit = Boolean(id);
  const existingVehiculo = id ? getVehiculoPorId(id) : undefined;

  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [color, setColor] = useState('');
  const [cantidadAsientos, setCantidadAsientos] = useState<number>(5);
  const [tipoVehiculo, setTipoVehiculo] = useState('Sedán');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && existingVehiculo) {
      setPatente(existingVehiculo.patente);
      setMarca(existingVehiculo.marca);
      setModelo(existingVehiculo.modelo);
      setAnio(existingVehiculo.anio);
      setColor(existingVehiculo.color);
      setCantidadAsientos(existingVehiculo.cantidadAsientos);
      setTipoVehiculo(existingVehiculo.tipoVehiculo);
    }
  }, [isEdit, existingVehiculo]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!patente.trim()) errs.patente = 'La patente es obligatoria.';
    if (!marca.trim()) errs.marca = 'La marca es obligatoria.';
    if (!modelo.trim()) errs.modelo = 'El modelo es obligatorio.';
    if (!anio || anio < 2000 || anio > new Date().getFullYear() + 1) {
      errs.anio = `El año debe ser válido (entre 2000 y ${new Date().getFullYear() + 1}).`;
    }
    if (!color.trim()) errs.color = 'El color es obligatorio.';
    if (!cantidadAsientos || cantidadAsientos < 1 || cantidadAsientos > 9) {
      errs.cantidadAsientos = 'Indica entre 1 y 9 asientos.';
    }
    if (!tipoVehiculo) errs.tipoVehiculo = 'Selecciona el tipo de vehículo.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && id) {
      actualizarVehiculo(id, {
        patente: patente.toUpperCase().trim(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: Number(anio),
        color: color.trim(),
        cantidadAsientos: Number(cantidadAsientos),
        tipoVehiculo,
      });
      navigate('/mis-vehiculos');
    } else {
      const nuevo = agregarVehiculo({
        patente: patente.toUpperCase().trim(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        anio: Number(anio),
        color: color.trim(),
        cantidadAsientos: Number(cantidadAsientos),
        tipoVehiculo,
      });
      navigate(`/mis-vehiculos/${nuevo.idVehiculo}/fotos`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/mis-vehiculos"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a mis vehículos</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-[#15110d]">
          {isEdit ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}
        </h1>
        <p className="text-sm text-[#4b463f] mt-1">
          {isEdit
            ? 'Actualiza las características técnicas de tu vehículo registrado.'
            : 'Completa los datos identificatorios de tu vehículo. Luego podrás agregar fotografías.'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#cec5bc] rounded-lg p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Patente */}
          <FormField label="Patente / Dominio" required error={errors.patente}>
            <input
              type="text"
              placeholder="Ej. AF 342 KL"
              value={patente}
              onChange={(e) => setPatente(e.target.value.toUpperCase())}
              className={`${inputClass} font-mono`}
            />
          </FormField>

          {/* Tipo de vehículo */}
          <FormField label="Tipo de vehículo" required error={errors.tipoVehiculo}>
            <select
              value={tipoVehiculo}
              onChange={(e) => setTipoVehiculo(e.target.value)}
              className={selectClass}
            >
              <option value="Sedán">Sedán</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Pickup">Pickup</option>
              <option value="Coupe">Coupe</option>
              <option value="Furgón">Furgón</option>
            </select>
          </FormField>

          {/* Marca */}
          <FormField label="Marca" required error={errors.marca}>
            <input
              type="text"
              placeholder="Ej. Toyota, Volkswagen, Peugeot"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className={inputClass}
            />
          </FormField>

          {/* Modelo */}
          <FormField label="Modelo y versión" required error={errors.modelo}>
            <input
              type="text"
              placeholder="Ej. Corolla XEI 2.0, Taos Highline"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className={inputClass}
            />
          </FormField>

          {/* Año */}
          <FormField label="Año de fabricación" required error={errors.anio}>
            <input
              type="number"
              min={2000}
              max={new Date().getFullYear() + 1}
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className={inputClass}
            />
          </FormField>

          {/* Color */}
          <FormField label="Color" required error={errors.color}>
            <input
              type="text"
              placeholder="Ej. Gris Plata, Blanco, Negro"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={inputClass}
            />
          </FormField>

          {/* Cantidad de asientos */}
          <FormField
            label="Cantidad de asientos"
            required
            error={errors.cantidadAsientos}
            className="sm:col-span-2"
          >
            <input
              type="number"
              min={1}
              max={9}
              value={cantidadAsientos}
              onChange={(e) => setCantidadAsientos(Number(e.target.value))}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#efeeeb]">
          <Link to="/mis-vehiculos">
            <Button variant="outline" size="md">
              Cancelar
            </Button>
          </Link>
          <Button variant="primary" size="md" type="submit" icon={<Save className="w-4 h-4" />}>
            {isEdit ? 'Guardar cambios' : 'Continuar a gestionar fotos'}
          </Button>
        </div>
      </form>
    </div>
  );
};
