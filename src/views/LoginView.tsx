import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, User, Shield, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { FormField, inputClass } from '../components/ui/FormField';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, loginAsUser, loginAsAdmin } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    const success = loginWithCredentials(email);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales inválidas.');
    }
  };

  const handleDemoUser = () => {
    loginAsUser();
    navigate('/');
  };

  const handleDemoAdmin = () => {
    loginAsAdmin();
    navigate('/admin');
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <h1 className="font-serif text-3xl font-normal text-[#15110d]">Iniciar Sesión</h1>
        <p className="text-xs sm:text-sm text-[#4b463f] mt-1">
          Ingresa a tu cuenta de Volanta para gestionar alquileres y publicaciones.
        </p>
      </div>

      {/* Quick Demo Access Card */}
      <div className="bg-[#f4efeb] border border-[#e8e2d8] rounded-[8px] p-4 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#755a2a] block">
          Acceso rápido para evaluación de prototipo:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[11px] justify-start bg-white"
            icon={<User className="w-3.5 h-3.5 text-[#755a2a]" />}
            onClick={handleDemoUser}
          >
            Como Usuario
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[11px] justify-start bg-white"
            icon={<Shield className="w-3.5 h-3.5 text-[#755a2a]" />}
            onClick={handleDemoAdmin}
          >
            Como Admin
          </Button>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-[#ffdad6]/30 border border-[#9b2c2c]/30 rounded-[4px] text-xs text-[#9b2c2c]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <FormField label="Correo electrónico" required>
          <input
            type="email"
            placeholder="ejemplo@volanta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </FormField>

        <FormField label="Contraseña" required>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </FormField>

        <Button variant="primary" size="md" type="submit" className="w-full bg-[#15110d]" icon={<LogIn className="w-4 h-4" />}>
          Ingresar
        </Button>

        <div className="text-center pt-2 border-t border-[#f4efeb]">
          <span className="text-xs text-[#7d766e]">¿No tienes una cuenta aún? </span>
          <Link to="/registro" className="text-xs text-[#755a2a] font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
};
