/**
 * Utilidades de fechas para el negocio familiar.
 * 
 * ¡OJO CON ESTE ERROR COMÚN!
 * NUNCA uses `new Date().toISOString().split('T')[0]` para obtener la fecha de hoy.
 * `toISOString()` devuelve la fecha en UTC (tiempo universal). En países de Latinoamérica
 * (como GMT-3 o GMT-5), pasadas las 20:00 o 21:00 hs la fecha UTC ya es MAÑANA.
 * Eso causaba que los pedidos cargados por la noche aparecieran guardados para el día siguiente.
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha 'YYYY-MM-DD' a una etiqueta humana amigable:
 * Ej: "Hoy, Martes 6 de Octubre", "Mañana, Miércoles 7", etc.
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const today = getTodayString();
  const tomorrow = getTomorrowString();

  const [year, month, day] = dateStr.split('-').map(Number);
  // Creamos la fecha local explícitamente pasando los componentes numéricos
  // OJO: month es base 0 en el constructor de Date
  const dateObj = new Date(year, month - 1, day);

  const dayOfWeek = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
  const dayOfWeekCap = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const monthName = dateObj.toLocaleDateString('es-ES', { month: 'short' });

  if (dateStr === today) {
    return `Hoy (${dayOfWeekCap} ${day})`;
  } else if (dateStr === tomorrow) {
    return `Mañana (${dayOfWeekCap} ${day})`;
  } else {
    return `${dayOfWeekCap} ${day} ${monthName}`;
  }
}

/**
 * Retorna la hora actual aproximada para precargar en el formulario
 * redondada a los próximos 30 minutos (ej: si son 10:14 -> 11:00)
 */
export function getDefaultDeliveryTime(): string {
  const now = new Date();
  let hours = now.getHours() + 1; // 1 hora más adelante por defecto
  if (hours >= 24) hours = 20; // fallback si es medianoche
  return `${String(hours).padStart(2, '0')}:00`;
}
