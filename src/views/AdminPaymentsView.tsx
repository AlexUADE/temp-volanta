import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Banknote,
  CheckCircle2,
  XCircle,
  CalendarDays,
  User,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Pago, Reserva } from '../types';
import { formatearMoneda, formatearFecha } from '../utils/pricing';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';

export const AdminPaymentsView: React.FC = () => {
  const {
    currentUser,
    getPagosEfectivoPendientes,
    aprobarPagoEfectivo,
    rechazarPagoEfectivo,
  } = useApp();
  const navigate = useNavigate();

  const [selectedAction, setSelectedAction] = useState<{
    action: 'aprobar' | 'rechazar';
    item: { pago: Pago; reserva: Reserva };
  } | null>(null);

  // Authorization check
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">Acceso Restringido</h2>
        <p className="text-sm text-[#4b463f]">
          Esta sección está reservada exclusivamente para usuarios con rol de administrador (ADMIN).
        </p>
        <Link to="/">
          <Button variant="outline" size="sm">
            Volver al inicio
          </Button>
        </Link>
      </div>
    );
  }

  const pendientes = getPagosEfectivoPendientes();

  const handleConfirmAction = () => {
    if (!selectedAction) return;
    if (selectedAction.action === 'aprobar') {
      aprobarPagoEfectivo(selectedAction.item.pago.idPago);
    } else {
      rechazarPagoEfectivo(selectedAction.item.pago.idPago);
    }
    setSelectedAction(null);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#e4e2df] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-widest text-[#755a2a] font-semibold">
            Área Administrativa Volanta
          </span>
          <span className="text-xs text-[#7d766e]">·</span>
          <span className="text-xs font-mono font-bold bg-[#fdd79c]/30 text-[#785c2c] px-2 py-0.5 rounded">
            Rol: ADMIN
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#15110d]">
          Gestión de Pagos en Efectivo
        </h1>
        <p className="text-sm text-[#4b463f] mt-1 max-w-2xl">
          Verifica las solicitudes de alquiler con método de pago en efectivo. Al aprobar, el pago se marcará como APROBADO y la reserva como CONFIRMADA.
        </p>
      </div>

      {pendientes.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-600" />}
          title="No hay pagos en efectivo pendientes"
          description="Todas las solicitudes en efectivo han sido procesadas o confirmadas por el equipo de administración."
        />
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-[#7d766e] uppercase tracking-wider">
            Pagos pendientes de aprobación ({pendientes.length}):
          </p>

          <div className="space-y-3">
            {pendientes.map(({ pago, reserva }) => {
              const pub = reserva.publicacion;
              const v = pub?.vehiculo;

              return (
                <div
                  key={pago.idPago}
                  className="bg-white border border-[#cec5bc] rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left: Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-[#efeeeb] text-[#1b1c1a] px-2 py-0.5 rounded">
                        Pago #{pago.idPago}
                      </span>
                      <span className="text-xs font-mono text-[#7d766e]">
                        (Reserva #{reserva.idReserva})
                      </span>
                      <span className="text-[11px] font-bold text-[#785c2c] bg-[#fdd79c]/30 px-2 py-0.5 rounded">
                        EFECTIVO PENDIENTE
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#15110d]">
                      {v?.marca} {v?.modelo} ({v?.anio}) · Patente {v?.patente}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#4b463f]">
                      <span className="flex items-center gap-1 font-medium text-[#1b1c1a]">
                        <CalendarDays className="w-3.5 h-3.5 text-[#755a2a]" />
                        Período: {formatearFecha(reserva.fechaInicio)} al {formatearFecha(reserva.fechaFin)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#7d766e]" />
                        Cliente: {reserva.usuario?.nombre} {reserva.usuario?.apellido}
                      </span>
                      <span className="flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5 text-[#755a2a]" />
                        Monto a cobrar: <strong>{formatearMoneda(pago.total)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      icon={<XCircle className="w-4 h-4" />}
                      onClick={() =>
                        setSelectedAction({
                          action: 'rechazar',
                          item: { pago, reserva },
                        })
                      }
                    >
                      Rechazar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() =>
                        setSelectedAction({
                          action: 'aprobar',
                          item: { pago, reserva },
                        })
                      }
                    >
                      Aprobar pago
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(selectedAction)}
        title={
          selectedAction?.action === 'aprobar'
            ? '¿Aprobar pago en efectivo?'
            : '¿Rechazar pago en efectivo?'
        }
        message={
          selectedAction?.action === 'aprobar'
            ? `Confirmarás la recepción de ${formatearMoneda(
                selectedAction.item.pago.total
              )} para la reserva #${selectedAction.item.reserva.idReserva}.\n\nEl pago pasará a estado APROBADO y la reserva quedará CONFIRMADA.`
            : `Rechazarás la solicitud de reserva #${selectedAction?.item.reserva.idReserva}.\n\nEl pago pasará a RECHAZADO y la reserva a RECHAZADA.`
        }
        confirmText={
          selectedAction?.action === 'aprobar' ? 'Sí, aprobar pago' : 'Sí, rechazar solicitud'
        }
        cancelText="Volver"
        isDestructive={selectedAction?.action === 'rechazar'}
        onConfirm={handleConfirmAction}
        onClose={() => setSelectedAction(null)}
      />
    </div>
  );
};
