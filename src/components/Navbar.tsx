import React, { useState } from 'react';
import { ShoppingBag, User, Shield, ChevronDown, Plus, LogOut, Check } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  cartCount: number;
  userRole: 'host' | 'guest' | 'admin';
  setUserRole: (role: 'host' | 'guest' | 'admin') => void;
  isAuthenticated: boolean;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  userRole,
  setUserRole,
  isAuthenticated,
  onOpenAuth,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      {/* Top Banner when in Admin Mode */}
      {currentView === 'admin-fleet' && (
        <div className="bg-[#15110D] text-[#EAE8E5] text-xs px-6 py-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider uppercase text-[10px] bg-[#755A2A] text-white px-2 py-0.5 rounded">
              PANEL DE CONTROL VOLANTA
            </span>
            <span className="text-[#CEC5BC]">MODO ADMINISTRADOR</span>
            <span className="text-white/40">·</span>
            <span className="text-[#CEC5BC]">Supervisión en tiempo real de flota nacional</span>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs text-[#EAE8E5] hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Volver a la vista pública de usuarios
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8] px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Brand & Left Navigation */}
          <div className="flex items-center gap-6 lg:gap-10">
            <button
              onClick={() => onNavigate('catalog')}
              className="text-lg font-serif font-bold text-[#15110D] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              VOLANTA
            </button>

            <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-xs font-semibold tracking-wider text-[#4B463F]">
              <button
                onClick={() => onNavigate('catalog')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer uppercase ${
                  currentView === 'catalog'
                    ? 'bg-[#EAE8E5] text-[#15110D]'
                    : 'hover:text-[#15110D] hover:bg-[#F4EFEB]'
                }`}
              >
                Explorar
              </button>

              <button
                onClick={() => onNavigate('my-bookings')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer uppercase ${
                  currentView === 'my-bookings' || currentView === 'booking-detail'
                    ? 'bg-[#EAE8E5] text-[#15110D]'
                    : 'hover:text-[#15110D] hover:bg-[#F4EFEB]'
                }`}
              >
                Mis reservas
              </button>

              <button
                onClick={() => onNavigate('my-listings')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer uppercase ${
                  currentView === 'my-listings' || currentView === 'edit-listing'
                    ? 'bg-[#EAE8E5] text-[#15110D]'
                    : 'hover:text-[#15110D] hover:bg-[#F4EFEB]'
                }`}
              >
                Mis publicaciones
              </button>

              <button
                onClick={() => onNavigate('my-listings')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer uppercase ${
                  currentView === 'publish-car'
                    ? 'bg-[#EAE8E5] text-[#15110D]'
                    : 'hover:text-[#15110D] hover:bg-[#F4EFEB]'
                }`}
              >
                Mis vehículos
              </button>

              <button
                onClick={() => onNavigate('finances')}
                className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer uppercase text-[11px] ${
                  currentView === 'finances'
                    ? 'bg-[#EAE8E5] text-[#15110D]'
                    : 'hover:text-[#15110D] hover:bg-[#F4EFEB]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#755A2A]" />
                Finanzas
              </button>

              <button
                onClick={() => onNavigate('admin-fleet')}
                className={`hidden xl:flex items-center gap-1 px-3 py-1.5 rounded transition-all cursor-pointer uppercase text-[11px] ${
                  currentView === 'admin-fleet'
                    ? 'bg-[#EAE8E5] text-[#15110D]'
                    : 'hover:text-[#15110D] hover:bg-[#F4EFEB]'
                }`}
              >
                <Shield className="w-3 h-3 text-[#755A2A]" />
                Moderación
              </button>
            </nav>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Shopping Bag / Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-[#15110D] hover:bg-[#F4EFEB] rounded-md transition-colors cursor-pointer"
              title="Tu carrito de reserva"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8A6D3B] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* + PUBLICAR VEHÍCULO button */}
            <button
              onClick={() => onNavigate('publish-car')}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#15110D] hover:bg-[#2A2621] px-3.5 py-2 rounded-md shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>PUBLICAR VEHÍCULO</span>
            </button>

            {/* Vertical hairline divider */}
            <div className="h-5 w-[1px] bg-[#E8E2D8] hidden sm:block" />

            {/* User Profile / Account Menu with 'I' and 'Ignacio' */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 py-1 pl-1 pr-2.5 rounded-full hover:bg-[#F4EFEB] transition-colors cursor-pointer text-xs font-medium text-[#15110D]"
              >
                <div className="w-7 h-7 rounded-full bg-[#15110D] text-white flex items-center justify-center text-xs font-bold">
                  I
                </div>
                <span className="hidden sm:inline text-xs font-medium text-[#15110D]">Ignacio</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7D766E]" />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#E8E2D8] py-2 z-50"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-[#F4EFEB]">
                    <div className="text-xs font-semibold text-[#15110D]">Ignacio</div>
                    <div className="text-[11px] text-[#7D766E]">ignacio@volanta.com.ar</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded">
                      Miembro Verificado
                    </div>
                  </div>
                  <div className="px-4 py-2 border-b border-[#F4EFEB]">
                    <div className="text-xs font-semibold text-[#15110D]">Martín Gómez</div>
                    <div className="text-[11px] text-[#7D766E]">martin@volanta.com.ar</div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-[#755A2A] bg-[#FDD79C]/30 px-2 py-0.5 rounded">
                      Anfitrión Verificado
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('my-bookings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#4B463F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Mis Reservas (Conductor)
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('my-listings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#4B463F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Mis Publicaciones (Propietario)
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('finances');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#4B463F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Finanzas y Liquidaciones
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('admin-fleet');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#755A2A] hover:bg-[#FAF8F5] font-medium transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>Panel de Moderación</span>
                      <Shield className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="border-t border-[#F4EFEB] pt-1">
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#4B463F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Iniciar sesión con otra cuenta
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('register');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#4B463F] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      Crear nueva cuenta
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
