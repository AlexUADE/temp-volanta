import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
  onGoToRegister: () => void;
  onBackToCatalog: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onGoToRegister,
  onBackToCatalog,
}) => {
  const [email, setEmail] = useState('ejemplo@volanta.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email);
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
          <h1 className="font-serif text-3xl text-[#15110D] font-normal mb-1.5">Iniciar Sesión</h1>
          <p className="text-xs text-[#7D766E]">Ingresá tus credenciales para acceder a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase text-[#7D766E] mb-1.5">
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@volanta.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase text-[#7D766E]">CONTRASEÑA</label>
              <button
                type="button"
                onClick={() => alert('Te enviamos un enlace de recuperación a tu correo.')}
                className="text-[11px] text-[#7D766E] hover:text-[#15110D] cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
                className="w-full px-3.5 py-2.5 pr-10 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D766E] hover:text-[#15110D] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-[#7D766E] block mt-1">Mínimo 8 caracteres alfanuméricos.</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#15110D] hover:bg-[#2A2621] text-white py-3 rounded text-xs font-medium shadow-xs transition-colors cursor-pointer mt-2"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-[#F4EFEB] text-xs text-[#7D766E]">
          <span>¿No tenés cuenta? </span>
          <button
            onClick={onGoToRegister}
            className="text-[#15110D] font-medium hover:underline cursor-pointer"
          >
            Registrate
          </button>
        </div>
      </div>
    </div>
  );
};
