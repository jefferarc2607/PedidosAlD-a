import { Order } from '../types/order.ts';
import { getTodayString, getTomorrowString } from './dateUtils.ts';

/**
 * Módulo de persistencia local (LocalStorage).
 * 
 * ¡PUNTO CRÍTICO!
 * 1. `localStorage.getItem` puede devolver `null` o un JSON inválido si hubo un corte o edición manual.
 *    Siempre envolver en try/catch para evitar pantalla blanca de la muerte (app crash).
 * 2. Si no hay pedidos guardados, inicializamos con ejemplos reales de panadería/comida
 *    para que el usuario no empiece con la pantalla vacía y pueda probar inmediatamente
 *    los filtros, estados y redacción de mensajes.
 */

const STORAGE_KEY = 'pedidos_al_dia_orders_v1';

export function getInitialSeedOrders(): Order[] {
  const today = getTodayString();
  const tomorrow = getTomorrowString();

  return [
    {
      id: 'ord-1',
      customerName: 'Laura Fernández',
      customerPhone: '1134567890',
      items: '2 docenas de medialunas de manteca + 1 pan de campo casero',
      deliveryDate: today,
      deliveryTime: '09:30',
      totalAmount: 14500,
      notes: 'Calentitas si es posible. Paga por transferencia.',
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-2',
      customerName: 'Carlos Benítez (Taller)',
      customerPhone: '1187654321',
      items: '1 docena de empanadas de carne cortada a cuchillo + 1/2 de jamón y queso',
      deliveryDate: today,
      deliveryTime: '13:00',
      totalAmount: 18000,
      notes: 'Pasa a retirar por el local.',
      status: 'listo',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-3',
      customerName: 'Sra. Marta (Vecina)',
      customerPhone: '',
      items: '1 kg de bizcochitos de grasa + 2 flautas de pan crocante',
      deliveryDate: today,
      deliveryTime: '08:00',
      totalAmount: 6200,
      notes: 'Ya pagó en efectivo.',
      status: 'entregado',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-4',
      customerName: 'Marcos Ruiz (Cumpleaños)',
      customerPhone: '1122334455',
      items: '3 tartas de ricota grandes + 4 docenas de sándwiches de miga',
      deliveryDate: tomorrow,
      deliveryTime: '11:00',
      totalAmount: 42000,
      notes: 'Entrega a domicilio, timbre 4B.',
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function loadOrdersFromStorage(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedOrders();
      saveOrdersToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialSeedOrders();
  } catch (error) {
    console.warn('Error al leer de localStorage. Usando datos iniciales:', error);
    return getInitialSeedOrders();
  }
}

export function saveOrdersToStorage(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('No se pudo guardar en localStorage (posible storage lleno o modo privado):', error);
  }
}
