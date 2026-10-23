// components/quote/QuoteForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuoteStore } from '@/lib/store/useQuoteStore';
import { useCompanyStore } from '@/lib/store/useCompanyStore';
import { formatCLP, generateWhatsAppLink } from '@/lib/utils/format';
import { saveQuoteToSupabase } from '@/lib/supabase/quotes';
import { generateQuotePDF } from '@/lib/utils/pdfGenerator';
import CatalogSheet from '@/components/quote/CatalogSheet';
import { CatalogItem } from '@/types/catalog';
import { 
  Plus, 
  Trash2, 
  Send, 
  CloudUpload, 
  Check, 
  Loader2, 
  ArrowLeft, 
  BookOpen, 
  FileDown 
} from 'lucide-react';

export default function QuoteForm() {
  const {
    client,
    items,
    includeIva,
    terms,
    setClient,
    addItem,
    updateItem,
    removeItem,
    setIncludeIva,
    setTerms,
    getTotals,
  } = useQuoteStore();

  // Traer los datos bancarios y de empresa del contratista
  const { profile: companyProfile } = useCompanyStore();

  const [quoteNumber] = useState(() => `COT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const totals = getTotals();

  // Inyectar partida desde el catálogo rápido
  const handleSelectFromCatalog = (catalogItem: CatalogItem) => {
    addItem({
      description: catalogItem.name,
      quantity: 1,
      unitPrice: catalogItem.defaultPrice,
    });
  };

  // Guardar en Supabase Pro
  const handleSaveToCloud = async () => {
    if (!client.name.trim() || !client.phone.trim()) {
      alert('Por favor ingresa al menos el Nombre y Teléfono del cliente antes de guardar.');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    const result = await saveQuoteToSupabase({
      quoteNumber,
      client,
      items,
      includeIva,
      netAmount: totals.netAmount,
      ivaAmount: totals.ivaAmount,
      totalAmount: totals.totalAmount,
      terms,
      status: 'pending',
    });

    setIsSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } else {
      alert(`Problema de sincronización: ${result.error}`);
    }
  };

  // Generar y descargar PDF Formal en el celular/PC con datos bancarios
  const handleDownloadPDF = () => {
    if (items.length === 0) {
      alert('Debes incluir al menos una partida para generar el documento PDF.');
      return;
    }

    setIsGeneratingPdf(true);
    try {
      generateQuotePDF({
        quoteNumber,
        client,
        items,
        includeIva,
        netAmount: totals.netAmount,
        ivaAmount: totals.ivaAmount,
        totalAmount: totals.totalAmount,
        terms,
        company: companyProfile, // <-- Pasa los datos bancarios y del emisor
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Hubo un problema al generar el PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Enviar presupuesto por WhatsApp
  const handleSendWhatsApp = () => {
    if (!client.name || !client.phone) {
      alert('Por favor ingresa el nombre y teléfono del cliente.');
      return;
    }
    const link = generateWhatsAppLink(client.phone, client.name, totals.totalAmount, quoteNumber);
    window.open(link, '_blank');
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-48 px-4 pt-4 bg-black text-white select-none">
      {/* Header Smoke Studios */}
      <header className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-900">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="font-mono">VOLVER</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2.5 py-1 rounded-md">
            FOLIO {quoteNumber}
          </span>
        </div>
      </header>

      {/* SECCIÓN 1: Datos del Cliente */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 mb-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#00df82] uppercase">
            01. DATOS DEL CLIENTE
          </span>
          <span className="text-[10px] font-mono text-zinc-600">CHILE (CLP)</span>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Nombre o Empresa *</label>
          <input
            type="text"
            placeholder="Ej: Constructora San Martín / Roberto Muñoz"
            value={client.name}
            onChange={(e) => setClient({ name: e.target.value })}
            className="w-full h-12 bg-black border border-zinc-800 rounded-lg px-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00df82] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">WhatsApp Móvil *</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="+56 9 1234 5678"
              value={client.phone}
              onChange={(e) => setClient({ phone: e.target.value })}
              className="w-full h-12 bg-black border border-zinc-800 rounded-lg px-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00df82] transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Dirección / Comuna</label>
            <input
              type="text"
              placeholder="Ej: Providencia, Depto 402"
              value={client.address}
              onChange={(e) => setClient({ address: e.target.value })}
              className="w-full h-12 bg-black border border-zinc-800 rounded-lg px-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00df82] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: Partidas */}
      <section className="space-y-3 mb-5">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#00df82] uppercase">
            02. DETALLE DE PARTIDAS ({items.length})
          </span>
          <span className="text-[10px] font-mono text-zinc-600">NETO / EXENTO</span>
        </div>

        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 relative"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2 py-0.5 rounded">
                ITEM #{String(index + 1).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-zinc-600 hover:text-red-400 p-1.5 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Descripción del servicio o material"
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
              className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00df82] mb-3"
            />

            <div className="grid grid-cols-12 gap-2.5 items-center">
              <div className="col-span-4">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">CANT.</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={item.quantity || ''}
                  onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg text-center text-sm font-mono font-bold focus:outline-none focus:border-[#00df82]"
                />
              </div>

              <div className="col-span-4">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">UNITARIO ($)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  step="500"
                  value={item.unitPrice || ''}
                  onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg text-right px-2.5 text-sm font-mono font-bold focus:outline-none focus:border-[#00df82]"
                />
              </div>

              <div className="col-span-4 text-right">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">SUBTOTAL</span>
                <div className="h-11 flex items-center justify-end font-mono text-sm font-bold text-zinc-200">
                  {formatCLP(item.subtotal)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Botonera Dual: Desde Catálogo + Partida Manual */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="h-13 bg-[#022116] border border-[#00df82]/40 hover:border-[#00df82] rounded-xl font-mono text-xs flex items-center justify-center gap-2 text-[#00df82] transition-all active:scale-[0.98]"
          >
            <BookOpen size={16} />
            <span>+ DESDE CATÁLOGO</span>
          </button>

          <button
            type="button"
            onClick={() => addItem()}
            className="h-13 bg-black border border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl font-mono text-xs flex items-center justify-center gap-2 text-zinc-300 transition-all active:scale-[0.98]"
          >
            <Plus size={16} className="text-zinc-500" />
            <span>PARTIDA MANUAL</span>
          </button>
        </div>
      </section>

      {/* SECCIÓN 3: Condiciones Comerciales */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 mb-5">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#00df82] uppercase block mb-2">
          03. CONDICIONES COMERCIALES
        </span>
        <textarea
          rows={2}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 focus:outline-none focus:border-[#00df82]"
        />
      </section>

      {/* SECCIÓN 4: Totales Flotantes con Triada de Acciones (Nube + PDF + WhatsApp) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-900 p-4 z-40">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeIva}
                onChange={(e) => setIncludeIva(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-800 bg-black text-[#00df82] focus:ring-0 accent-[#00df82]"
              />
              <span>Incluir IVA (19%)</span>
            </label>

            <div className="text-right">
              {includeIva && (
                <span className="text-[11px] text-zinc-400 block font-mono">
                  Neto: {formatCLP(totals.netAmount)} + IVA: {formatCLP(totals.ivaAmount)}
                </span>
              )}
              <span className="text-2xl font-black text-[#00df82] font-mono">
                {formatCLP(totals.totalAmount)}
              </span>
            </div>
          </div>

          {/* Triada de Acciones en Terreno */}
          <div className="grid grid-cols-12 gap-2">
            {/* 1. Guardar en Supabase Pro */}
            <button
              type="button"
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className={`col-span-3 h-13 font-bold rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-mono border transition-all active:scale-[0.98] ${
                saveSuccess
                  ? 'bg-[#022116] border-[#00df82] text-[#00df82]'
                  : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
              title="Guardar en Supabase Pro"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin text-zinc-400" />
              ) : saveSuccess ? (
                <Check size={16} className="text-[#00df82]" />
              ) : (
                <CloudUpload size={16} className="text-zinc-400" />
              )}
              <span className="hidden sm:inline">{saveSuccess ? 'OK' : 'NUBE'}</span>
            </button>

            {/* 2. Descargar PDF Formal con Datos Bancarios */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="col-span-4 h-13 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 active:scale-[0.98] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-mono transition-all"
            >
              <FileDown size={16} className="text-[#00df82]" />
              <span>{isGeneratingPdf ? 'CREANDO...' : 'PDF FORMAL'}</span>
            </button>

            {/* 3. Enviar por WhatsApp */}
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="col-span-5 h-13 bg-[#00df82] hover:bg-[#00c774] text-black font-extrabold rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-mono shadow-[0_0_20px_rgba(0,223,130,0.25)] transition-all active:scale-[0.98]"
            >
              <Send size={15} />
              <span>WHATSAPP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Bottom-Sheet Integrado */}
      <CatalogSheet
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectItem={handleSelectFromCatalog}
      />
    </div>
  );
}