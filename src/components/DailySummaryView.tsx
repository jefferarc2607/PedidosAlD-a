import React, { useState } from 'react';
import { Order } from '../types/order.ts';
import { getTodayString, getTomorrowString, formatFriendlyDate } from '../utils/dateUtils.ts';
import { formatCurrency } from '../utils/formatters.ts';
import {
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Share2,
} from 'lucide-react';

interface DailySummaryViewProps {
  orders: Order[];
  onOpenProductionModal: (date: string) => void;
  onSelectTab: (tab: 'dia' | 'cerrados') => void;
}

export const DailySummaryView: React.FC<DailySummaryViewProps> = ({
  orders,
  onOpenProductionModal,
  onSelectTab,
}) => {
  const today = getTodayString();
  const tomorrow = getTomorrowString();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // Filtrar pedidos correspondientes a la fecha seleccionada
  const dayOrders = orders
    .filter((o) => o.deliveryDate === selectedDate)
    .sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));

  // Cálculos financieros y de cantidades
  const totalACobrar = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalYaCobrado = dayOrders
    .filter((o) => o.status === 'entregado')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPendienteCobro = dayOrders
    .filter((o) => o.status !== 'entregado')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingCount = dayOrders.filter((o) => o.status === 'pendiente').length;
  const readyCount = dayOrders.filter((o) => o.status === 'listo').length;
  const deliveredCount = dayOrders.filter((o) => o.status === 'entregado').length;

  return (
    <div className="space-y-4">
      {/* Selector de día: Hoy vs Mañana vs Fecha específica */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Resumen Financiero y de Pedidos
            </h2>
            <p className="text-xs text-stone-500">
              Total a cobrar y estado de entregas por fecha
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedDate(today)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedDate === today
                  ? 'bg-amber-500 border-amber-500 text-stone-950'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setSelectedDate(tomorrow)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedDate === tomorrow
                  ? 'bg-amber-500 border-amber-500 text-stone-950'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Mañana
            </button>
          </div>
        </div>

        {/* Selector de fecha alternativa */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 bg-stone-50/50"
          />
        </div>
      </div>

      {/* Tarjeta Principal: TOTAL A COBRAR */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-6 shadow-md border border-stone-800">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-amber-400">
            Total a cobrar · {formatFriendlyDate(selectedDate)}
          </span>
          <span className="text-xs text-stone-400 tabular-nums">
            {dayOrders.length} {dayOrders.length === 1 ? 'pedido' : 'pedidos'}
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums mt-1">
          {formatCurrency(totalACobrar)}
        </div>

        {/* Desglose: Por cobrar vs Ya cobrado */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-stone-800">
          <div>
            <div className="text-xs text-stone-400">Por cobrar (pendientes/listos):</div>
            <div className="text-base sm:text-lg font-bold text-amber-300 tabular-nums">
              {formatCurrency(totalPendienteCobro)}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Ya cobrado (entregados):</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 tabular-nums">
              {formatCurrency(totalYaCobrado)}
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Estado del Día */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-2xl p-3 border border-stone-200 text-center shadow-2xs">
          <div className="flex items-center justify-center mb-1 text-stone-500">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] font-medium text-stone-600 truncate">Pendientes</div>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-amber-200/80 bg-amber-50/30 text-center shadow-2xs">
          <div className="flex items-center justify-center mb-1 text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
            {readyCount}
          </div>
          <div className="text-[11px] font-medium text-amber-900 truncate">Listos</div>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-stone-200 text-center shadow-2xs">
          <div className="flex items-center justify-center mb-1 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
            {deliveredCount}
          </div>
          <div className="text-[11px] font-medium text-stone-600 truncate">Entregados</div>
        </div>
      </div>

      {/* Banner / Acción: Resumen de Producción para el Día Siguiente */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-5 text-stone-950 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-950/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-stone-950" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base leading-tight">
              Resumen de Producción para Hornear o Cocinar
            </h3>
            <p className="text-xs text-amber-950/80 mt-1 leading-relaxed">
              Generá y redactá con 1 toque el detalle consolidado de pedidos para el día siguiente y compartilo con la familia o equipo de cocina.
            </p>

            <div className="flex gap-2 mt-3.5 flex-wrap">
              <button
                onClick={() => onOpenProductionModal(tomorrow)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Redactar para Mañana</span>
              </button>

              <button
                onClick={() => onOpenProductionModal(selectedDate)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-stone-950 font-semibold text-xs sm:text-sm border border-stone-950/10 transition-colors cursor-pointer"
              >
                <span>Redactar para {selectedDate === today ? 'Hoy' : 'esta fecha'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista detallada de pedidos de la fecha seleccionada */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-stone-900">
            Cronograma del día ({dayOrders.length})
          </h3>
          <button
            onClick={() => onSelectTab('dia')}
            className="text-xs text-amber-800 hover:text-amber-950 font-semibold cursor-pointer"
          >
            Ver en lista completa →
          </button>
        </div>

        {dayOrders.length === 0 ? (
          <div className="text-center py-6 text-stone-500 text-xs">
            No hay pedidos programados para {formatFriendlyDate(selectedDate)}.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {dayOrders.map((o) => (
              <div key={o.id} className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-semibold text-stone-700 shrink-0">
                    {o.deliveryTime} hs
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <div className="truncate">
                    <span className="font-medium text-stone-900">{o.customerName}</span>
                    <span className="text-stone-500 ml-1.5 text-xs truncate hidden sm:inline">
                      ({o.items})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {formatCurrency(o.totalAmount)}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${
                      o.status === 'entregado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.status === 'listo'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
