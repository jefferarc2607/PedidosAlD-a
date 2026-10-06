import React from 'react';
import { Plus, UtensilsCrossed, Calendar } from 'lucide-react';
import { formatFriendlyDate, getTodayString } from '../utils/dateUtils.ts';

interface HeaderProps {
  onNewOrder: () => void;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onNewOrder, activeCount }) => {
  const todayStr = getTodayString();
  const dateFormatted = formatFriendlyDate(todayStr);

  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Zone: Título claro y conciso sin adornos superfluos */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              Pedidos al Día
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
              <span>{dateFormatted}</span>
              {activeCount > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-medium">{activeCount} activos</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Zona de Acción: Botón principal "+ Nuevo Pedido" accesible con el pulgar */}
        <button
          onClick={onNewOrder}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95 transition-all cursor-pointer"
          aria-label="Registrar nuevo pedido"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Nuevo Pedido</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>
    </header>
  );
};
