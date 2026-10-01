import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetodoPago } from '../types';
import {
  calcularPrecioDetalle,
  formatearMoneda,
  formatearFecha,
} from '../utils/pricing';
import { Button } from '../components/ui/Button';

export const CheckoutView: React.FC = () => {
  const {
    carrito,
    getPublicacionCompleta,
    crearReservaDesdeCarrito,
    simularResultadoMercadoPago,
    currentUser,
  } = useApp();
  const navigate = useNavigate();

  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago>('MERCADO_PAGO');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mercado Pago simulated checkout modal
  const [showMpModal, setShowMpModal] = useState(false);
  const [createdData, setCreatedData] = useState<{ idReserva: string; idPago: string } | null>(null);

  const publicacion = carrito ? getPublicacionCompleta(carrito.idPublicacion) : undefined;

  const calculo = useMemo(() => {
    if (!publicacion || !carrito) return null;
    return calcularPrecioDetalle(
      publicacion.precioDia,
      publicacion.descuentoPorcentaje,
      carrito.fechaInicio,
      carrito.fechaFin
    );
  }, [publicacion, carrito]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (!carrito || !publicacion || !calculo) {
    navigate('/carrito');
    return null;
  }

  const v = publicacion.vehiculo;
  const u = publicacion.ubicacion;

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    const result = crearReservaDesdeCarrito(selectedMetodo);
    if (!result) {
      setIsProcessing(false);
      return;
    }

    if (selectedMetodo === 'MERCADO_PAGO') {
      // Show simulated external MP modal
      setCreatedData({
        idReserva: result.reserva.idReserva,
        idPago: result.pago.idPago,
      });
      setIsProcessing(false);
      setShowMpModal(true);
    } else {
      // Cash payment confirmed: directly goes to booking detail in PENDIENTE state
      setIsProcessing(false);
      navigate(`/reservas/${result.reserva.idReserva}?creada=true`);
    }
  };

  const handleMpSimulation = (resultado: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE') => {
    if (!createdData) return;
    if (resultado === 'APROBADO' || resultado === 'RECHAZADO') {
      simularResultadoMercadoPago(createdData.idPago, resultado);
    }
    setShowMpModal(false);
    navigate(`/reservas/${createdData.idReserva}?mpResultado=${resultado}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/carrito"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al carrito</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-[#15110d]">Confirmar Reserva</h1>
        <p className="text-sm text-[#4b463f] mt-1">
          Elige el método de pago para formalizar tu solicitud de alquiler.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Payment Methods Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#cec5bc] rounded-lg p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1b1c1a] border-b border-[#efeeeb] pb-3">
              Seleccionar método de pago
            </h3>

            {/* Method: Mercado Pago */}
            <label
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMetodo === 'MERCADO_PAGO'
                  ? 'border-[#755a2a] bg-[#fbf9f6]'
                  : 'border-[#e4e2df] hover:border-[#cec5bc]'
              }`}
            >
              <input
                type="radio"
                name="metodoPago"
                checked={selectedMetodo === 'MERCADO_PAGO'}
                onChange={() => setSelectedMetodo('MERCADO_PAGO')}
                className="mt-1 accent-[#755a2a]"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#1b1c1a] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#009ee3]" />
                    Mercado Pago (Checkout transparente / externo)
                  </span>
                  <span className="text-[11px] font-bold text-[#009ee3] bg-[#009ee3]/10 px-2 py-0.5 rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-[#7d766e]">
                  Serás redirigido a la pasarela de pago para abonar con tarjeta de débito, crédito o dinero en cuenta. Ventana de acreditación de 30 minutos.
                </p>
              </div>
            </label>

            {/* Method: Efectivo */}
            <label
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMetodo === 'EFECTIVO'
                  ? 'border-[#755a2a] bg-[#fbf9f6]'
                  : 'border-[#e4e2df] hover:border-[#cec5bc]'
              }`}
            >
              <input
                type="radio"
                name="metodoPago"
                checked={selectedMetodo === 'EFECTIVO'}
                onChange={() => setSelectedMetodo('EFECTIVO')}
                className="mt-1 accent-[#755a2a]"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#1b1c1a] flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#755a2a]" />
                    Pago en Efectivo
                  </span>
                  <span className="text-[11px] font-bold text-[#785c2c] bg-[#fdd79c]/30 px-2 py-0.5 rounded">
                    Aprobación ADMIN
                  </span>
                </div>
                <p className="text-xs text-[#7d766e]">
                  La reserva se registrará en estado <strong>PENDIENTE</strong> hasta que la Administración de Volanta verifique el cobro en efectivo. No requiere tarjeta.
                </p>
              </div>
            </label>
          </div>

          {/* Delivery & Schedule reminders */}
          <div className="bg-[#f5f3f0] border border-[#cec5bc] rounded-lg p-5 space-y-2 text-xs text-[#4b463f]">
            <h4 className="font-semibold text-[#1b1c1a] uppercase tracking-wider text-[11px]">
              Términos de retiro y devolución:
            </h4>
            <p>
              • <strong>Punto acordado:</strong> {u?.direccion}, {u?.localidad || u?.ciudad}.
            </p>
            <p>
              • <strong>Horario fijo de entrega y devolución:</strong> {publicacion.horaRetiroDevolucion} hs.
            </p>
            <p>
              • <strong>Cancelaciones:</strong> Podrás cancelar la reserva antes de la fecha pactada de inicio desde tu panel.
            </p>
          </div>
        </div>

        {/* Right Column: Reservation Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#cec5bc] rounded-lg p-6 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#1b1c1a] border-b border-[#efeeeb] pb-3">
              Detalle de la reserva
            </h3>

            <div className="space-y-3 text-xs text-[#4b463f]">
              <div className="flex justify-between">
                <span className="text-[#7d766e]">Vehículo:</span>
                <span className="font-bold text-[#1b1c1a]">
                  {v?.marca} {v?.modelo} ({v?.anio})
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7d766e]">Período:</span>
                <span className="font-medium text-[#1b1c1a]">
                  {formatearFecha(carrito.fechaInicio)} al {formatearFecha(carrito.fechaFin)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7d766e]">Días de alquiler:</span>
                <span className="font-medium text-[#1b1c1a]">
                  {calculo.dias} {calculo.dias === 1 ? 'día' : 'días'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7d766e]">Subtotal diario:</span>
                <span>{formatearMoneda(calculo.subtotalBruto)}</span>
              </div>

              {calculo.montoDescuento > 0 && (
                <div className="flex justify-between text-[#755a2a] font-medium">
                  <span>Descuento aplicado ({calculo.descuentoPorcentaje}%):</span>
                  <span>- {formatearMoneda(calculo.montoDescuento)}</span>
                </div>
              )}

              <div className="flex justify-between font-serif font-bold text-lg text-[#1b1c1a] pt-3 border-t border-[#efeeeb]">
                <span>Total a abonar</span>
                <span>{formatearMoneda(calculo.total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isProcessing}
              onClick={handleConfirmOrder}
            >
              {selectedMetodo === 'MERCADO_PAGO'
                ? 'Continuar a Mercado Pago'
                : 'Confirmar reserva en Efectivo'}
            </Button>
          </div>
        </div>
      </div>

      {/* Simulated Mercado Pago Modal */}
      {showMpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#009ee3] rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5 text-[#1b1c1a] animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeeb]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#009ee3]/10 text-[#009ee3] flex items-center justify-center font-bold">
                  MP
                </div>
                <span className="font-serif font-bold text-base text-[#1b1c1a]">
                  Checkout Mercado Pago (Simulador)
                </span>
              </div>
              <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                Sandbox
              </span>
            </div>

            <div className="bg-[#f5f3f0] p-4 rounded-lg text-xs space-y-1.5 text-[#4b463f]">
              <p>
                <strong>Concepto:</strong> Alquiler de {v?.marca} {v?.modelo} ({calculo.dias} días)
              </p>
              <p>
                <strong>Monto a cobrar:</strong> {formatearMoneda(calculo.total)}
              </p>
              <p className="text-[11px] text-[#7d766e] pt-1">
                * Como este es un prototipo frontend, simula el resultado del webhook de Mercado Pago sin credenciales reales ni transacciones bancarias.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7d766e] block">
                Selecciona el resultado a simular:
              </span>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="md"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white w-full justify-start"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => handleMpSimulation('APROBADO')}
                >
                  Simular Pago Aprobado (Acredita y confirma)
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-start text-[#785c2c]"
                  icon={<Clock className="w-4 h-4" />}
                  onClick={() => handleMpSimulation('PENDIENTE')}
                >
                  Dejar Pago Pendiente (Ventana de 30 min)
                </Button>

                <Button
                  variant="destructive"
                  size="md"
                  className="w-full justify-start"
                  icon={<XCircle className="w-4 h-4" />}
                  onClick={() => handleMpSimulation('RECHAZADO')}
                >
                  Simular Pago Rechazado (Fondos insuficientes/tarjeta)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
