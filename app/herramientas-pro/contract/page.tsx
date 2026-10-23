// app/herramientas-pro/contract/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuoteStore } from '@/lib/store/useQuoteStore';
import { useCompanyStore } from '@/lib/store/useCompanyStore';
import { formatCLP } from '@/lib/utils/format';
import { generateContractPDF } from '@/lib/utils/contractPdfGenerator';
import { ArrowLeft, FileText, Download, ShieldCheck, Calendar, Clock, DollarSign } from 'lucide-react';

export default function ContratoProPage() {
  const { client, items, getTotals } = useQuoteStore();
  const { profile } = useCompanyStore();
  const totals = getTotals();

  const [advancePercentage, setAdvancePercentage] = useState<number>(50);
  const [workDays, setWorkDays] = useState<number>(5);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const advanceAmount = Math.round((totals.totalAmount * advancePercentage) / 100);
  const balanceAmount = totals.totalAmount - advanceAmount;

  const handleDownloadContract = () => {
    if (items.length === 0) {
      alert('Debes tener partidas creadas en tu cotización para generar el contrato.');
      return;
    }
    generateContractPDF({
      quoteNumber: 'COT-LEGAL',
      client,
      items,
      totalAmount: totals.totalAmount,
      advancePercentage,
      workDays,
      startDate,
      company: profile,
    });
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-28 max-w-xl mx-auto select-none">
      <header className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-900 pt-2">
        <Link href="/herramientas-pro" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono">
          <ArrowLeft size={16} />
          <span>VOLVER A PRO</span>
        </Link>
        <span className="text-[10px] font-mono text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2 py-0.5 rounded">
          CÓDIGO CIVIL ART. 1996
        </span>
      </header>

      <div className="mb-5">
        <h1 className="text-2xl font-black tracking-tight text-white">Contrato Legal de Faena</h1>
        <p className="text-xs text-zinc-400 mt-1">Genera un contrato vinculante respaldado con las partidas y montos de tu cotización activa.</p>
      </div>

      <div className="space-y-4">
        {/* Resumen del Trabajo */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">CLIENTE</span>
            <span className="text-xs font-bold text-white">{client.name || 'Sin nombre'}</span>
          </div>
          <div className="flex justify-between items-center border-t border-zinc-900 pt-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">TOTAL DE FAENA</span>
            <span className="text-sm font-black font-mono text-[#00df82]">{formatCLP(totals.totalAmount)}</span>
          </div>
        </section>

        {/* Hitos de Pago */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3">
          <label className="block text-xs font-bold font-mono text-[#00df82] uppercase tracking-wider">Hito de Anticipo Requerido</label>
          <div className="grid grid-cols-2 gap-2">
            {[50, 30].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setAdvancePercentage(pct)}
                className={`h-11 rounded-lg font-mono text-xs font-bold transition-all ${
                  advancePercentage === pct
                    ? 'bg-[#00df82] text-black shadow-[0_0_15px_rgba(0,223,130,0.3)]'
                    : 'bg-black border border-zinc-800 text-zinc-400'
                }`}
              >
                {pct}% Anticipo ({formatCLP((totals.totalAmount * pct) / 100)})
              </button>
            ))}
          </div>

          <div className="bg-black/60 p-3 rounded-lg border border-zinc-800/80 text-xs font-mono space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Anticipo al firmar:</span>
              <span className="text-white font-bold">{formatCLP(advanceAmount)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Saldo contra entrega conforme:</span>
              <span className="text-[#00df82] font-bold">{formatCLP(balanceAmount)}</span>
            </div>
          </div>
        </section>

        {/* Plazos de Entrega */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3">
          <label className="block text-xs font-bold font-mono text-[#00df82] uppercase tracking-wider">Plazo y Fecha de Inicio</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 block mb-1">DÍAS HÁBILES DE FAENA</span>
              <input
                type="number"
                min="1"
                value={workDays}
                onChange={(e) => setWorkDays(Number(e.target.value))}
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 block mb-1">FECHA ESTIMADA DE INICIO</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-xs font-mono text-white focus:outline-none focus:border-[#00df82]"
              />
            </div>
          </div>
        </section>

        {/* Botón Descargar Contrato */}
        <button
          type="button"
          onClick={handleDownloadContract}
          className="w-full h-13 bg-[#00df82] hover:bg-[#00c975] text-black font-extrabold rounded-xl flex items-center justify-center gap-2 text-xs font-mono shadow-[0_0_25px_rgba(0,223,130,0.25)] active:scale-[0.98] transition-all"
        >
          <Download size={16} />
          <span>EXPORTAR CONTRATO LEGAL EN PDF</span>
        </button>
      </div>
    </main>
  );
}