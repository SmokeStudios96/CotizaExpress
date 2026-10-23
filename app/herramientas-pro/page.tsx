// app/herramientas-pro/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProToolsStore } from '@/lib/store/useProToolsStore';
import RewardedAdModal from '@/components/pro/RewardedAdModal';
import { ProToolId, ProToolMeta } from '@/types/proTools';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Calculator, 
  FileText, 
  Receipt, 
  Sparkles, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

const PRO_TOOLS_CATALOG: ProToolMeta[] = [
  {
    id: 'contract',
    title: 'Contrato Legal de Faena y Prestación de Servicios',
    badge: '01. RESPALDO JURÍDICO',
    description: 'Documento formal redactado bajo el Código Civil chileno con cláusulas de anticipo (50%), hitos de pago, plazos y modificaciones de obra.',
    actionLabel: 'Generar Contrato Legal',
    adDurationSeconds: 15,
  },
  {
    id: 'cubicacion',
    title: 'Calculadora Avanzada de Cubicación y Merma',
    badge: '02. CÁLCULO TÉCNICO',
    description: 'Calcula metros cuadrados de cerámica, pintura o metros cúbicos de radier con merma técnica (5% - 10%) e inyéctalo en 1 clic.',
    actionLabel: 'Cubicar e Inyectar Materiales',
    adDurationSeconds: 15,
  },
  {
    id: 'reimbursement',
    title: 'Rendición de Gastos de Materiales a Terceros',
    badge: '03. REEMBOLSO TRANSPARENTE',
    description: 'Rinde tickets de ferretería o materiales comprados por encargo, sumando subtotales para adjuntar por WhatsApp y cobrar de inmediato.',
    actionLabel: 'Crear Rendición de Gastos',
    adDurationSeconds: 15,
  },
];

export default function HerramientasProPage() {
  const { isToolUnlocked } = useProToolsStore();
  const [selectedToolForAd, setSelectedToolForAd] = useState<ProToolMeta | null>(null);

  const getToolIcon = (id: ProToolId) => {
    switch (id) {
      case 'contract': 
        return <FileText size={20} className="text-[#00df82]" />;
      case 'cubicacion': 
        return <Calculator size={20} className="text-[#00df82]" />;
      case 'reimbursement': 
        return <Receipt size={20} className="text-[#00df82]" />;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-28 max-w-xl mx-auto select-none">
      {/* Header Smoke Studios */}
      <header className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-900 pt-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="font-mono">INICIO</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2.5 py-1 rounded-md">
            MÓDULOS PRO
          </span>
        </div>
      </header>

      {/* Título de Sección */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#022116] border border-[#00df82]/30 text-[#00df82] text-[10px] font-mono tracking-wider uppercase mb-2">
          <Sparkles size={12} />
          <span>REWARDED ACCESS ENGINE</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Herramientas Avanzadas de Cierre
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Desbloquea cada herramienta viendo un breve video publicitario de 15 segundos. Válido por la sesión actual o un máximo de 7 días.
        </p>
      </div>

      {/* Lista de las 3 Herramientas Pro */}
      <div className="space-y-4">
        {PRO_TOOLS_CATALOG.map((tool) => {
          const unlocked = isToolUnlocked(tool.id);

          return (
            <div
              key={tool.id}
              className={`rounded-2xl border transition-all p-5 relative overflow-hidden ${
                unlocked
                  ? 'bg-gradient-to-br from-[#042017] via-[#02130e] to-black border-[#0b3826] shadow-[0_0_20px_rgba(0,223,130,0.1)]'
                  : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              {/* Badge superior del módulo */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#00df82] uppercase">
                  {tool.badge}
                </span>

                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                    unlocked
                      ? 'bg-[#022116] text-[#00df82] border border-[#00df82]/40'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {unlocked ? (
                    <>
                      <Unlock size={11} />
                      <span>DESBLOQUEADO</span>
                    </>
                  ) : (
                    <>
                      <Lock size={11} />
                      <span>ANUNCIO 15s</span>
                    </>
                  )}
                </div>
              </div>

              {/* Título y descripción */}
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getToolIcon(tool.id)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Botón de Acción / Desbloqueo */}
              {unlocked ? (
                <Link
                  href={`/herramientas-pro/${tool.id}`}
                  className="w-full h-11 bg-[#00df82] hover:bg-[#00c975] text-black font-extrabold rounded-xl flex items-center justify-between px-4 text-xs font-mono shadow-[0_0_20px_rgba(0,223,130,0.2)] active:scale-[0.98] transition-all"
                >
                  <span>{tool.actionLabel.toUpperCase()}</span>
                  <ArrowRight size={15} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedToolForAd(tool)}
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-between px-4 text-xs font-mono transition-all group"
                >
                  <span className="flex items-center gap-2 text-zinc-300 group-hover:text-white">
                    <Sparkles size={14} className="text-[#00df82]" />
                    <span>VER VIDEO (15s) Y DESBLOQUEAR</span>
                  </span>
                  <span className="text-[#00df82]">GRATIS →</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Reutilizable de Anuncio Bonificado */}
      {selectedToolForAd && (
        <RewardedAdModal
          isOpen={true}
          toolId={selectedToolForAd.id}
          toolTitle={selectedToolForAd.title}
          onClose={() => setSelectedToolForAd(null)}
          onRewardGranted={() => {
            // El store se actualiza e inmediatamente habilita la entrada a la herramienta
          }}
        />
      )}
    </main>
  );
}