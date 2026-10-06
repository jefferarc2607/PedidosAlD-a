import { Order } from '../types/order.ts';
import { formatCurrency } from './formatters.ts';
import { formatFriendlyDate } from './dateUtils.ts';

/**
 * Plantillas y redactores de mensajes.
 * 
 * ¡PUNTO CRÍTICO!
 * 1. Para enlaces de WhatsApp (`https://wa.me/...`), el número NO debe llevar '+', '-', ni espacios.
 *    Solo dígitos numéricos con el código de país/área.
 * 2. El texto del mensaje debe pasar por `encodeURIComponent` si se usa como URL query parameter,
 *    de lo contrario los saltos de línea y emojis romperán el enlace.
 */

export function buildCustomerConfirmationText(order: Order, businessName: string = 'Pedidos al Día'): string {
  const friendlyDate = formatFriendlyDate(order.deliveryDate);
  const formattedTotal = formatCurrency(order.totalAmount);

  let message = `¡Hola ${order.customerName}! 👋\n`;
  message += `Te confirmamos tu pedido de ${businessName}:\n\n`;
  message += `🍞 Pedido: ${order.items}\n`;
  message += `⏰ Entrega: ${friendlyDate} a las ${order.deliveryTime} hs\n`;
  message += `💰 Total a cobrar: ${formattedTotal}\n`;

  if (order.notes && order.notes.trim().length > 0) {
    message += `📝 Nota: ${order.notes.trim()}\n`;
  }

  message += `\n¡Cualquier duda nos escribís por acá! Muchas gracias. 😊`;
  return message;
}

export function cleanPhoneNumber(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d]/g, '');
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const clean = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  if (clean) {
    return `https://wa.me/${clean}?text=${encodedText}`;
  }
  // Si no hay número predefinido, abrir WhatsApp Web para elegir contacto
  return `https://wa.me/?text=${encodedText}`;
}

/**
 * Genera el resumen consolidado de producción (para hornear o cocinar el día siguiente o de hoy).
 */
export function buildProductionSummaryText(orders: Order[], targetDate: string): string {
  const friendlyDate = formatFriendlyDate(targetDate);
  
  // Filtramos pedidos de la fecha
  const dayOrders = orders
    .filter((o) => o.deliveryDate === targetDate)
    .sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));

  if (dayOrders.length === 0) {
    return `📋 RESUMEN DE PRODUCCIÓN (${friendlyDate})\n\nNo hay pedidos agendados para esta fecha.`;
  }

  const totalCobrar = dayOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  let text = `📋 RESUMEN DE PRODUCCIÓN - ${friendlyDate.toUpperCase()}\n`;
  text += `Cantidad total de pedidos: ${dayOrders.length}\n`;
  text += `Total a cobrar del día: ${formatCurrency(totalCobrar)}\n\n`;
  text += `--- DETALLE POR HORA DE ENTREGA ---\n`;

  dayOrders.forEach((o, idx) => {
    const estadoIcon = o.status === 'entregado' ? '✅' : o.status === 'listo' ? '📦' : '⏳';
    text += `${idx + 1}. [${o.deliveryTime} hs] ${estadoIcon} ${o.customerName}\n`;
    text += `   Detalle: ${o.items}\n`;
    text += `   Monto: ${formatCurrency(o.totalAmount)}${o.notes ? ` (Nota: ${o.notes})` : ''}\n\n`;
  });

  text += `Generado por Pedidos al Día para la cocina / cuadra de pan.`;
  return text;
}
