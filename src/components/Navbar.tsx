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
        <div className="bg-[#15110d] text-[#faf8f5] text-xs px-6 py-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-[0.08em] uppercase text-[10px] bg-[#755a2a] text-white px-2 py-0.5 rounded-[3px]">
              PANEL ADMINISTRATIVO
            </span>
            <span className="text-[#cec5bc]">Rol: ADMIN</span>
            <span className="text-white/40">·</span>
            <span className="text-[#cec5bc]">Gestión y supervisión de pagos en efectivo</span>
          </div>
          <Link
            to="/admin"
            className="text-xs text-[#8a6d3b] hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Ir al panel de pagos
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e2d8] px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link
              to="/"
              className="text-lg font-serif font-normal text-[#15110d] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              VOLANTA
            </Link>

            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-[11px] font-bold tracking-[0.06em] uppercase text-[#4b463f]">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-[4px] transition-colors ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-[#f4efeb] text-[#15110d]'
                    : 'hover:text-[#15110d] hover:bg-[#f4efeb]'
                }`}
              >
                Explorar
              </Link>

              {currentUser && (
                <>
                  <Link
                    to="/mis-reservas"
                    className={`px-3 py-1.5 rounded-[4px] transition-colors ${
                      isActive('/mis-reservas')
                        ? 'bg-[#f4efeb] text-[#15110d]'
                        : 'hover:text-[#15110d] hover:bg-[#f4efeb]'
                    }`}
                  >
                    Mis reservas
                  </Link>

                  <Link
                    to="/mis-publicaciones"
                    className={`px-3 py-1.5 rounded-[4px] transition-colors ${
                      isActive('/mis-publicaciones')
                        ? 'bg-[#f4efeb] text-[#15110d]'
                        : 'hover:text-[#15110d] hover:bg-[#f4efeb]'
                    }`}
                  >
                    Mis publicaciones
                  </Link>

                  <Link
                    to="/mis-vehiculos"
                    className={`px-3 py-1.5 rounded-[4px] transition-colors ${
                      isActive('/mis-vehiculos')
                        ? 'bg-[#f4efeb] text-[#15110d]'
                        : 'hover:text-[#15110d] hover:bg-[#f4efeb]'
                    }`}
                  >
                    Mis vehículos
                  </Link>

                  {currentUser.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-[4px] transition-colors text-[11px] ${
                        isActive('/admin')
                          ? 'bg-[#f4efeb] text-[#755a2a]'
                          : 'text-[#755a2a] hover:bg-[#f4efeb]'
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
              className="relative p-2 text-[#15110d] hover:bg-[#f4efeb] rounded-[4px] transition-colors"
              title="Tu carrito de reserva"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {carrito && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#755a2a] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </Link>

            {/* Publicar Vehículo button */}
            <Link to={currentUser ? '/publicaciones/nueva' : '/login'}>
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                PUBLICAR VEHÍCULO
              </Button>
            </Link>

            {/* Vertical hairline divider */}
            <div className="h-5 w-[1px] bg-[#e8e2d8] hidden sm:block" />

            {/* Account Status */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full hover:bg-[#f4efeb] transition-colors cursor-pointer text-xs font-medium text-[#1b1c1a]"
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
                    className="absolute right-0 mt-2 w-64 bg-white rounded-[8px] shadow-[0_8px_24px_rgba(21,17,13,0.12)] border border-[#e8e2d8] py-2 z-50 animate-in fade-in duration-100"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-[#f4efeb]">
                      <div className="text-xs font-bold text-[#1b1c1a]">
                        {currentUser.nombre} {currentUser.apellido}
                      </div>
                      <div className="text-[11px] text-[#7d766e] truncate">
                        {currentUser.email}
                      </div>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#755a2a] bg-[#f4efeb] px-2 py-0.5 rounded-[3px]">
                        Rol: {currentUser.role}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/mis-reservas"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#4b463f] hover:bg-[#f4efeb] transition-colors"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-[#7d766e]" />
                        <span>Mis Reservas</span>
                      </Link>

                      <Link
                        to="/mis-publicaciones"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#4b463f] hover:bg-[#f4efeb] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#7d766e]" />
                        <span>Mis Publicaciones</span>
                      </Link>

                      <Link
                        to="/mis-vehiculos"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#4b463f] hover:bg-[#f4efeb] transition-colors"
                      >
                        <Car className="w-3.5 h-3.5 text-[#7d766e]" />
                        <span>Mis Vehículos</span>
                      </Link>

                      {currentUser.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#755a2a] font-semibold hover:bg-[#f4efeb] transition-colors border-t border-[#f4efeb]"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Panel de Pagos (ADMIN)</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-[#f4efeb] pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-xs text-[#9b2c2c] hover:bg-[#ffdad6]/20 transition-colors cursor-pointer"
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
