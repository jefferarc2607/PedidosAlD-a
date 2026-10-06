import React from 'react';
import { Order, OrderStatus } from '../types/order.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { formatFriendlyDate } from '../utils/dateUtils.ts';
import {
  Clock,
  CheckCircle,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Phone,
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (id: string, newStatus: OrderStatus) => void;
  onOpenMessageModal: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusChange,
  onOpenMessageModal,
  onEdit,
  onDelete,
}) => {
  const isDelivered = order.status === 'entregado';
  const isReady = order.status === 'listo';
  const isPending = order.status === 'pendiente';

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isDelivered
          ? 'bg-stone-50/70 border-stone-200 opacity-80'
          : isReady
          ? 'bg-amber-50/60 border-amber-200/80 shadow-xs'
          : 'bg-white border-stone-200/90 shadow-sm'
      } p-4 sm:p-5 flex flex-col gap-3.5`}
    >
      {/* Encabezado de la tarjeta: Cliente y Hora de Entrega */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-stone-900 text-base sm:text-lg truncate">
              {order.customerName}
            </h3>
            {order.customerPhone && (
              <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-stone-400" />
                {order.customerPhone}
              </span>
            )}
          </div>

          {/* Metadatos sin estilo de píldora saturada, texto limpio con separadores */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-stone-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {order.deliveryTime} hs
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{formatFriendlyDate(order.deliveryDate)}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span
              className={`font-medium ${
                isDelivered
                  ? 'text-emerald-700'
                  : isReady
                  ? 'text-amber-800'
                  : 'text-stone-600'
              }`}
            >
              {isDelivered
                ? 'Entregado'
                : isReady
                ? 'Listo para retirar'
                : 'Pendiente de cocción/armado'}
            </span>
          </div>
        </div>

        {/* Monto a cobrar destacado */}
        <div className="text-right shrink-0">
          <div className="text-xs uppercase tracking-wider text-stone-600 font-medium">
            {isDelivered ? 'Cobrado' : 'A cobrar'}
          </div>
          <div className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums">
            {formatCurrency(order.totalAmount)}
          </div>
        </div>
      </div>

      {/* Detalle de productos / pedido */}
      <div className="rounded-xl bg-stone-100/70 p-3 text-stone-800 text-sm leading-relaxed border border-stone-200/50">
        <div className="font-medium text-stone-900 flex items-center gap-1.5 mb-1 text-xs text-stone-500 uppercase tracking-wider">
          <span>Detalle del pedido:</span>
        </div>
        <p className="whitespace-pre-line font-medium text-stone-800">{order.items}</p>
        
        {order.notes && order.notes.trim().length > 0 && (
          <div className="mt-2 pt-2 border-t border-stone-200/60 text-xs text-amber-900/90 italic flex items-center gap-1.5">
            <span className="font-semibold not-italic">Nota:</span>
            <span>{order.notes}</span>
          </div>
        )}
      </div>

      {/* Botones de acción táctiles (hitbox >= 44px) */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 flex-wrap sm:flex-nowrap">
        {/* Acciones de gestión y mensaje */}
        <div className="flex items-center gap-1.5">
          {/* Botón para redactar mensaje de confirmación */}
          <button
            onClick={() => onOpenMessageModal(order)}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 border border-amber-200/80 transition-colors cursor-pointer"
            title="Redactar mensaje de confirmación al cliente"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
            <span>Mensaje</span>
          </button>

          {/* Botón editar */}
          <button
            onClick={() => onEdit(order)}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 text-xs transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Editar pedido"
            title="Editar pedido"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Botón borrar */}
          <button
            onClick={() => onDelete(order.id)}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-700 text-xs transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Eliminar pedido"
            title="Eliminar pedido"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Botones de cambio de estado de 1 toque */}
        <div className="flex items-center gap-1.5 ml-auto">
          {isPending && (
            <button
              onClick={() => onStatusChange(order.id, 'listo')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Marcar Listo</span>
            </button>
          )}

          {isReady && (
            <button
              onClick={() => onStatusChange(order.id, 'entregado')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Marcar Entregado</span>
            </button>
          )}

          {isDelivered && (
            <button
              onClick={() => onStatusChange(order.id, 'listo')}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Volver a abrir este pedido si fue marcado por error"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reabrir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
