// components/quote/QuoteItemRow.tsx
'use client';

import React from 'react';
import { QuoteItem } from '@/types/quote';
import { formatCLP } from '@/lib/utils/format';
import { Trash2 } from 'lucide-react';

interface QuoteItemRowProps {
  item: QuoteItem;
  index: number;
  onUpdate: (id: string, updates: Partial<Omit<QuoteItem, 'id' | 'subtotal'>>) => void;
  onRemove: (id: string) => void;
}

export default function QuoteItemRow({ item, index, onUpdate, onRemove }: QuoteItemRowProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm relative group focus-within:border-zinc-700">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded">
          Partida #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors touch-manipulation"
          aria-label="Eliminar partida"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Descripción */}
      <input
        type="text"
        placeholder="Descripción (ej: Instalación de diferencial Legrand 25A)"
        value={item.description}
        onChange={(e) => onUpdate(item.id, { description: e.target.value })}
        className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 mb-3"
      />

      {/* Cantidad, Unitario y Subtotal */}
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-4">
          <span className="text-[10px] text-zinc-400 block mb-0.5">Cant.</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={item.quantity || ''}
            onChange={(e) => onUpdate(item.id, { quantity: Number(e.target.value) })}
            className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-sm font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="col-span-4">
          <span className="text-[10px] text-zinc-400 block mb-0.5">Unitario ($)</span>
          <input
            type="number"
            inputMode="numeric"
            step="500"
            value={item.unitPrice || ''}
            onChange={(e) => onUpdate(item.id, { unitPrice: Number(e.target.value) })}
            className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl text-right px-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="col-span-4 text-right">
          <span className="text-[10px] text-zinc-400 block mb-0.5">Subtotal</span>
          <div className="h-11 flex items-center justify-end font-mono text-sm font-bold text-zinc-200">
            {formatCLP(item.subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
}