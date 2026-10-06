import React, { useState, useEffect } from 'react';
import { Order } from '../types/order.ts';
import { getTodayString, getTomorrowString, formatFriendlyDate } from '../utils/dateUtils.ts';
import { buildProductionSummaryText, getWhatsAppUrl } from '../utils/messageTemplates.ts';
import { X, Copy, Check, Send, Sparkles, Calendar } from 'lucide-react';

interface ProductionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  defaultDate?: string;
}

export const ProductionSummaryModal: React.FC<ProductionSummaryModalProps> = ({
  isOpen,
  onClose,
  orders,
  defaultDate,
}) => {
  const tomorrow = getTomorrowString();
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate || tomorrow);
  const [summaryText, setSummaryText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (defaultDate) {
      setSelectedDate(defaultDate);
    } else {
      setSelectedDate(tomorrow);
    }
  }, [defaultDate, isOpen, tomorrow]);

  useEffect(() => {
    setSummaryText(buildProductionSummaryText(orders, selectedDate));
    setCopied(false);
  }, [orders, selectedDate]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = summaryText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar texto:', err);
    }
  };

  const whatsappLink = getWhatsAppUrl('', summaryText);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prod-summary-title"
      >
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 id="prod-summary-title" className="text-base font-bold text-stone-900">
                Resumen de Producción
              </h2>
              <p className="text-xs text-stone-500">
                Plan para cuadra, horno o cocina
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-stone-200/60 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Selector de fecha para el resumen */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Fecha de Producción a Consultar:
            </label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setSelectedDate(tomorrow)}
                className={`flex-1 min-h-[44px] py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedDate === tomorrow
                    ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>Día Siguiente (Mañana)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate(today)}
                className={`flex-1 min-h-[44px] py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedDate === today
                    ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>Hoy</span>
              </button>
            </div>

            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Viendo: <strong className="text-stone-800">{formatFriendlyDate(selectedDate)}</strong>
            </p>
          </div>

          {/* Área de texto editable */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Resumen redactado listo para enviar al grupo:
              </label>
            </div>
            <textarea
              rows={8}
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono leading-relaxed"
            />
          </div>

          {/* Botones de acción directos */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopy}
              className={`w-full min-h-[48px] py-2.5 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-500'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡Copiado! Pegalo en el chat o anotador</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Resumen de Producción</span>
                </>
              )}
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border border-stone-200 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-emerald-700" />
              <span>Mandar al grupo de WhatsApp de la familia</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
