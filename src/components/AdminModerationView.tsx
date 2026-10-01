import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Download,
  Check,
  XCircle,
  FileCheck,
  Activity,
  History,
  Lock,
} from 'lucide-react';
import { ModerationItem } from '../types';
import { formatARS } from '../utils/formatters';

interface AdminModerationViewProps {
  items: ModerationItem[];
  onApproveItem: (id: string) => void;
  onRejectItem: (id: string) => void;
}

export const AdminModerationView: React.FC<AdminModerationViewProps> = ({
  items,
  onApproveItem,
  onRejectItem,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleApprove = (item: ModerationItem) => {
    onApproveItem(item.id);
    setFeedbackMessage(`Publicación ${item.code} (${item.brand} ${item.model}) aprobada e indexada en el catálogo.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleObserve = (item: ModerationItem) => {
    onRejectItem(item.id);
    setFeedbackMessage(`Se envió notificación de observaciones y solicitud de corrección a ${item.hostName}.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filtered = items.filter((item) => {
    if (activeTab === 'pending' && item.status !== 'pendiente') return false;
    if (activeTab === 'approved' && item.status !== 'aprobada') return false;
    if (activeTab === 'rejected' && item.status !== 'rechazada' && item.status !== 'observada') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.plate.toLowerCase().includes(q) ||
        item.hostName.toLowerCase().includes(q) ||
        item.hostTaxId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#7D766E] mb-1">
            VOLANTA ADMIN &gt; CENTRO DE CONTROL Y MODERACIÓN
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-2">
            Centro de Control y Moderación de Flota
          </h1>
          <p className="text-xs text-[#4B463F] max-w-2xl">
            Supervisión en tiempo real de publicaciones entrantes, validación documental de vehículos y anfitriones, y
            control de incidentes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <select
            defaultValue="Nov 2025"
            className="text-xs bg-white border border-[#DCD4C7] rounded px-3 py-2 text-[#15110D] focus:outline-none"
          >
            <option>Noviembre 2025</option>
            <option>Octubre 2025</option>
          </select>

          <button
            onClick={() => alert('Generando reporte CSV de auditoría vehicular...')}
            className="flex items-center gap-1.5 bg-[#15110D] hover:bg-[#2A2621] text-white text-xs font-medium px-4 py-2 rounded shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar auditoría general (CSV)</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded flex items-center gap-2 shadow-xs animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* 4 Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-[#7D766E] block mb-2">
            PUBLICACIONES PENDIENTES
          </span>
          <div className="text-3xl font-bold font-serif text-[#15110D] mb-1">8 <span className="text-xs font-sans font-normal text-[#7D766E]">vehículos</span></div>
          <div className="text-[11px] text-[#755A2A] font-medium">● 3 prioritarias con documentación completa</div>
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-[#7D766E] block mb-2">
            TOTAL FLOTA ACTIVA
          </span>
          <div className="text-3xl font-bold font-serif text-[#15110D] mb-1">142 <span className="text-xs font-sans font-normal text-[#7D766E]">vehículos</span></div>
          <div className="text-[11px] text-emerald-700 font-medium">↗ +12 este mes · 94% verificación documental</div>
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-[#7D766E] block mb-2">
            VALIDACIONES DE IDENTIDAD
          </span>
          <div className="text-3xl font-bold font-serif text-[#15110D] mb-1">98.6%</div>
          <div className="text-[11px] text-[#7D766E]">Tasa Renaper de aprobación automática</div>
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs">
          <span className="text-[10px] uppercase font-semibold text-[#7D766E] block mb-2">
            TRANSACCIONES DEL MES
          </span>
          <div className="text-2xl font-bold font-serif text-[#15110D] mb-1">$48.320.000 <span className="text-xs font-sans font-normal text-[#7D766E]">ARS</span></div>
          <div className="text-[11px] text-[#7D766E]">Procesados vía Mercado Pago Checkout</div>
        </div>
      </div>

      {/* Main Grid: Left Moderation Queue + Right System Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Moderation Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs & Search */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-3 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'pending' ? 'bg-[#15110D] text-white shadow-xs' : 'text-[#4B463F] hover:bg-[#F4EFEB]'
                }`}
              >
                Pendientes de aprobación (8)
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'approved' ? 'bg-[#15110D] text-white shadow-xs' : 'text-[#4B463F] hover:bg-[#F4EFEB]'
                }`}
              >
                Aprobadas recientemente (34)
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'rejected' ? 'bg-[#15110D] text-white shadow-xs' : 'text-[#4B463F] hover:bg-[#F4EFEB]'
                }`}
              >
                Rechazadas / Con observaciones
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#7D766E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por ID (#PUB-...), marca, modelo, o CUIT/DNI del propietario..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
                />
              </div>

              <button
                onClick={() => alert('Filtros avanzados de auditoría')}
                className="flex items-center gap-1.5 text-xs text-[#4B463F] border border-[#DCD4C7] bg-white px-3 py-2 rounded hover:bg-[#FAF8F5] cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-[#7D766E]" />
                <span>Filtros avanzados</span>
              </button>
            </div>
          </div>

          {/* Cards Queue */}
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-16 bg-[#EFEEEB] rounded overflow-hidden shrink-0">
                      <img
                        src={item.photoUrl}
                        alt={item.model}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[10px] text-[#7D766E] font-semibold">{item.code}</span>
                        {item.priorityBadge && (
                          <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-[#FDD79C]/30 text-[#755A2A]">
                            ● {item.priorityBadge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg text-[#15110D] mb-0.5">
                        {item.brand} {item.model} {item.year}
                      </h3>

                      <div className="text-xs text-[#7D766E] flex items-center gap-2">
                        <span>Patente: <strong className="font-mono text-[#15110D]">{item.plate}</strong></span>
                        <span>·</span>
                        <span>Tarifa solicitada: <strong className="text-[#15110D]">${formatARS(item.requestedPrice)} ARS/día</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="font-medium text-xs text-[#15110D]">{item.hostName}</div>
                    <div className="font-mono text-[11px] text-[#7D766E]">{item.hostTaxId}</div>
                    <span className="text-[10px] text-[#755A2A] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8E2D8] inline-block mt-1">
                      {item.hostType}
                    </span>
                  </div>
                </div>

                {/* Validation Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3 border-y border-[#F4EFEB] text-xs">
                  <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-[9px] text-[#7D766E] uppercase">Cédula del Vehículo</div>
                      <div className="font-medium text-[#15110D] text-[11px]">{item.cedula.label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-[9px] text-[#7D766E] uppercase">Inspección Técnica</div>
                      <div className="font-medium text-[#15110D] text-[11px]">{item.vtv.label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                    {item.insurance.status === 'warning' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-[9px] text-[#7D766E] uppercase">Póliza Flota Volanta</div>
                      <div className="font-medium text-[#15110D] text-[11px]">{item.insurance.label}</div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 text-xs">
                  <span className="text-[11px] text-[#7D766E] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#7D766E]" />
                    <span>{item.timeAgo}</span>
                  </span>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => alert(`Visualizando documentación adjunta de ${item.code}`)}
                      className="text-xs text-[#4B463F] hover:text-[#15110D] underline underline-offset-4 px-2 py-1 cursor-pointer"
                    >
                      Ver ficha completa
                    </button>

                    <button
                      onClick={() => handleObserve(item)}
                      className="text-xs border border-[#DCD4C7] hover:bg-[#FAF8F5] text-[#4B463F] px-3 py-1.5 rounded transition-colors cursor-pointer"
                    >
                      {item.waitingEndorsement ? 'Solicitar endoso' : 'Observar / Solicitar corrección'}
                    </button>

                    <button
                      onClick={() => handleApprove(item)}
                      disabled={item.waitingEndorsement}
                      className={`text-xs px-3.5 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                        item.waitingEndorsement
                          ? 'bg-[#EAE8E5] text-[#7D766E] cursor-not-allowed'
                          : 'bg-[#15110D] hover:bg-[#2A2621] text-white shadow-xs'
                      }`}
                    >
                      {item.waitingEndorsement ? 'Aprobar (Bloqueado)' : 'Aprobar publicación'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-[#7D766E] pt-4 border-t border-[#E8E2D8]">
            <span>Mostrando 1 - 4 de 8 publicaciones pendientes</span>
            <div className="flex items-center gap-1">
              <span className="w-7 h-7 rounded border border-[#15110D] bg-[#15110D] text-white flex items-center justify-center font-semibold">
                1
              </span>
              <span className="w-7 h-7 rounded border border-[#DCD4C7] bg-white flex items-center justify-center text-[#4B463F]">
                2
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Verificaciones en curso & Auditoría */}
        <div className="lg:col-span-4 space-y-6">
          {/* Verificaciones en curso (Live API) */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#755A2A]" />
                <h3 className="font-serif text-base text-[#15110D]">Verificaciones en curso</h3>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-semibold">
                LIVE API
              </span>
            </div>

            <p className="text-xs text-[#7D766E] mb-4">
              Alertas y chequeos automáticos sincronizados con DNRPA, Renaper y AFIP/ARCA.
            </p>

            <div className="space-y-3 text-xs">
              {/* Item 1 */}
              <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#15110D]">DNRPA / Registro Automotor</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 rounded font-bold">OK</span>
                </div>
                <p className="text-[#4B463F] text-[11px] mb-1">
                  AF 782 ZK: Dominio sin embargos ni denuncias de robo.
                </p>
                <span className="text-[10px] text-[#7D766E]">Hace 8 min</span>
              </div>

              {/* Item 2 */}
              <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#15110D]">AFIP Constancia CUIT</span>
                  <span className="text-[10px] text-[#755A2A] bg-[#FDD79C]/30 px-1.5 rounded font-bold">EN COLA</span>
                </div>
                <p className="text-[#4B463F] text-[11px] mb-1">
                  Validando condición fiscal de AgroSur SRL (Facturación A).
                </p>
                <span className="text-[10px] text-[#7D766E]">Hace 14 min</span>
              </div>

              {/* Item 3 */}
              <div className="p-3 bg-[#FAF8F5] rounded border border-[#E8E2D8]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#15110D]">Alerta Infracciones CABA</span>
                  <span className="text-[10px] text-red-700 bg-red-50 px-1.5 rounded font-bold">OBSERVADO</span>
                </div>
                <p className="text-[#4B463F] text-[11px] mb-1">
                  AE 419 KT registra 2 multas por exceso de velocidad sin resolver.
                </p>
                <span className="text-[10px] text-[#7D766E]">Hace 27 min</span>
              </div>
            </div>
          </div>

          {/* Registro de Auditoría */}
          <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#755A2A]" />
                <h3 className="font-serif text-base text-[#15110D]">Registro de auditoría</h3>
              </div>
              <button
                onClick={() => alert('Historial completo de auditoría')}
                className="text-xs text-[#7D766E] hover:text-[#15110D] underline cursor-pointer"
              >
                Ver historial
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-[#F4EFEB]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#15110D]">
                    <strong>Facundo R.</strong> aprobó publicación de <strong>Audi Q3 35 TFSI</strong> (#PUB-0872)
                  </div>
                  <div className="text-[10px] text-[#7D766E] mt-0.5">Hoy a las 11:24 · IP 190.191.24.11</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2.5 border-b border-[#F4EFEB]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#15110D]">
                    <strong>Lucía M.</strong> solicitó re-escaneo de cédula a <strong>Gastón Pereyra</strong>
                  </div>
                  <div className="text-[10px] text-[#7D766E] mt-0.5">Hoy a las 10:48 · Ticket #REV-419</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#15110D]">
                    <strong>Admin Sistema</strong> rechazó publicación por cédula azul vencida (#PUB-0869)
                  </div>
                  <div className="text-[10px] text-[#7D766E] mt-0.5">Hoy a las 09:15 · Regla de negocio #04</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security footnote */}
          <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg text-xs text-[#7D766E] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#755A2A]" />
              <span>Sesión encriptada SSL 256-bit</span>
            </span>
            <span className="text-[10px] font-medium text-[#15110D]">● Servidores Buenos Aires</span>
          </div>
        </div>
      </div>
    </div>
  );
};
