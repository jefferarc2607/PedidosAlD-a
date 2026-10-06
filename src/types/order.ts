/**
 * Tipos de datos para el sistema "Pedidos al Día".
 * 
 * ATENCIÓN / PUNTOS CRÍTICOS DONDE ALGUIEN SUELE EQUIVOCARSE:
 * 1. Formato de fechas: Usar siempre 'YYYY-MM-DD' en formato local (no UTC) para evitar que
 *    un pedido de las 21:00 hs cambie de día por el desfasaje horario al hacer `.toISOString()`.
 * 2. Formato de horas: 'HH:MM' en reloj de 24 horas (ej: "09:30", "18:00").
 * 3. Montos monetarios: Siempre guardar como `number` numérico limpio, nunca strings con signos "$".
 *    Al calcular totales o formatear, usar siempre la función helper dedicada para evitar desbordes con NaN.
 */

export type OrderStatus = 'pendiente' | 'listo' | 'entregado';

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;      // Opcional, pero clave para enviar WhatsApp con 1 tap
  items: string;              // Detalle de productos (ej: "2 docenas de medialunas de manteca + 1 pan de campo")
  deliveryDate: string;       // Formato 'YYYY-MM-DD'
  deliveryTime: string;       // Formato 'HH:MM' (ej: "18:30")
  totalAmount: number;        // Importe a cobrar en pesos
  notes?: string;             // Aclaraciones: "sin sal", "paga con $10.000", "toca timbre 2B"
  status: OrderStatus;
  createdAt: string;          // ISO String para orden cronológico si hace falta
}

export type ViewTab = 'dia' | 'cerrados' | 'resumen';
