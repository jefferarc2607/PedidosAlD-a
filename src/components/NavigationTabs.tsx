import React from 'react';
import { ViewTab } from '../types/order.ts';
import { Clock, CheckCircle2, BarChart3 } from 'lucide-react';

interface NavigationTabsProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  pendingCount: number;
  closedCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onTabChange,
  pendingCount,
  closedCount,
}) => {
  return (
    <div className="bg-stone-100/90 border-b border-stone-200/80 sticky top-16 z-20 backdrop-blur-md px-4 py-2">
      <div className="max-w-3xl mx-auto flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
        {/* Tab 1: Pedidos del Día */}
        <button
          onClick={() => onTabChange('dia')}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
            currentTab === 'dia'
              ? 'bg-white text-stone-900 shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0 text-amber-600" />
          <span className="truncate">Pedidos del Día</span>
          {pendingCount > 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold tabular-nums ${
                currentTab === 'dia'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-300 text-stone-700'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        {/* Tab 2: Cerrados */}
        <button
          onClick={() => onTabChange('cerrados')}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
            currentTab === 'cerrados'
              ? 'bg-white text-stone-900 shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="truncate">Cerrados</span>
          {closedCount > 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold tabular-nums ${
                currentTab === 'cerrados'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-300 text-stone-700'
              }`}
            >
              {closedCount}
            </span>
          )}
        </button>

        {/* Tab 3: Resumen & Total */}
        <button
          onClick={() => onTabChange('resumen')}
          className={`flex-1 min-h-[44px] py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
            currentTab === 'resumen'
              ? 'bg-white text-stone-900 shadow-sm font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
          }`}
        >
          <BarChart3 className="w-4 h-4 shrink-0 text-amber-600" />
          <span className="truncate">Resumen del Día</span>
        </button>
      </div>
    </div>
  );
};
