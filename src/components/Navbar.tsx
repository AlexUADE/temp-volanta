import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Shield,
  ChevronDown,
  Plus,
  LogOut,
  Car,
  FileText,
  CalendarDays,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const { currentUser, logout, carrito } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Banner when logged in as ADMIN */}
      {currentUser?.role === 'ADMIN' && (
        <div className="bg-[#15110d] text-[#eae8e5] text-xs px-6 py-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider uppercase text-[10px] bg-[#755a2a] text-white px-2 py-0.5 rounded">
              PANEL ADMINISTRATIVO
            </span>
            <span className="text-[#cec5bc]">Rol: ADMIN</span>
            <span className="text-white/40">·</span>
            <span className="text-[#cec5bc]">Gestión y supervisión de pagos en efectivo</span>
          </div>
          <Link
            to="/admin"
            className="text-xs text-[#fdd79c] hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Ir al panel de pagos
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#fbf9f6]/95 backdrop-blur-md border-b border-[#e4e2df] px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link
              to="/"
              className="text-lg font-serif font-bold text-[#15110d] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              VOLANTA
            </Link>

            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs font-semibold tracking-wider text-[#4b463f]">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded transition-all uppercase ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-[#efeeeb] text-[#15110d]'
                    : 'hover:text-[#15110d] hover:bg-[#f5f3f0]'
                }`}
              >
                Explorar
              </Link>

              {currentUser && (
                <>
                  <Link
                    to="/mis-reservas"
                    className={`px-3 py-1.5 rounded transition-all uppercase ${
                      isActive('/mis-reservas')
                        ? 'bg-[#efeeeb] text-[#15110d]'
                        : 'hover:text-[#15110d] hover:bg-[#f5f3f0]'
                    }`}
                  >
                    Mis reservas
                  </Link>

                  <Link
                    to="/mis-publicaciones"
                    className={`px-3 py-1.5 rounded transition-all uppercase ${
                      isActive('/mis-publicaciones')
                        ? 'bg-[#efeeeb] text-[#15110d]'
                        : 'hover:text-[#15110d] hover:bg-[#f5f3f0]'
                    }`}
                  >
                    Mis publicaciones
                  </Link>

                  <Link
                    to="/mis-vehiculos"
                    className={`px-3 py-1.5 rounded transition-all uppercase ${
                      isActive('/mis-vehiculos')
                        ? 'bg-[#efeeeb] text-[#15110d]'
                        : 'hover:text-[#15110d] hover:bg-[#f5f3f0]'
                    }`}
                  >
                    Mis vehículos
                  </Link>

                  {currentUser.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1 px-3 py-1.5 rounded transition-all uppercase text-[11px] ${
                        isActive('/admin')
                          ? 'bg-[#efeeeb] text-[#755a2a]'
                          : 'text-[#755a2a] hover:bg-[#fdd79c]/20'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Administración
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Button */}
            <Link
              to="/carrito"
              className="relative p-2 text-[#15110d] hover:bg-[#f5f3f0] rounded-md transition-colors"
              title="Tu carrito de reserva"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {carrito && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#755a2a] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </Link>

            {/* Publicar Vehículo button (available for USER or redirects to login) */}
            {currentUser ? (
              <Link to="/publicaciones/nueva">
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  PUBLICAR VEHÍCULO
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  PUBLICAR VEHÍCULO
                </Button>
              </Link>
            )}

            {/* Vertical hairline divider */}
            <div className="h-5 w-[1px] bg-[#cec5bc]/50 hidden sm:block" />

            {/* Account Status */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full hover:bg-[#f5f3f0] transition-colors cursor-pointer text-xs font-medium text-[#1b1c1a]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#15110d] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.nombre.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-[#1b1c1a]">
                    {currentUser.nombre}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7d766e]" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#cec5bc] py-2 z-50 animate-in fade-in duration-100"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-[#efeeeb]">
                      <div className="text-xs font-bold text-[#1b1c1a]">
                        {currentUser.nombre} {currentUser.apellido}
                      </div>
                      <div className="text-[11px] text-[#7d766e] truncate">
                        {currentUser.email}
                      </div>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#755a2a] bg-[#fdd79c]/30 px-2 py-0.5 rounded">
                        Rol: {currentUser.role}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/mis-reservas"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#4b463f] hover:bg-[#f5f3f0] transition-colors"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-[#7d766e]" />
                        <span>Mis Reservas</span>
                      </Link>

                      <Link
                        to="/mis-publicaciones"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#4b463f] hover:bg-[#f5f3f0] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#7d766e]" />
                        <span>Mis Publicaciones</span>
                      </Link>

                      <Link
                        to="/mis-vehiculos"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#4b463f] hover:bg-[#f5f3f0] transition-colors"
                      >
                        <Car className="w-3.5 h-3.5 text-[#7d766e]" />
                        <span>Mis Vehículos</span>
                      </Link>

                      {currentUser.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#755a2a] font-semibold hover:bg-[#fdd79c]/20 transition-colors border-t border-[#efeeeb]"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Panel de Pagos (ADMIN)</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-[#efeeeb] pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Ingresar
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button variant="outline" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
