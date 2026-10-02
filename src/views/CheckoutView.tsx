import React, { useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetodoPago, Reserva, Pago } from '../types';
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

  // Keep snapshot of cart when entering checkout so emptying cart doesn't unmount
  const initialCartRef = useRef(carrito);
  const activeCart = carrito || initialCartRef.current;

  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago>('MERCADO_PAGO');
  const [isProcessing, setIsProcessing] = useState(false);

  // Created reservation state
  const [createdOrder, setCreatedOrder] = useState<{
    reserva: Reserva;
    pago: Pago;
  } | null>(null);

  // Mercado Pago simulated checkout modal
  const [showMpModal, setShowMpModal] = useState(false);

  const publicacion = activeCart ? getPublicacionCompleta(activeCart.idPublicacion) : undefined;

  const calculo = useMemo(() => {
    if (!publicacion || !activeCart) return null;
    return calcularPrecioDetalle(
      publicacion.precioDia,
      publicacion.descuentoPorcentaje,
      activeCart.fechaInicio,
      activeCart.fechaFin
    );
  }, [publicacion, activeCart]);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (!activeCart || !publicacion || !calculo) {
    if (!createdOrder) {
      navigate('/carrito');
      return null;
    }
  }

  const v = publicacion?.vehiculo;
  const u = publicacion?.ubicacion;

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    const result = crearReservaDesdeCarrito(selectedMetodo);
    if (!result) {
      setIsProcessing(false);
      return;
    }

    setCreatedOrder(result);
    setIsProcessing(false);

    if (selectedMetodo === 'EFECTIVO') {
      navigate(`/reservas/${result.reserva.idReserva}?creada=true`);
    }
  };

  const handleMpSimulation = (resultado: 'APROBADO' | 'RECHAZADO' | 'PENDIENTE') => {
    if (!createdOrder) return;
    if (resultado === 'APROBADO' || resultado === 'RECHAZADO') {
      simularResultadoMercadoPago(createdOrder.pago.idPago, resultado);
    }
    setShowMpModal(false);
    navigate(`/reservas/${createdOrder.reserva.idReserva}?mpResultado=${resultado}`);
  };

  // If order was created for Mercado Pago, display the step to proceed to payment
  if (createdOrder && selectedMetodo === 'MERCADO_PAGO') {
    return (
      <div className="max-w-[720px] mx-auto px-6 lg:px-12 py-12 space-y-6">
        <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 lg:p-8 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#f4efeb]">
            <div className="w-10 h-10 rounded-[4px] bg-[#f4efeb] text-[#755a2a] flex items-center justify-center font-bold">
              MP
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[#15110d]">Reserva creada con éxito</h2>
              <p className="text-xs text-[#7d766e]">
                Reserva #{createdOrder.reserva.idReserva} · Estado: Pendiente de pago
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#4b463f] bg-[#f4efeb] p-4 rounded-[4px]">
            <p>
              <strong>Vehículo:</strong> {v?.marca} {v?.modelo} ({v?.anio})
            </p>
            <p>
              <strong>Período:</strong> {formatearFecha(createdOrder.reserva.fechaInicio)} al {formatearFecha(createdOrder.reserva.fechaFin)}
            </p>
            <p>
              <strong>Monto a abonar:</strong> {formatearMoneda(createdOrder.reserva.total)}
            </p>
            <p className="text-[11px] text-[#7d766e]">
              Tienes 30 minutos para completar el pago a través de Mercado Pago antes de que la reserva expire.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:flex-1 bg-[#15110d]"
              icon={<ExternalLink className="w-4 h-4" />}
              onClick={() => setShowMpModal(true)}
            >
              Continuar al pago con Mercado Pago
            </Button>
            <Link
              to={`/reservas/${createdOrder.reserva.idReserva}`}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="lg" className="w-full">
                Consultar mi reserva
              </Button>
            </Link>
          </div>
        </div>

        {/* Modal for Mercado Pago sandbox options */}
        {showMpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <div className="bg-white border border-[#e8e2d8] rounded-[8px] shadow-[0_8px_24px_rgba(21,17,13,0.12)] max-w-md w-full p-6 space-y-5 text-[#1b1c1a] animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#f4efeb]">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-[#15110d]">
                    Pasarela Mercado Pago (Simulación)
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#755a2a] bg-[#f4efeb] px-2 py-0.5 rounded-[4px]">
                  Sandbox
                </span>
              </div>

              <p className="text-xs text-[#4b463f] leading-relaxed">
                Selecciona la respuesta que retornará la pasarela de pago para comprobar cómo reacciona la aplicación ante cada estado:
              </p>

              <div className="flex flex-col gap-2 pt-1">
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
                  className="w-full justify-start text-[#755a2a]"
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
                  Simular Pago Rechazado (Tarjeta rechazada)
                </Button>
              </div>

              <div className="pt-2 border-t border-[#f4efeb] flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowMpModal(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/carrito"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al carrito</span>
        </Link>

        <h1 className="font-serif text-3xl font-normal text-[#15110d]">Confirmar Reserva</h1>
        <p className="text-xs sm:text-sm text-[#4b463f] mt-1">
          Elige el método de pago para formalizar tu solicitud de alquiler.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Payment Methods Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-4">
            <h3 className="font-serif text-base text-[#15110d] border-b border-[#f4efeb] pb-3">
              Seleccionar método de pago
            </h3>

            {/* Method: Mercado Pago */}
            <label
              className={`flex items-start gap-4 p-4 rounded-[4px] border cursor-pointer transition-all ${
                selectedMetodo === 'MERCADO_PAGO'
                  ? 'border-[#755a2a] bg-[#f4efeb]/40'
                  : 'border-[#e8e2d8] hover:border-[#cec5bc]'
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
                  <span className="font-semibold text-xs sm:text-sm text-[#1b1c1a] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#755a2a]" />
                    Mercado Pago (Checkout transparente / externo)
                  </span>
                  <span className="text-[10px] font-bold text-[#755a2a] bg-[#f4efeb] px-2 py-0.5 rounded-[4px]">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-[#7d766e]">
                  Podrás abonar con tarjeta de crédito, débito o saldo en cuenta. La ventana de pago es de 30 minutos.
                </p>
              </div>
            </label>

            {/* Method: Efectivo */}
            <label
              className={`flex items-start gap-4 p-4 rounded-[4px] border cursor-pointer transition-all ${
                selectedMetodo === 'EFECTIVO'
                  ? 'border-[#755a2a] bg-[#f4efeb]/40'
                  : 'border-[#e8e2d8] hover:border-[#cec5bc]'
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
                  <span className="font-semibold text-xs sm:text-sm text-[#1b1c1a] flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#755a2a]" />
                    Pago en Efectivo
                  </span>
                  <span className="text-[10px] font-bold text-[#7d766e] bg-[#f4efeb] px-2 py-0.5 rounded-[4px]">
                    En administración
                  </span>
                </div>
                <p className="text-xs text-[#7d766e]">
                  La reserva se registrará en estado <strong>PENDIENTE</strong> hasta que la Administración confirme la recepción del importe.
                </p>
              </div>
            </label>
          </div>

          {/* Delivery & Schedule terms */}
          <div className="bg-[#f4efeb] border border-[#e8e2d8] rounded-[8px] p-5 space-y-2 text-xs text-[#4b463f]">
            <h4 className="font-bold text-[#1b1c1a] uppercase tracking-wider text-[10px]">
              Términos de retiro y devolución:
            </h4>
            <p>
              • <strong>Punto acordado:</strong> {u?.direccion}, {u?.localidad || u?.ciudad}.
            </p>
            <p>
              • <strong>Horario fijo fijado por propietario:</strong> {publicacion?.horaRetiroDevolucion} hs.
            </p>
            <p>
              • <strong>Cancelación:</strong> Podrás cancelar la reserva sin costo antes de la fecha de inicio convenida.
            </p>
          </div>
        </div>

        {/* Right Column: Reservation Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-5">
            <h3 className="font-serif text-base text-[#15110d] border-b border-[#f4efeb] pb-3">
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
                  {formatearFecha(activeCart?.fechaInicio || '')} al {formatearFecha(activeCart?.fechaFin || '')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7d766e]">Días de alquiler:</span>
                <span className="font-medium text-[#1b1c1a]">
                  {calculo?.dias} {calculo?.dias === 1 ? 'día' : 'días'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7d766e]">Subtotal diario:</span>
                <span>{formatearMoneda(calculo?.subtotalBruto || 0)}</span>
              </div>

              {calculo && calculo.montoDescuento > 0 && (
                <div className="flex justify-between text-[#755a2a] font-medium">
                  <span>Descuento aplicado ({calculo.descuentoPorcentaje}%):</span>
                  <span>- {formatearMoneda(calculo.montoDescuento)}</span>
                </div>
              )}

              <div className="flex justify-between font-serif text-lg text-[#15110d] pt-3 border-t border-[#f4efeb]">
                <span>Total a abonar</span>
                <span>{formatearMoneda(calculo?.total || 0)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-[#15110d]"
              isLoading={isProcessing}
              onClick={handleConfirmOrder}
            >
              {selectedMetodo === 'MERCADO_PAGO'
                ? 'Confirmar y pagar con Mercado Pago'
                : 'Confirmar reserva en Efectivo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
