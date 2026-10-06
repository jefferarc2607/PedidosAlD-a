import React, { useState, useEffect } from 'react';
import { Order } from '../types/order.ts';
import {
  buildCustomerConfirmationText,
  getWhatsAppUrl,
  cleanPhoneNumber,
} from '../utils/messageTemplates.ts';
import { X, Copy, Check, Send, Phone, MessageSquare } from 'lucide-react';

interface ConfirmationMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ConfirmationMessageModal: React.FC<ConfirmationMessageModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [messageText, setMessageText] = useState('');
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (order) {
      setMessageText(buildCustomerConfirmationText(order));
      setPhone(order.customerPhone || '');
      setCopied(false);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(messageText);
      } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = messageText;
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

  const whatsappLink = getWhatsAppUrl(phone, messageText);
  const hasPhone = cleanPhoneNumber(phone).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="msg-modal-title"
      >
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 id="msg-modal-title" className="text-base font-bold text-stone-900">
                Mensaje de Confirmación
              </h2>
              <p className="text-xs text-stone-500">Para {order.customerName}</p>
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
        <div className="p-5 overflow-y-auto space-y-3.5">
          {/* Teléfono opcional si no lo tenía */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Teléfono / WhatsApp de {order.customerName}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 11 3456-7890 (código de área + número)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Área de texto editable */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Texto a enviar (podés editarlo antes de enviar):
              </label>
            </div>
            <textarea
              rows={7}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans leading-relaxed"
            />
          </div>

          {/* Botones de acción directos */}
          <div className="space-y-2 pt-1">
            {/* Botón WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>
                {hasPhone ? 'Enviar por WhatsApp' : 'Abrir en WhatsApp (elegir contacto)'}
              </span>
            </a>

            {/* Botón Copiar al portapapeles */}
            <button
              onClick={handleCopy}
              className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>¡Mensaje copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar texto para pegar en otro chat</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
