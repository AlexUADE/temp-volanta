import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#e4e2df] bg-[#fbf9f6] py-8 px-6 lg:px-12 text-xs text-[#7d766e]">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-serif font-bold text-[#15110d] text-sm tracking-wider uppercase">
            VOLANTA
          </Link>
          <span className="text-[#cec5bc]">|</span>
          <span>Plataforma de alquiler de vehículos entre particulares</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[#4b463f]">
          <Link to="/" className="hover:text-[#15110d] transition-colors">
            Catálogo
          </Link>
          <Link to="/mis-reservas" className="hover:text-[#15110d] transition-colors">
            Mis reservas
          </Link>
          <Link to="/mis-vehiculos" className="hover:text-[#15110d] transition-colors">
            Mis vehículos
          </Link>
          <Link to="/mis-publicaciones" className="hover:text-[#15110d] transition-colors">
            Mis publicaciones
          </Link>
        </div>
      </div>
    </footer>
  );
};
