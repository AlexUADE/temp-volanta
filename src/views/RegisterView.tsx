import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { FormField, inputClass } from '../components/ui/FormField';

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useApp();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!apellido.trim()) errs.apellido = 'El apellido es obligatorio.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Ingresa un correo electrónico válido.';
    if (!password || password.length < 6) {
      errs.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }
    if (!fechaNacimiento) {
      errs.fechaNacimiento = 'Indica tu fecha de nacimiento.';
    }
    if (!telefono.trim()) {
      errs.telefono = 'El teléfono es obligatorio.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    registerUser({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      fechaNacimiento,
    });

    navigate('/');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-12 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <h1 className="font-serif text-3xl font-normal text-[#15110d]">Crear Cuenta en Volanta</h1>
        <p className="text-xs sm:text-sm text-[#4b463f] mt-1">
          Una única cuenta te permite tanto alquilar vehículos como publicar los tuyos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nombre" required error={errors.nombre}>
            <input
              type="text"
              placeholder="Ej. Juan"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Apellido" required error={errors.apellido}>
            <input
              type="text"
              placeholder="Ej. Pérez"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Correo electrónico" required error={errors.email}>
          <input
            type="email"
            placeholder="ejemplo@volanta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Teléfono de contacto" required error={errors.telefono}>
            <input
              type="tel"
              placeholder="+54 11 ..."
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Fecha de nacimiento" required error={errors.fechaNacimiento}>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Contraseña" required error={errors.password}>
            <input
              type="password"
              placeholder="Al menos 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Confirmar contraseña" required error={errors.confirmPassword}>
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        <Button
          variant="primary"
          size="md"
          type="submit"
          className="w-full bg-[#15110d]"
          icon={<UserPlus className="w-4 h-4" />}
        >
          Crear cuenta y comenzar
        </Button>

        <div className="text-center pt-2 border-t border-[#f4efeb]">
          <span className="text-xs text-[#7d766e]">¿Ya tienes una cuenta registrada? </span>
          <Link to="/login" className="text-xs text-[#755a2a] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};
