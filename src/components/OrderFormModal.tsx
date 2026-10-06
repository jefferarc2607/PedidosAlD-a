import React, { useState, useEffect } from 'react';
import { Order } from '../types/order.ts';
import { getTodayString, getTomorrowString, getDefaultDeliveryTime } from '../utils/dateUtils.ts';
import { parsePriceInput } from '../utils/formatters.ts';
import { X, Clock, Calendar, DollarSign, User, Phone, FileText } from 'lucide-react';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  initialOrder?: Order | null;
}

// Atajos de productos típicos para cargar rápido con 1 toque en el celular
const PRODUCT_SHORTCUTS = [
  '1 doc. Medialunas manteca',
  '2 doc. Medialunas',
  '1 Pan de campo casero',
  '1 doc. Empanadas carne',
  '1 doc. Sándwiches de miga',
  '1 Tarta de ricota',
  '1/2 kg Bizcochitos',
];

const QUICK_HOURS = ['08:00', '09:30', '11:00', '13:00', '17:00', '18:30', '20:00'];

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(getTodayString());
  const [deliveryTime, setDeliveryTime] = useState(getDefaultDeliveryTime());
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const today = getTodayString();
  const tomorrow = getTomorrowString();

  useEffect(() => {
    if (initialOrder) {
      setCustomerName(initialOrder.customerName || '');
      setCustomerPhone(initialOrder.customerPhone || '');
      setItems(initialOrder.items || '');
      setDeliveryDate(initialOrder.deliveryDate || today);
      setDeliveryTime(initialOrder.deliveryTime || '12:00');
      setTotalAmount(initialOrder.totalAmount ? String(initialOrder.totalAmount) : '');
      setNotes(initialOrder.notes || '');
    } else {
      // Formulario nuevo: valores por defecto
      setCustomerName('');
      setCustomerPhone('');
      setItems('');
      setDeliveryDate(today);
      setDeliveryTime(getDefaultDeliveryTime());
      setTotalAmount('');
      setNotes('');
    }
    setErrors({});
  }, [initialOrder, isOpen, today]);

  if (!isOpen) return null;

  const handleShortcutClick = (shortcut: string) => {
    if (!items.trim()) {
      setItems(shortcut);
    } else {
      setItems(`${items.trim()} + ${shortcut}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /**
     * ¡PUNTO CRÍTICO!
     * Validar siempre campos requeridos antes de guardar. Si el usuario deja la hora vacía,
     * la orden queda sin ordenamiento cronológico y se pierde entre los pedidos del día.
     */
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Ingresá el nombre del cliente';
    }
    if (!items.trim()) {
      newErrors.items = 'Ingresá el producto o detalle del pedido';
    }
    if (!deliveryTime.trim()) {
      newErrors.deliveryTime = 'Indicá la hora estimada de entrega';
    }
    if (!deliveryDate.trim()) {
      newErrors.deliveryDate = 'Indicá la fecha de entrega';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const parsedPrice = parsePriceInput(totalAmount);

    const orderToSave: Order = {
      id: initialOrder ? initialOrder.id : `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: items.trim(),
      deliveryDate,
      deliveryTime: deliveryTime.trim(),
      totalAmount: parsedPrice,
      notes: notes.trim(),
      status: initialOrder ? initialOrder.status : 'pendiente',
      createdAt: initialOrder ? initialOrder.createdAt : new Date().toISOString(),
    };

    onSave(orderToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabecera del modal */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-stone-900">
              {initialOrder ? 'Editar Pedido' : 'Capturar Nuevo Pedido'}
            </h2>
            <p className="text-xs text-stone-500">
              Registrá el cliente, productos y hora de entrega.
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-stone-200/60 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del formulario scrollable */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Campo 1: Cliente y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Cliente *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: Laura o Martín Vecino"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                  }`}
                  autoFocus={!initialOrder}
                />
              </div>
              {errors.customerName && (
                <span className="text-xs text-rose-600 mt-1 block">{errors.customerName}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Teléfono / WhatsApp (opcional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ej: 11 3456-7890"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Campo 2: Producto / Detalle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Producto o Detalle *
              </label>
              <span className="text-[11px] text-stone-500">Tocá un atajo si aplica:</span>
            </div>
            
            {/* Atajos rápidos para agilizar con el pulgar */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRODUCT_SHORTCUTS.map((sc) => (
                <button
                  type="button"
                  key={sc}
                  onClick={() => handleShortcutClick(sc)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200/80 transition-colors cursor-pointer"
                >
                  + {sc}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="Ej: 2 docenas de medialunas de manteca + 1 pan casero"
              className={`w-full p-3 rounded-xl border text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors.items ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
              }`}
            />
            {errors.items && (
              <span className="text-xs text-rose-600 mt-1 block">{errors.items}</span>
            )}
          </div>

          {/* Campo 3: Fecha y Hora de Entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Día de Entrega *
              </label>
              <div className="flex gap-1.5 mb-1.5">
                <button
                  type="button"
                  onClick={() => setDeliveryDate(today)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    deliveryDate === today
                      ? 'bg-amber-500 border-amber-500 text-stone-950'
                      : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryDate(tomorrow)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    deliveryDate === tomorrow
                      ? 'bg-amber-500 border-amber-500 text-stone-950'
                      : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Mañana
                </button>
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Hora de Entrega *
              </label>
              {/* Horas rápidas */}
              <div className="flex gap-1 overflow-x-auto pb-1 mb-1.5 no-scrollbar">
                {QUICK_HOURS.map((h) => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => setDeliveryTime(h)}
                    className={`px-2 py-1 text-xs rounded-lg font-mono border shrink-0 transition-colors cursor-pointer ${
                      deliveryTime === h
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.deliveryTime ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                  }`}
                />
              </div>
              {errors.deliveryTime && (
                <span className="text-xs text-rose-600 mt-1 block">{errors.deliveryTime}</span>
              )}
            </div>
          </div>

          {/* Campo 4: Total a cobrar y Notas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Total a Cobrar ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="number"
                  inputMode="numeric"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="50"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 tabular-nums"
                />
              </div>
              <span className="text-[11px] text-stone-600 mt-1 block">
                Total pactado para cobrar al cliente
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Notas / Aclaraciones
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: sin sal, paga con $10.000"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción inferiores */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {initialOrder ? 'Guardar Cambios' : 'Registrar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
