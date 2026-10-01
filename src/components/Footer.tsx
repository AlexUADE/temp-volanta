import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#E8E2D8] bg-[#FAF8F5] py-8 px-6 lg:px-12 text-xs text-[#7D766E]">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-[#15110D] text-sm">Volanta</span>
          <span className="text-[#CEC5BC]">|</span>
          <span>© 2024 Volanta S.A. Todos los derechos reservados.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[#4B463F]">
          <a href="#terminos" onClick={(e) => e.preventDefault()} className="hover:text-[#15110D] transition-colors">
            Términos y condiciones
          </a>
          <a href="#cancelacion" onClick={(e) => e.preventDefault()} className="hover:text-[#15110D] transition-colors">
            Políticas de cancelación
          </a>
          <a href="#privacidad" onClick={(e) => e.preventDefault()} className="hover:text-[#15110D] transition-colors">
            Privacidad
          </a>
          <a href="#ayuda" onClick={(e) => e.preventDefault()} className="hover:text-[#15110D] transition-colors">
            Centro de ayuda
          </a>
        </div>
      </div>
    </footer>
  );
};
