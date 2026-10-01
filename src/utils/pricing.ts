import { Disponibilidad } from '../types';

/**
 * Calculates day difference between two YYYY-MM-DD date strings.
 * Minimum is 1 day.
 */
export function calcularDias(fechaInicio: string, fechaFin: string): number {
  if (!fechaInicio || !fechaFin) return 1;
  const inicio = new Date(`${fechaInicio}T00:00:00`);
  const fin = new Date(`${fechaFin}T00:00:00`);
  const diffMs = fin.getTime() - inicio.getTime();
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDias);
}

/**
 * Single function of truth for price calculations.
 * Discount is a percentage applied directly to the daily rate.
 */
export interface CalculoPrecio {
  dias: number;
  precioDiaBase: number;
  descuentoPorcentaje: number;
  precioDiaFinal: number;
  subtotalBruto: number;
  montoDescuento: number;
  total: number;
}

export function calcularPrecioDetalle(
  precioDia: number,
  descuentoPorcentaje: number = 0,
  fechaInicio: string,
  fechaFin: string
): CalculoPrecio {
  const dias = calcularDias(fechaInicio, fechaFin);
  const descPct = Math.min(50, Math.max(0, descuentoPorcentaje || 0));
  const precioDiaFinal = Math.round(precioDia * (1 - descPct / 100));
  const subtotalBruto = precioDia * dias;
  const montoDescuento = (precioDia - precioDiaFinal) * dias;
  const total = precioDiaFinal * dias;

  return {
    dias,
    precioDiaBase: precioDia,
    descuentoPorcentaje: descPct,
    precioDiaFinal,
    subtotalBruto,
    montoDescuento,
    total,
  };
}

/**
 * Validates if [fechaInicio, fechaFin] fits entirely inside AT LEAST ONE availability range.
 */
export function validarRangoEnDisponibilidad(
  fechaInicio: string,
  fechaFin: string,
  rangos: Disponibilidad[]
): boolean {
  if (!fechaInicio || !fechaFin || rangos.length === 0) return false;
  if (fechaFin <= fechaInicio) return false;

  return rangos.some((rango) => {
    return rango.fechaInicio <= fechaInicio && rango.fechaFin >= fechaFin;
  });
}

/**
 * Formats amount into ARS currency string e.g. "$ 75.000"
 */
export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(monto);
}

/**
 * Format date string from YYYY-MM-DD to readable format: "12 nov 2024" or "12/11/2024"
 */
export function formatearFecha(fechaStr: string): string {
  if (!fechaStr) return '';
  const [anio, mes, dia] = fechaStr.split('-');
  if (!anio || !mes || !dia) return fechaStr;
  return `${dia}/${mes}/${anio}`;
}

/**
 * Today's date in YYYY-MM-DD string format
 */
export function hoyString(): string {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Adds N days to YYYY-MM-DD
 */
export function sumarDias(fechaStr: string, dias: number): string {
  const fecha = new Date(`${fechaStr}T00:00:00`);
  fecha.setDate(fecha.getDate() + dias);
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
