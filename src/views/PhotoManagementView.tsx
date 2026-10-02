import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Save, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ImagenVehiculo } from '../types';
import { Button } from '../components/ui/Button';
import { inputClass } from '../components/ui/FormField';

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop',
];

export const PhotoManagementView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVehiculoPorId, actualizarFotosVehiculo } = useApp();

  const vehiculo = id ? getVehiculoPorId(id) : undefined;
  const [fotos, setFotos] = useState<ImagenVehiculo[]>(() => vehiculo?.imagenes || []);
  const [newUrl, setNewUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!vehiculo) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-xs sm:text-sm text-[#4b463f]">Vehículo no encontrado.</p>
        <Link to="/mis-vehiculos">
          <Button variant="outline" size="sm" className="mt-4">
            Volver a mis vehículos
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddPhoto = (urlToAdd?: string) => {
    const url = urlToAdd || newUrl.trim();
    if (!url) return;

    const newPhoto: ImagenVehiculo = {
      idImagenVehiculo: `img-${vehiculo.idVehiculo}-${Date.now()}`,
      idVehiculo: vehiculo.idVehiculo,
      url,
      orden: fotos.length + 1,
    };

    setFotos((prev) => [...prev, newPhoto]);
    setNewUrl('');
  };

  const handleRemovePhoto = (index: number) => {
    setFotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((f, i) => ({ ...f, orden: i + 1 }));
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFotos((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy.map((f, i) => ({ ...f, orden: i + 1 }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === fotos.length - 1) return;
    setFotos((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy.map((f, i) => ({ ...f, orden: i + 1 }));
    });
  };

  const handleSave = () => {
    actualizarFotosVehiculo(vehiculo.idVehiculo, fotos);
    setSaveSuccess(true);
    setTimeout(() => {
      navigate('/mis-vehiculos');
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/mis-vehiculos"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a mis vehículos</span>
        </Link>

        <h1 className="font-serif text-3xl font-normal text-[#15110d]">
          Fotografías de {vehiculo.marca} {vehiculo.modelo}
        </h1>
        <p className="text-xs sm:text-sm text-[#4b463f] mt-1">
          La primera fotografía de la lista se utilizará como portada en el catálogo y publicaciones.
        </p>
      </div>

      {/* Add New Photo Bar */}
      <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-4">
        <h3 className="font-serif text-sm text-[#15110d] uppercase tracking-wider">
          Agregar nueva foto
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="Pega la URL de una imagen (ej. https://images.unsplash.com/...)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className={`${inputClass} flex-1`}
          />
          <Button
            variant="secondary"
            size="md"
            onClick={() => handleAddPhoto()}
            disabled={!newUrl.trim()}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Agregar por URL
          </Button>
        </div>

        {/* Preset suggestions */}
        <div className="pt-2 border-t border-[#f4efeb]">
          <span className="text-xs text-[#7d766e] block mb-2">
            O selecciona una foto de demostración:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddPhoto(preset)}
                className="w-16 h-12 rounded-[4px] border border-[#e8e2d8] overflow-hidden opacity-80 hover:opacity-100 hover:border-[#755a2a] transition-all shrink-0 cursor-pointer"
                title="Haga clic para agregar esta imagen"
              >
                <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photos List / Order */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base text-[#15110d]">
            Fotos asignadas ({fotos.length})
          </h3>
          <span className="text-xs text-[#7d766e]">
            Usa las flechas para reordenar la foto principal de portada
          </span>
        </div>

        {fotos.length === 0 ? (
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-8 text-center text-xs text-[#7d766e]">
            Aún no has agregado fotos a este vehículo. Agrega al menos una para que se muestre en el catálogo.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fotos.map((foto, index) => (
              <div
                key={foto.idImagenVehiculo}
                className={`bg-white border rounded-[8px] overflow-hidden shadow-[0_1px_2px_rgba(21,17,13,0.06)] relative flex flex-col justify-between ${
                  index === 0 ? 'border-[#755a2a]' : 'border-[#e8e2d8]'
                }`}
              >
                <div className="relative aspect-[16/10] bg-[#f4efeb] overflow-hidden">
                  <img src={foto.url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-[#755a2a] text-white text-[9px] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-[3px] shadow-xs">
                      Portada principal
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-[#15110d]/80 text-white text-[9px] px-1.5 py-0.5 rounded-[3px]">
                    #{index + 1}
                  </span>
                </div>

                <div className="p-3 bg-[#faf8f5] flex items-center justify-between border-t border-[#f4efeb]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1 rounded text-[#4b463f] hover:bg-[#f4efeb] hover:text-[#15110d] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover hacia arriba / adelante"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === fotos.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1 rounded text-[#4b463f] hover:bg-[#f4efeb] hover:text-[#15110d] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover hacia abajo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="p-1.5 rounded text-[#9b2c2c] hover:bg-[#ffdad6]/30 transition-colors cursor-pointer"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e8e2d8]">
        <Link to="/mis-vehiculos">
          <Button variant="outline" size="md">
            Cancelar
          </Button>
        </Link>
        <Button
          variant="primary"
          size="md"
          className="bg-[#15110d]"
          onClick={handleSave}
          icon={saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
        >
          {saveSuccess ? '¡Fotos guardadas!' : 'Guardar fotos'}
        </Button>
      </div>
    </div>
  );
};
