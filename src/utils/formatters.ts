import { EstadoPublicacion, EstadoReserva, EstadoPago, MetodoPago } from '../types';

export function getEstadoPublicacionBadge(estado: EstadoPublicacion) {
  switch (estado) {
    case 'ACTIVA':
      return {
        label: 'Activa',
        classes: 'bg-[#efeeeb] text-[#755a2a] border border-[#755a2a]/20',
      };
    case 'PAUSADA':
      return {
        label: 'Pausada',
        classes: 'bg-[#f5f3f0] text-[#7d766e] border border-[#cec5bc]',
      };
    case 'DESACTIVADA':
      return {
        label: 'Desactivada',
        classes: 'bg-[#e4e2df] text-[#4b463f] border border-[#cec5bc]',
      };
  }
}

export function getEstadoReservaBadge(estado: EstadoReserva) {
  switch (estado) {
    case 'PENDIENTE':
      return {
        label: 'Pendiente de pago',
        classes: 'bg-[#fdd79c]/40 text-[#785c2c] border border-[#755a2a]/30',
      };
    case 'CONFIRMADA':
      return {
        label: 'Confirmada',
        classes: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
      };
    case 'RECHAZADA':
      return {
        label: 'Rechazada',
        classes: 'bg-red-50 text-red-800 border border-red-300',
      };
    case 'CANCELADA':
      return {
        label: 'Cancelada',
        classes: 'bg-zinc-100 text-zinc-600 border border-zinc-300',
      };
    case 'FINALIZADA':
      return {
        label: 'Finalizada',
        classes: 'bg-blue-50 text-blue-800 border border-blue-300',
      };
  }
}

export function getEstadoPagoBadge(estado: EstadoPago) {
  switch (estado) {
    case 'PENDIENTE':
      return {
        label: 'Pago Pendiente',
        classes: 'bg-[#fdd79c]/40 text-[#785c2c] border border-[#755a2a]/30',
      };
    case 'APROBADO':
      return {
        label: 'Pago Aprobado',
        classes: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
      };
    case 'RECHAZADO':
      return {
        label: 'Pago Rechazado',
        classes: 'bg-red-50 text-red-800 border border-red-300',
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
