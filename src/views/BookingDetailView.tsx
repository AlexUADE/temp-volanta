import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  XCircle,
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
  const { getReservaPorId, cancelarReserva, currentUser } = useApp();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const reserva = id ? getReservaPorId(id) : undefined;

  if (!reserva) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">Reserva no encontrada</h2>
        <p className="text-sm text-[#4b463f]">No se encontró el registro de la reserva solicitada.</p>
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

  const badgeReserva = getEstadoReservaBadge(reserva.estado);
  const badgePago = pago ? getEstadoPagoBadge(pago.estado) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
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
          <div className="mb-4 p-4 bg-[#fdd79c]/30 border border-[#755a2a]/30 rounded-lg flex items-center gap-3 text-xs text-[#785c2c]">
            <CheckCircle2 className="w-5 h-5 text-[#755a2a] shrink-0" />
            <div>
              <p className="font-bold text-[#1b1c1a]">¡Solicitud de reserva registrada!</p>
              <p>
                Tu reserva ha sido creada en estado PENDIENTE. Para pagos en efectivo, la administración confirmará la solicitud una vez verificado el pago.
              </p>
            </div>
          </div>
        )}

        {mpResultado && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 text-xs ${
              mpResultado === 'APROBADO'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                : mpResultado === 'RECHAZADO'
                ? 'bg-red-50 border border-red-300 text-red-800'
                : 'bg-amber-50 border border-amber-300 text-amber-800'
            }`}
          >
            {mpResultado === 'APROBADO' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {mpResultado === 'RECHAZADO' && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {mpResultado === 'PENDIENTE' && <Clock className="w-5 h-5 text-amber-600 shrink-0" />}
            <div>
              <p className="font-bold">Resultado de Mercado Pago: {mpResultado}</p>
              <p>
                {mpResultado === 'APROBADO'
                  ? 'El pago fue procesado correctamente y la reserva ha sido confirmada.'
                  : mpResultado === 'RECHAZADO'
                  ? 'El pago fue denegado por la entidad bancaria. La reserva figura como rechazada.'
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
              <span className="text-[#cec5bc]">·</span>
              <span className="text-xs text-[#7d766e]">
                Registrada el {formatearFecha(reserva.fechaCreacion)}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#15110d] mt-1">
              {v?.marca} {v?.modelo} ({v?.anio})
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-bold ${badgeReserva.classes}`}>
              {badgeReserva.label}
            </span>
            {badgePago && (
              <span className={`px-3 py-1 rounded text-xs font-semibold ${badgePago.classes}`}>
                {badgePago.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {cancelFeedback && (
        <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/30 rounded-md text-xs text-[#93000a]">
          {cancelFeedback}
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reservation & Schedule Card */}
        <div className="bg-white border border-[#cec5bc] rounded-lg p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#1b1c1a] border-b border-[#efeeeb] pb-2 flex items-center gap-2">
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
        <div className="bg-white border border-[#cec5bc] rounded-lg p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#1b1c1a] border-b border-[#efeeeb] pb-2 flex items-center gap-2">
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
                      <CreditCard className="w-3.5 h-3.5 text-[#009ee3]" />
                    ) : (
                      <Banknote className="w-3.5 h-3.5 text-[#755a2a]" />
                    )}
                    {getMetodoPagoLabel(pago.metodoPago)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#7d766e]">Estado del pago:</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${badgePago?.classes}`}>
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

            <div className="flex justify-between font-serif font-bold text-base text-[#1b1c1a] pt-3 border-t border-[#efeeeb]">
              <span>Monto total:</span>
              <span>{formatearMoneda(reserva.total)}</span>
            </div>

            {pago?.metodoPago === 'EFECTIVO' && pago.estado === 'PENDIENTE' && (
              <div className="mt-3 p-3 bg-[#f5f3f0] border border-[#cec5bc] rounded text-[11px] text-[#4b463f]">
                <strong>Aviso de pago en efectivo:</strong> El pago se encuentra registrado como PENDIENTE. Un administrador de Volanta aprobará o rechazará la solicitud una vez efectivizado el importe.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation section */}
      <div className="bg-[#fbf9f6] border border-[#e4e2df] rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-[#1b1c1a]">
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
    </div>
  );
};
