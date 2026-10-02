import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Ban,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatearMoneda, formatearFecha, hoyString, calcularDias } from '../utils/pricing';
import {
  getEstadoReservaBadge,
  getEstadoPagoBadge,
  getMetodoPagoLabel,
} from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const BookingDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const recienCreada = searchParams.get('creada') === 'true';
  const mpResultado = searchParams.get('mpResultado');

  const navigate = useNavigate();
  const { getReservaPorId, cancelarReserva, simularResultadoMercadoPago, currentUser } = useApp();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  // Modal to continue payment for pending MP booking
  const [showMpModal, setShowMpModal] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const reserva = id ? getReservaPorId(id) : undefined;

  if (!reserva) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1b1c1a]">Reserva no encontrada</h2>
        <p className="text-xs sm:text-sm text-[#4b463f]">No se encontró el registro de la reserva solicitada.</p>
        <Link to="/mis-reservas">
          <Button variant="outline" size="sm">
            Volver a mis reservas
          </Button>
        </Link>
      </div>
    );
  }

  const pub = reserva.publicacion;
  const v = pub?.vehiculo;
  const u = pub?.ubicacion;
  const pago = reserva.pago;
  const dias = calcularDias(reserva.fechaInicio, reserva.fechaFin);

  const hoy = hoyString();
  const puedeCancelar =
    reserva.fechaInicio > hoy &&
    (reserva.estado === 'PENDIENTE' || reserva.estado === 'CONFIRMADA');

  const handleCancelBooking = () => {
    const res = cancelarReserva(reserva.idReserva);
    setShowCancelDialog(false);
    if (!res.ok) {
      setCancelFeedback(res.message);
    }
  };

  const handleMpSimulation = (resultado: 'APROBADO' | 'RECHAZADO') => {
    if (!pago) return;
    simularResultadoMercadoPago(pago.idPago, resultado);
    setShowMpModal(false);
  };

  const badgeReserva = getEstadoReservaBadge(reserva.estado);
  const badgePago = pago ? getEstadoPagoBadge(pago.estado, pago.metodoPago) : null;

  const pendientePagoMp =
    reserva.estado === 'PENDIENTE' &&
    pago?.metodoPago === 'MERCADO_PAGO' &&
    pago.estado === 'PENDIENTE';

  return (
    <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/mis-reservas"
          className="inline-flex items-center gap-1.5 text-xs text-[#7d766e] hover:text-[#1b1c1a] font-medium transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a mis reservas</span>
        </Link>

        {recienCreada && (
          <div className="mb-4 p-4 bg-[#f4efeb] border border-[#e8e2d8] rounded-[8px] flex items-center gap-3 text-xs text-[#15110d]">
            <CheckCircle2 className="w-5 h-5 text-[#755a2a] shrink-0" />
            <div>
              <p className="font-bold">¡Solicitud de reserva registrada!</p>
              <p className="text-[#4b463f]">
                Tu reserva ha sido creada en estado PENDIENTE. Para pagos en efectivo, la administración confirmará la solicitud una vez verificado el pago.
              </p>
            </div>
          </div>
        )}

        {mpResultado && (
          <div
            className={`mb-4 p-4 rounded-[8px] flex items-center gap-3 text-xs ${
              mpResultado === 'APROBADO'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : mpResultado === 'RECHAZADO'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}
          >
            {mpResultado === 'APROBADO' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {mpResultado === 'RECHAZADO' && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <div>
              <p className="font-bold">Resultado de Mercado Pago: {mpResultado}</p>
              <p>
                {mpResultado === 'APROBADO'
                  ? 'El pago fue procesado correctamente y la reserva ha sido confirmada.'
                  : mpResultado === 'RECHAZADO'
                  ? 'El pago fue denegado por la entidad emisora. La reserva figura como rechazada.'
                  : 'El pago está en proceso de validación. Te notificaremos en cuanto cambie de estado.'}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#7d766e]">
                #{reserva.idReserva}
              </span>
              <span className="text-[#e8e2d8]">·</span>
              <span className="text-xs text-[#7d766e]">
                Registrada el {formatearFecha(reserva.fechaCreacion)}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-normal text-[#15110d] mt-1">
              {v?.marca} {v?.modelo} ({v?.anio})
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-[4px] text-xs font-bold ${badgeReserva.classes}`}>
              {badgeReserva.label}
            </span>
            {pago && (pago.estado !== 'PENDIENTE' || pago.metodoPago === 'EFECTIVO') && (
              <span className={`px-3 py-1 rounded-[4px] text-xs font-semibold ${badgePago?.classes}`}>
                {badgePago?.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {cancelFeedback && (
        <div className="p-3 bg-[#ffdad6]/30 border border-[#9b2c2c]/30 rounded-[8px] text-xs text-[#9b2c2c]">
          {cancelFeedback}
        </div>
      )}

      {/* Action banner if payment is pending via Mercado Pago */}
      {pendientePagoMp && (
        <div className="bg-[#f4efeb] border border-[#e8e2d8] rounded-[8px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif text-base text-[#15110d]">
              Pago pendiente de completar
            </h4>
            <p className="text-xs text-[#7d766e]">
              Aún no registramos el pago de Mercado Pago para esta reserva. Puedes continuar a la pasarela para confirmarla.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="bg-[#15110d] shrink-0"
            icon={<ExternalLink className="w-4 h-4" />}
            onClick={() => setShowMpModal(true)}
          >
            Continuar pago
          </Button>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reservation & Schedule Card */}
        <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-4">
          <h3 className="font-serif text-base text-[#15110d] border-b border-[#f4efeb] pb-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#755a2a]" />
            <span>Datos del Alquiler</span>
          </h3>

          <div className="space-y-3 text-xs text-[#4b463f]">
            <div>
              <span className="text-[#7d766e] block">Período reservado:</span>
              <p className="font-semibold text-sm text-[#1b1c1a] mt-0.5">
                Del {formatearFecha(reserva.fechaInicio)} al {formatearFecha(reserva.fechaFin)}
              </p>
              <p className="text-[11px] text-[#7d766e]">
                Duración: {dias} {dias === 1 ? 'día' : 'días'}
              </p>
            </div>

            <div>
              <span className="text-[#7d766e] block">Horario fijado de entrega y devolución:</span>
              <p className="font-semibold text-sm text-[#1b1c1a] mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#755a2a]" />
                {pub?.horaRetiroDevolucion || '10:00'} hs
              </p>
            </div>

            <div>
              <span className="text-[#7d766e] block">Punto de retiro y devolución:</span>
              <p className="font-semibold text-sm text-[#1b1c1a] mt-0.5 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#755a2a] shrink-0 mt-0.5" />
                <span>
                  {u?.direccion}, {u?.localidad || u?.ciudad}, {u?.ciudad}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment & Charges Card */}
        <div className="bg-white border border-[#e8e2d8] rounded-[8px] p-6 shadow-[0_1px_2px_rgba(21,17,13,0.06)] space-y-4">
          <h3 className="font-serif text-base text-[#15110d] border-b border-[#f4efeb] pb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#755a2a]" />
            <span>Detalle de Pago</span>
          </h3>

          <div className="space-y-3 text-xs text-[#4b463f]">
            {pago && (
              <>
                <div className="flex justify-between">
                  <span className="text-[#7d766e]">Método de pago:</span>
                  <span className="font-semibold text-[#1b1c1a] flex items-center gap-1.5">
                    {pago.metodoPago === 'MERCADO_PAGO' ? (
                      <CreditCard className="w-3.5 h-3.5 text-[#755a2a]" />
                    ) : (
                      <Banknote className="w-3.5 h-3.5 text-[#755a2a]" />
                    )}
                    {getMetodoPagoLabel(pago.metodoPago)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#7d766e]">Estado del pago:</span>
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${badgePago?.classes}`}>
                    {badgePago?.label}
                  </span>
                </div>

                {pago.preferenceId && (
                  <div className="flex justify-between">
                    <span className="text-[#7d766e]">ID de transacción:</span>
                    <span className="font-mono text-[#1b1c1a]">{pago.preferenceId}</span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between font-serif text-base text-[#15110d] pt-3 border-t border-[#f4efeb]">
              <span>Monto total:</span>
              <span>{formatearMoneda(reserva.total)}</span>
            </div>

            {pago?.metodoPago === 'EFECTIVO' && pago.estado === 'PENDIENTE' && (
              <div className="mt-3 p-3 bg-[#f4efeb] border border-[#e8e2d8] rounded-[4px] text-[11px] text-[#4b463f]">
                <strong>Aviso de pago en efectivo:</strong> El pago se encuentra registrado como PENDIENTE. Un administrador de Volanta aprobará o rechazará la solicitud una vez efectivizado el importe.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation section */}
      <div className="bg-[#f4efeb] border border-[#e8e2d8] rounded-[8px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-serif text-base text-[#15110d]">
            Cancelación de la reserva
          </h4>
          <p className="text-xs text-[#7d766e]">
            {puedeCancelar
              ? 'Puedes cancelar esta reserva sin penalidad dado que la fecha de inicio es posterior a hoy.'
              : 'Esta reserva ya no admite cancelación (la fecha de inicio ya comenzó o el estado no lo permite).'}
          </p>
        </div>

        {puedeCancelar && (
          <Button
            variant="destructive"
            size="sm"
            icon={<Ban className="w-3.5 h-3.5" />}
            onClick={() => setShowCancelDialog(true)}
          >
            Cancelar reserva
          </Button>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="¿Confirmas la cancelación de la reserva?"
        message={`Estás a punto de cancelar tu reserva #${reserva.idReserva} para el vehículo ${v?.marca} ${v?.modelo}.\n\nTen en cuenta que esta acción es definitiva y liberará las fechas del vehículo.`}
        confirmText="Sí, cancelar reserva"
        cancelText="No cancelar"
        isDestructive
        onConfirm={handleCancelBooking}
        onClose={() => setShowCancelDialog(false)}
      />

      {/* MP Modal from Detail */}
      {showMpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white border border-[#e8e2d8] rounded-[8px] shadow-[0_8px_24px_rgba(21,17,13,0.12)] max-w-md w-full p-6 space-y-5 text-[#1b1c1a] animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4efeb]">
              <span className="font-serif font-bold text-base text-[#15110d]">
                Completar pago con Mercado Pago
              </span>
              <span className="text-[10px] font-bold uppercase text-[#755a2a] bg-[#f4efeb] px-2 py-0.5 rounded-[4px]">
                Sandbox
              </span>
            </div>

            <p className="text-xs text-[#4b463f] leading-relaxed">
              Monto a abonar: <strong>{formatearMoneda(reserva.total)}</strong>. Simula la resolución del checkout:
            </p>

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
                variant="destructive"
                size="md"
                className="w-full justify-start"
                icon={<XCircle className="w-4 h-4" />}
                onClick={() => handleMpSimulation('RECHAZADO')}
              >
                Simular Pago Rechazado (Fondos insuficientes)
              </Button>
            </div>

            <div className="pt-2 border-t border-[#f4efeb] flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowMpModal(false)}>
                Volver
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
