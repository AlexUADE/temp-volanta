import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface RegisterViewProps {
  onRegisterSuccess: (name: string, email: string) => void;
  onGoToLogin: () => void;
  onBackToCatalog: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onGoToLogin,
  onBackToCatalog,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    onRegisterSuccess(fullName || 'Martina Gómez', email || 'martina@ejemplo.com');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-6 lg:px-12 py-12">
      {/* Top Back bar */}
      <div className="max-w-md w-full mx-auto mb-4 flex items-center justify-between text-xs text-[#7D766E]">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-1.5 hover:text-[#15110D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al catálogo</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto bg-white border border-[#E8E2D8] rounded-lg p-8 shadow-xs">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl text-[#15110D] font-normal mb-1.5">Crear cuenta</h1>
          <p className="text-xs text-[#7D766E]">
            Completá tus datos para empezar a alquilar o publicar vehículos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
              NOMBRE Y APELLIDO
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Ej. Martina Gómez"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nombre@ejemplo.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
              TELÉFONO
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+54 11 2345 6789"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
            />
            <span className="text-[10px] text-[#7D766E] block mt-1">Mínimo 8 caracteres alfanuméricos</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
              CONFIRMAR CONTRASEÑA
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white py-3 rounded text-xs font-medium shadow-xs transition-colors cursor-pointer mt-2"
          >
            Crear cuenta
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-[#F4EFEB] text-xs text-[#7D766E]">
          <span>¿Ya tenés cuenta? </span>
          <button
            onClick={onGoToLogin}
            className="text-[#15110D] font-medium hover:underline cursor-pointer"
          >
            Iniciá sesión
          </button>
        </div>
      </div>
    </div>
  );
};
