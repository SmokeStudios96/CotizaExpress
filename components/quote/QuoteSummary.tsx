// components/quote/QuoteSummary.tsx
'use client';

import React from 'react';
import { formatCLP } from '@/lib/utils/format';
import { Send, FileText } from 'lucide-react';

interface QuoteSummaryProps {
  netAmount: number;
  ivaAmount: number;
  totalAmount: number;
  includeIva: boolean;
  onToggleIva: (include: boolean) => void;
  onSendWhatsApp: () => void;
  onGeneratePdf?: () => void;
}

export default function QuoteSummary({
  netAmount,
  ivaAmount,
  totalAmount,
  includeIva,
  onToggleIva,
  onSendWhatsApp,
  onGeneratePdf,
}: QuoteSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 p-4 z-40">
      <div className="max-w-xl mx-auto space-y-3">
        {/* Toggle IVA y Total */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={includeIva}
              onChange={(e) => onToggleIva(e.target.checked)}
              className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0"
            />
            <span className="text-zinc-300">Incluir IVA (19%)</span>
          </label>

          <div className="text-right">
            {includeIva && (
              <span className="text-[11px] text-zinc-400 block font-mono">
                Neto: {formatCLP(netAmount)} + IVA: {formatCLP(ivaAmount)}
              </span>
            )}
            <span className="text-xl font-black text-white font-mono">
              {formatCLP(totalAmount)}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onSendWhatsApp}
            className="h-13 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/30 transition-transform active:scale-[0.98]"
          >
            <Send size={18} />
            Enviar WhatsApp
          </button>

          <button
            type="button"
            onClick={onGeneratePdf}
            className="h-13 py-3.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-850 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm border border-zinc-700 transition-transform active:scale-[0.98]"
          >
            <FileText size={18} className="text-zinc-400" />
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}