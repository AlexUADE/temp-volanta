import { EstadoPublicacion, EstadoReserva, EstadoPago, MetodoPago } from '../types';

export function getEstadoPublicacionBadge(estado: EstadoPublicacion) {
  switch (estado) {
    case 'ACTIVA':
      return {
        label: 'Activa',
        classes: 'bg-[#f4efeb] text-[#755a2a] border border-[#e8e2d8]',
      };
    case 'PAUSADA':
      return {
        label: 'Pausada',
        classes: 'bg-[#f4efeb] text-[#7d766e] border border-[#e8e2d8]',
      };
    case 'DESACTIVADA':
      return {
        label: 'Desactivada',
        classes: 'bg-[#eae8e5] text-[#4b463f] border border-[#e8e2d8]',
      };
  }
}

export function getEstadoReservaBadge(estado: EstadoReserva) {
  switch (estado) {
    case 'PENDIENTE':
      return {
        label: 'Reserva pendiente',
        classes: 'bg-[#f4efeb] text-[#755a2a] border border-[#e8e2d8]',
      };
    case 'CONFIRMADA':
      return {
        label: 'Reserva confirmada',
        classes: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      };
    case 'RECHAZADA':
      return {
        label: 'Reserva rechazada',
        classes: 'bg-red-50 text-red-800 border border-red-200',
      };
    case 'CANCELADA':
      return {
        label: 'Reserva cancelada',
        classes: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
      };
    case 'FINALIZADA':
      return {
        label: 'Reserva finalizada',
        classes: 'bg-blue-50 text-blue-800 border border-blue-200',
      };
  }
}

export function getEstadoPagoBadge(estado: EstadoPago, metodo?: MetodoPago) {
  switch (estado) {
    case 'PENDIENTE':
      return {
        label: metodo === 'EFECTIVO' ? 'Pendiente en administración' : 'Pendiente de pago',
        classes: 'bg-[#f4efeb] text-[#7d766e] border border-[#e8e2d8]',
      };
    case 'APROBADO':
      return {
        label: 'Pago acreditado',
        classes: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      };
    case 'RECHAZADO':
      return {
        label: 'Pago no acreditado',
        classes: 'bg-red-50 text-red-800 border border-red-200',
      };
  }
}

export function getMetodoPagoLabel(metodo: MetodoPago) {
  switch (metodo) {
    case 'MERCADO_PAGO':
      return 'Mercado Pago';
    case 'EFECTIVO':
      return 'Efectivo';
  }
}
