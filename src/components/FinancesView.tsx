import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  Shield,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Transaction } from '../types';
import { formatARS } from '../utils/formatters';

interface FinancesViewProps {
  transactions: Transaction[];
  onOpenWithdrawalModal?: () => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'credited' | 'custody' | 'withheld'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [copiedCVU, setCopiedCVU] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const [transferNotice, setTransferNotice] = useState(false);

  const handleCopyCVU = () => {
    navigator.clipboard.writeText('0000003100094829104820');
    setCopiedCVU(true);
    setTimeout(() => setCopiedCVU(false), 2000);
  };

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  const handleTransfer = () => {
    setTransferNotice(true);
    setTimeout(() => setTransferNotice(false), 3000);
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (activeTab === 'credited' && t.status !== 'Acreditado') return false;
      if (activeTab === 'custody' && t.status !== 'En custodia') return false;
      if (activeTab === 'withheld' && t.status !== 'Liquidado') return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          t.reservationCode.toLowerCase().includes(q) ||
          t.vehicleName.toLowerCase().includes(q) ||
          t.guestName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [transactions, activeTab, searchQuery]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#7D766E] mb-1">
            PANEL DE ANFITRIÓN / FINANZAS Y LIQUIDACIONES
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#15110D] font-normal tracking-tight mb-2">
            Pagos y Liquidaciones
          </h1>
          <p className="text-xs text-[#4B463F] max-w-2xl">
            Supervisá tus cobros por alquileres, fechas estimadas de acreditación de Mercado Pago y descargá tus
            comprobantes fiscales reglamentarios.
          </p>
        </div>

        <button
          onClick={() => alert('Configuración de CVU / Cuenta Bancaria y Mercado Pago Checkout')}
          className="text-xs border border-[#DCD4C7] hover:bg-white text-[#15110D] px-4 py-2 rounded shadow-xs transition-colors cursor-pointer self-start md:self-auto flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5 text-[#755A2A]" />
          <span>Configurar cuenta de cobro (CVU / Mercado Pago)</span>
        </button>
      </div>

      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#7D766E] text-[10px] uppercase font-semibold mb-2">
              <span>SALDO DISPONIBLE PARA RETIRO</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-[#15110D] tabular-nums mb-1">
              $345.000 <span className="text-xs font-sans font-normal text-[#7D766E]">ARS</span>
            </div>
            <div className="text-[11px] text-[#7D766E]">Liberado para transferencia inmediata</div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F4EFEB]">
            <button
              onClick={handleTransfer}
              className="text-xs text-[#15110D] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Transferir a banco → Sin costo</span>
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#7D766E] text-[10px] uppercase font-semibold mb-2">
              <span>EN CUSTODIA / A LIQUIDAR</span>
              <Clock className="w-3.5 h-3.5 text-[#755A2A]" />
            </div>
            <div className="text-2xl font-bold font-serif text-[#15110D] tabular-nums mb-1">
              $550.000 <span className="text-xs font-sans font-normal text-[#7D766E]">ARS</span>
            </div>
            <div className="text-[11px] text-[#7D766E]">2 reservas activas bajo garantía Volanta</div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F4EFEB] text-[11px] text-[#755A2A] font-medium">
            Próx. cierre: 25 Nov <span className="text-[9px] uppercase px-1 rounded bg-[#FDD79C]/30">GARANTIZADO</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#7D766E] text-[10px] uppercase font-semibold mb-2">
              <span>TOTAL FACTURADO EN 2025</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-serif text-[#15110D] tabular-nums mb-1">
              $4.265.000 <span className="text-xs font-sans font-normal text-[#7D766E]">ARS</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">↗ +24% vs. período anterior</div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F4EFEB] text-[11px] text-[#7D766E] flex justify-between">
            <span>18 contratos completados</span>
            <span className="font-semibold text-[#15110D]">Anfitrión Pro</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#7D766E] text-[10px] uppercase font-semibold mb-2">
              <span>RETENCIONES Y COMISIONES</span>
              <FileText className="w-3.5 h-3.5 text-[#7D766E]" />
            </div>
            <div className="text-2xl font-bold font-serif text-[#15110D] tabular-nums mb-1">
              -$426.500 <span className="text-xs font-sans font-normal text-[#7D766E]">ARS</span>
            </div>
            <div className="text-[11px] text-[#7D766E]">10% servicio Volanta + cobertura Allianz</div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F4EFEB] text-[11px] text-[#7D766E] flex justify-between">
            <span className="hover:underline cursor-pointer">Ver detalle tributario</span>
            <span className="font-mono text-[10px]">AFIP Res. 4659</span>
          </div>
        </div>
      </div>

      {transferNotice && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>
            Transferencia de $345.000 ARS iniciada con éxito a tu CVU vinculado. Acreditación estimada en 2 horas.
          </span>
        </div>
      )}

      {/* Scheduled Settlement Highlight Banner */}
      <div className="bg-white border border-[#E8E2D8] rounded-lg p-5 mb-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#E8E2D8] shrink-0">
            <Clock className="w-5 h-5 text-[#755A2A]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7D766E]">
                PRÓXIMA ACREDITACIÓN AUTOMÁTICA
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                ● Mercado Pago Checkout Pro
              </span>
            </div>
            <h4 className="font-serif text-sm font-semibold text-[#15110D] mb-0.5">
              Martes 25 de Noviembre por $275.400 ARS correspondiente a la reserva #VOL-84920 (Volkswagen Taos) tras la
              devolución conforme del vehículo.
            </h4>
            <p className="text-xs text-[#7D766E]">
              El fondo pasará automáticamente a tu CVU vinculado sin cargos de procesamiento.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => alert('Modificar fecha de corte o cuenta de liquidación')}
            className="text-xs border border-[#DCD4C7] hover:bg-[#FAF8F5] text-[#4B463F] px-3.5 py-2 rounded transition-colors cursor-pointer"
          >
            Modificar fecha de corte
          </button>
          <button
            onClick={() => alert('Inspección y acta digital de entrega técnica #VOL-84920')}
            className="text-xs bg-[#15110D] hover:bg-[#2A2621] text-white px-3.5 py-2 rounded transition-colors cursor-pointer font-medium"
          >
            Ver entrega técnica
          </button>
        </div>
      </div>

      {/* Operations Table with Tabs & Filters */}
      <div className="bg-white border border-[#E8E2D8] rounded-lg overflow-hidden shadow-xs mb-8">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-[#E8E2D8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'all' ? 'bg-[#15110D] text-white' : 'text-[#4B463F] hover:bg-[#F4EFEB]'
              }`}
            >
              Todas las operaciones 24
            </button>
            <button
              onClick={() => setActiveTab('credited')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'credited' ? 'bg-[#15110D] text-white' : 'text-[#4B463F] hover:bg-[#F4EFEB]'
              }`}
            >
              Acreditadas 19
            </button>
            <button
              onClick={() => setActiveTab('custody')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'custody' ? 'bg-[#15110D] text-white' : 'text-[#4B463F] hover:bg-[#F4EFEB]'
              }`}
            >
              En custodia / Pendientes 3
            </button>
            <button
              onClick={() => setActiveTab('withheld')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'withheld' ? 'bg-[#15110D] text-white' : 'text-[#4B463F] hover:bg-[#F4EFEB]'
              }`}
            >
              Retenciones 2
            </button>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs text-[#15110D] border border-[#DCD4C7] hover:bg-[#FAF8F5] px-3.5 py-1.5 rounded transition-colors cursor-pointer self-start lg:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#755A2A]" />
            <span>{exportNotice ? '✓ Descargando...' : 'Exportar reporte (CSV / Excel)'}</span>
          </button>
        </div>

        {/* Second Filter Row */}
        <div className="p-4 bg-[#FAF8F5] border-b border-[#E8E2D8] grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-[#7D766E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código de reserva (#VOL-...) o vehículo"
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none"
            />
          </div>

          <div>
            <select
              defaultValue="2025"
              className="w-full px-3 py-1.5 bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none cursor-pointer"
            >
              <option value="2025">Año 2025 (Enero - Diciembre)</option>
              <option value="2024">Año 2024</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#DCD4C7] rounded focus:border-[#15110D] focus:outline-none cursor-pointer"
            >
              <option value="all">Todos mis vehículos vinculados</option>
              <option value="corolla">Toyota Corolla XEI</option>
              <option value="taos">Volkswagen Taos</option>
              <option value="208">Peugeot 208</option>
            </select>

            <button
              onClick={() => alert('Filtros avanzados')}
              title="Más filtros"
              className="p-2 border border-[#DCD4C7] bg-white rounded hover:bg-[#FAF8F5] cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#7D766E]" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E8E2D8] text-[10px] uppercase font-semibold text-[#7D766E] tracking-wider">
              <tr>
                <th className="py-3 px-4">FECHA</th>
                <th className="py-3 px-4">RESERVA / VEHÍCULO</th>
                <th className="py-3 px-4">CONDUCTOR / HUÉSPED</th>
                <th className="py-3 px-4 text-right">MONTO BRUTO</th>
                <th className="py-3 px-4 text-right">COMISIÓN & SEGURO</th>
                <th className="py-3 px-4 text-right">MONTO NETO</th>
                <th className="py-3 px-4 text-center">ESTADO DE PAGO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFEB]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-4 text-[#7D766E] whitespace-nowrap">{tx.date}</td>

                  <td className="py-4 px-4">
                    <div className="font-mono font-semibold text-[#15110D] text-[11px] mb-0.5">
                      {tx.reservationCode}
                    </div>
                    <div className="text-[#4B463F] font-medium">{tx.vehicleName}</div>
                    {tx.locationTag && (
                      <div className="text-[10px] text-[#7D766E]">{tx.locationTag}</div>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EAE8E5] text-[10px] font-bold flex items-center justify-center text-[#15110D]">
                        {tx.guestName.split(' ')[0][0]}
                        {tx.guestName.split(' ')[1] ? tx.guestName.split(' ')[1][0] : ''}
                      </div>
                      <div>
                        <div className="font-medium text-[#15110D]">{tx.guestName}</div>
                        <div className="text-[10px] text-[#7D766E]">
                          {tx.isFrequentGuest ? 'Cliente habitual' : 'Verificado'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-medium text-[#15110D] tabular-nums">
                    ${formatARS(tx.grossAmount)} ARS
                  </td>

                  <td className="py-4 px-4 text-right text-red-700 tabular-nums">
                    <div>-${formatARS(tx.feeAmount)} ARS</div>
                    <div className="text-[10px] text-[#7D766E]">{tx.feeDetail}</div>
                  </td>

                  <td className="py-4 px-4 text-right font-bold text-[#15110D] tabular-nums">
                    ${formatARS(tx.netAmount)} ARS
                  </td>

                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                          tx.status === 'Acreditado'
                            ? 'bg-emerald-50 text-emerald-800'
                            : tx.status === 'En custodia'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-[#FAF8F5] text-[#7D766E] border border-[#E8E2D8]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tx.status === 'Acreditado'
                              ? 'bg-emerald-600'
                              : tx.status === 'En custodia'
                              ? 'bg-amber-600'
                              : 'bg-[#7D766E]'
                          }`}
                        />
                        {tx.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#7D766E] mt-0.5 font-mono">{tx.mpRef}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#7D766E]">
          <div>Mostrando 1–{filtered.length} de 24 operaciones registradas</div>

          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded border border-[#15110D] bg-[#15110D] text-white font-medium">
              1
            </button>
            <button className="w-7 h-7 rounded border border-[#DCD4C7] bg-white hover:bg-[#FAF8F5] text-[#4B463F]">
              2
            </button>
            <button className="w-7 h-7 rounded border border-[#DCD4C7] bg-white hover:bg-[#FAF8F5] text-[#4B463F]">
              3
            </button>
            <button className="p-1 hover:text-[#15110D]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cards: Payment Channel & AFIP Tax Regime */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Canal de cobro preferido */}
        <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base text-[#15110D]">Canal de cobro preferido</h3>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Cuenta bancaria verificada
              </span>
            </div>

            <p className="text-xs text-[#7D766E] mb-4">Mercado Pago Checkout Pro & Transferencias CVU</p>

            <div className="space-y-2 text-xs bg-[#FAF8F5] p-3.5 rounded border border-[#E8E2D8] mb-4">
              <div className="flex justify-between">
                <span className="text-[#7D766E]">Titular de la cuenta:</span>
                <span className="font-medium text-[#15110D]">Martín Gómez</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7D766E]">CUIT / CUIL registrado:</span>
                <span className="font-mono text-[#15110D]">20-38491029-4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7D766E]">CVU / CBU destino:</span>
                <div className="flex items-center gap-1.5 font-mono text-[#15110D]">
                  <span>0000003100094829104820</span>
                  <button
                    onClick={handleCopyCVU}
                    title="Copiar CVU"
                    className="text-[#7D766E] hover:text-[#15110D] cursor-pointer"
                  >
                    {copiedCVU ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#F4EFEB] text-xs">
            <span className="text-[11px] text-[#7D766E]">
              Las transferencias de liquidación se procesan en un plazo máximo de 24 horas hábiles.
            </span>
            <button
              onClick={() => alert('Modificar CVU de destino')}
              className="text-xs text-[#15110D] hover:underline font-medium shrink-0 cursor-pointer"
            >
              Cambiar CVU / Cuenta
            </button>
          </div>
        </div>

        {/* Régimen Impositivo (AFIP) */}
        <div className="bg-white border border-[#E8E2D8] rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#755A2A]" />
              <h3 className="font-serif text-base text-[#15110D]">Régimen Impositivo (AFIP)</h3>
            </div>

            <p className="text-xs text-[#4B463F] leading-relaxed mb-4">
              Condición tributaria: <strong>Monotributo - Categoría F</strong>. Volanta actúa como agente de percepción
              según normativa <strong>RG AFIP N° 4659/2020</strong>.
            </p>

            <div className="space-y-2 text-xs text-[#4B463F] mb-6">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Emisión automática de factura electrónica B a huéspedes.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Certificados de retención de Ingresos Brutos (IIBB) disponibles mensualmente.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#F4EFEB] text-xs">
            <a
              href="#afip"
              onClick={(e) => {
                e.preventDefault();
                alert('Portal fiscal para anfitriones de Volanta');
              }}
              className="text-xs text-[#15110D] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Centro fiscal para anfitriones</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            <button
              onClick={() => alert('Actualizar constancia de inscripción AFIP / ARCA')}
              className="text-xs border border-[#DCD4C7] hover:bg-[#FAF8F5] text-[#15110D] px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              Actualizar Constancia CUIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
