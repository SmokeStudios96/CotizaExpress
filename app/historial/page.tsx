// app/historial/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getQuotesFromSupabase, updateQuoteStatus } from '@/lib/supabase/quotes';
import { formatCLP, generateWhatsAppLink } from '@/lib/utils/format';
import { generateQuotePDF } from '@/lib/utils/pdfGenerator';
import { QuoteStatus } from '@/types/quote';
import { 
  ArrowLeft, 
  Send, 
  FileDown, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Layers,
  RefreshCw
} from 'lucide-react';

interface SupabaseQuoteRow {
  id: string;
  quote_number: string;
  client_name: string;
  client_phone: string;
  client_address: string;
  status: QuoteStatus;
  include_iva: boolean;
  net_amount: number;
  iva_amount: number;
  total_amount: number;
  terms: string;
  created_at: string;
  quote_items?: any[];
}

export default function HistorialPage() {
  const [quotes, setQuotes] = useState<SupabaseQuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | QuoteStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    const data = await getQuotesFromSupabase();
    setQuotes((data as SupabaseQuoteRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Cambiar estado en caliente (Optimistic update + Supabase sync)
  const handleStatusChange = async (quoteId: string, newStatus: QuoteStatus) => {
    setUpdatingId(quoteId);
    // Actualización visual inmediata
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );

    await updateQuoteStatus(quoteId, newStatus);
    setUpdatingId(null);
  };

  // Re-descargar PDF desde la tarjeta
  const handleDownloadItemPdf = (q: SupabaseQuoteRow) => {
    const formattedItems = (q.quote_items || []).map((it) => ({
      id: it.id,
      description: it.description,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unit_price),
      subtotal: Number(it.subtotal),
    }));

    generateQuotePDF({
      quoteNumber: q.quote_number,
      client: {
        name: q.client_name,
        phone: q.client_phone,
        address: q.client_address,
      },
      items: formattedItems.length > 0 ? formattedItems : [
        {
          id: '1',
          description: 'Servicio general según cotización',
          quantity: 1,
          unitPrice: q.net_amount,
          subtotal: q.net_amount,
        }
      ],
      includeIva: q.include_iva,
      netAmount: q.net_amount,
      ivaAmount: q.iva_amount,
      totalAmount: q.total_amount,
      terms: q.terms,
    });
  };

  // Métricas de Flujo Comercial en CLP
  const totalCotizado = quotes.reduce((acc, q) => acc + (q.total_amount || 0), 0);
  const totalCobrado = quotes
    .filter((q) => q.status === 'paid')
    .reduce((acc, q) => acc + (q.total_amount || 0), 0);
  const totalPorCobrar = quotes
    .filter((q) => q.status === 'pending' || q.status === 'accepted')
    .reduce((acc, q) => acc + (q.total_amount || 0), 0);

  // Filtrado
  const filteredQuotes = quotes.filter((q) => {
    if (activeFilter === 'all') return true;
    return q.status === activeFilter;
  });

  // Configuración de Badges por Estado
  const statusConfig: Record<QuoteStatus, { label: string; bg: string; text: string; border: string }> = {
    draft: { label: 'Borrador', bg: 'bg-zinc-900', text: 'text-zinc-400', border: 'border-zinc-800' },
    pending: { label: 'Pendiente', bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-500/30' },
    accepted: { label: 'Aceptada', bg: 'bg-[#022116]', text: 'text-[#00df82]', border: 'border-[#00df82]/40' },
    paid: { label: 'Cobrada', bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-400/50' },
    rejected: { label: 'Rechazada', bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-500/30' },
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-28 max-w-xl mx-auto select-none">
      {/* Header */}
      <header className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-900 pt-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="font-mono">INICIO</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchQuotes}
            className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            title="Refrescar datos"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/cotizar"
            className="h-8 px-3 rounded-lg bg-[#00df82] text-black text-xs font-bold font-mono flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <Plus size={14} />
            <span>NUEVA</span>
          </Link>
        </div>
      </header>

      {/* Título de Sección */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#022116] border border-[#00df82]/30 text-[#00df82] text-[10px] font-mono tracking-wider uppercase mb-2">
          <Layers size={12} />
          <span>PIPELINE COMERCIAL • SUPABASE PRO</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Control de Cotizaciones
        </h1>
      </div>

      {/* Tarjetas de Métricas de Flujo (CLP) */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3">
          <span className="text-[10px] font-mono text-zinc-500 block mb-1">TOTAL COTIZADO</span>
          <span className="text-sm font-bold font-mono text-white block">
            {formatCLP(totalCotizado)}
          </span>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3">
          <span className="text-[10px] font-mono text-amber-500 block mb-1">EN JUEGO</span>
          <span className="text-sm font-bold font-mono text-amber-400 block">
            {formatCLP(totalPorCobrar)}
          </span>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3">
          <span className="text-[10px] font-mono text-[#00df82] block mb-1">COBRADO</span>
          <span className="text-sm font-bold font-mono text-[#00df82] block">
            {formatCLP(totalCobrado)}
          </span>
        </div>
      </div>

      {/* Píldoras de Filtro por Estado */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {[
          { id: 'all', label: `Todas (${quotes.length})` },
          { id: 'pending', label: 'Pendientes' },
          { id: 'accepted', label: 'Aceptadas' },
          { id: 'paid', label: 'Cobradas' },
          { id: 'rejected', label: 'Rechazadas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-mono transition-all ${
              activeFilter === tab.id
                ? 'bg-[#00df82] text-black font-bold'
                : 'bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de Cotizaciones */}
      {loading ? (
        <div className="py-20 text-center text-zinc-600 text-xs font-mono">
          CARGANDO COTIZACIONES DESDE SUPABASE PRO...
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="py-20 text-center bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-500 text-xs font-mono mb-3">NO HAY COTIZACIONES EN ESTE ESTADO</p>
          <Link
            href="/cotizar"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#022116] border border-[#00df82]/30 text-[#00df82] rounded-lg text-xs font-mono"
          >
            <Plus size={14} />
            Crear Nueva Cotización
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((q) => {
            const badge = statusConfig[q.status] || statusConfig.draft;
            const fecha = new Date(q.created_at).toLocaleDateString('es-CL', {
              day: '2-digit',
              month: 'short',
            });

            return (
              <div
                key={q.id}
                className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 transition-all space-y-3"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-500 block mb-0.5">
                      {q.quote_number} • {fecha}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {q.client_name || 'Sin nombre'}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {q.client_phone} {q.client_address ? `• ${q.client_address}` : ''}
                    </p>
                  </div>

                  {/* Monto Total */}
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-[#00df82] block">
                      {formatCLP(q.total_amount)}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {q.include_iva ? 'IVA Incluido' : 'Valor Neto'}
                    </span>
                  </div>
                </div>

                {/* Selector Táctil de Estado (Dropdown Rápido) */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">ESTADO:</span>
                    <select
                      value={q.status}
                      disabled={updatingId === q.id}
                      onChange={(e) => handleStatusChange(q.id, e.target.value as QuoteStatus)}
                      className={`text-xs font-mono font-bold px-2 py-1 rounded-md border bg-black cursor-pointer focus:outline-none ${badge.border} ${badge.text}`}
                    >
                      <option value="pending" className="bg-black text-amber-400">Pendiente</option>
                      <option value="accepted" className="bg-black text-[#00df82]">Aceptada</option>
                      <option value="paid" className="bg-black text-emerald-300">Cobrada</option>
                      <option value="rejected" className="bg-black text-red-400">Rechazada</option>
                    </select>
                  </div>

                  {/* Acciones Rápidas (PDF + WhatsApp) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadItemPdf(q)}
                      className="h-8 px-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-300 text-xs font-mono flex items-center gap-1 active:scale-95"
                      title="Descargar PDF"
                    >
                      <FileDown size={14} className="text-[#00df82]" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const link = generateWhatsAppLink(
                          q.client_phone,
                          q.client_name,
                          q.total_amount,
                          q.quote_number
                        );
                        window.open(link, '_blank');
                      }}
                      className="h-8 px-2.5 bg-[#00df82] hover:bg-[#00c774] text-black font-bold text-xs font-mono rounded-lg flex items-center gap-1 active:scale-95"
                      title="Reenviar por WhatsApp"
                    >
                      <Send size={13} />
                      <span className="hidden sm:inline">WS</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}