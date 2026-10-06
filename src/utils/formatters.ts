/**
 * Utilidades para formateo de moneda y números.
 * 
 * ¡PUNTO CRÍTICO!
 * La gente suele escribir montos con puntos de miles o comas decimales ("1.500", "1500,00", "$ 2500").
 * Si haces `Number(input)` directo sin limpiar, JavaScript retorna `NaN` o toma decimales incorrectos.
 * Esta función limpia caracteres no numéricos antes de guardar.
 */

export function parsePriceInput(val: string | number): number {
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : Math.max(0, val);
  }
  if (!val) return 0;
  // Elimina signos $ y espacios
  const clean = val.replace(/[\$\s]/g, '').trim();
  // Reemplaza coma por punto si se ingresaron centavos
  const normalized = clean.replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0';
  }
  // Formato legible con separador de miles
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0, // En panaderías y comida familiar suele usarse número redondo
  }).format(amount);
}
