export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount).replace('ARS', '').trim();
}

export function formatNumberAR(val: number): string {
  return new Intl.NumberFormat('es-AR').format(val);
}
