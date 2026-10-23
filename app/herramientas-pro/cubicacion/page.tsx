// app/herramientas-pro/cubicacion/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuoteStore } from '@/lib/store/useQuoteStore';
import { formatCLP } from '@/lib/utils/format';
import { ArrowLeft, Calculator, Plus, Check, Layers, PaintBucket, Grid3X3, Hammer } from 'lucide-react';

export default function CubacionPage() {
  const router = useRouter();
  const { addItem } = useQuoteStore();

  const [activeTab, setActiveTab] = useState<'ceramica' | 'pintura' | 'radier'>('ceramica');
  const [mermaPct, setMermaPct] = useState<number>(10); // 10% estándar técnico
  const [insertedSuccess, setInsertedSuccess] = useState(false);

  // Estados Cerámica
  const [ceraMetros2, setCeraMetros2] = useState<number>(20);
  const [ceraCajaM2, setCeraCajaM2] = useState<number>(1.62); // Formato típico caja en Chile
  const [ceraPrecioCaja, setCeraPrecioCaja] = useState<number>(14990);

  // Estados Pintura
  const [pinturaM2, setPinturaM2] = useState<number>(45);
  const [pinturaManos, setPinturaManos] = useState<number>(2);
  const [pinturaPrecioGalon, setPinturaPrecioGalon] = useState<number>(18990);

  // Estados Radier
  const [radierLargo, setRadierLargo] = useState<number>(5);
  const [radierAncho, setRadierAncho] = useState<number>(3);
  const [radierEspesor, setRadierEspesor] = useState<number>(0.08); // 8cm típico
  const [precioSacoCemento, setPrecioSacoCemento] = useState<number>(4990);

  // CÁLCULOS
  // 1. Cerámica
  const totalM2CeramicaConMerma = ceraMetros2 * (1 + mermaPct / 100);
  const cajasNecesarias = Math.ceil(totalM2CeramicaConMerma / (ceraCajaM2 || 1));
  const sacosBekron = Math.ceil(totalM2CeramicaConMerma / 3.5); // 1 saco 25kg rinde aprox 3.5m2

  // 2. Pintura
  const m2TotalesPintura = pinturaM2 * pinturaManos * (1 + mermaPct / 100);
  const galonesNecesarios = Math.ceil(m2TotalesPintura / 35); // 1 galón rinde ~35m2 a 1 mano

  // 3. Radier
  const m3Radier = radierLargo * radierAncho * radierEspesor;
  const m3ConMerma = m3Radier * (1 + mermaPct / 100);
  const sacosCemento = Math.ceil(m3ConMerma * 6.5); // ~6.5 sacos de cemento por m3 de radier H20

  // Inyección a la cotización activa
  const handleVolcarCotizacion = () => {
    if (activeTab === 'ceramica') {
      addItem({
        description: `Piso cerámico/porcelanato (${ceraMetros2}m² + ${mermaPct}% merma) - ${cajasNecesarias} cajas`,
        quantity: cajasNecesarias,
        unitPrice: ceraPrecioCaja,
      });
      addItem({
        description: `Adhesivo cerámico tipo Bekron (25kg) para ${ceraMetros2}m²`,
        quantity: sacosBekron,
        unitPrice: 5990,
      });
    } else if (activeTab === 'pintura') {
      addItem({
        description: `Esmalte/Látex al agua (${pinturaM2}m² a ${pinturaManos} manos + ${mermaPct}% merma)`,
        quantity: galonesNecesarios,
        unitPrice: pinturaPrecioGalon,
      });
    } else if (activeTab === 'radier') {
      addItem({
        description: `Cemento Especial (25kg) para Radier ${m3ConMerma.toFixed(2)}m³`,
        quantity: sacosCemento,
        unitPrice: precioSacoCemento,
      });
      addItem({
        description: `Mano de obra confección radier espesor ${radierEspesor * 100}cm (${(radierLargo * radierAncho).toFixed(1)}m²)`,
        quantity: 1,
        unitPrice: Math.round(radierLargo * radierAncho * 12000),
      });
    }

    setInsertedSuccess(true);
    setTimeout(() => {
      setInsertedSuccess(false);
      router.push('/cotizar');
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-28 max-w-xl mx-auto select-none">
      <header className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-900 pt-2">
        <Link href="/herramientas-pro" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono">
          <ArrowLeft size={16} />
          <span>VOLVER A PRO</span>
        </Link>
        <span className="text-[10px] font-mono text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2 py-0.5 rounded">
          MOTOR DE CUBICACIÓN
        </span>
      </header>

      <div className="mb-5">
        <h1 className="text-2xl font-black tracking-tight text-white">Calculadora & Merma</h1>
        <p className="text-xs text-zinc-400 mt-1">Calcula material real con holgura técnica de corte y vuelca las partidas a la cotización.</p>
      </div>

      {/* Selector de Faena */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { id: 'ceramica', label: 'Cerámica', icon: Grid3X3 },
          { id: 'pintura', label: 'Pintura', icon: PaintBucket },
          { id: 'radier', label: 'Radier', icon: Hammer },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`h-12 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-[#00df82] text-black shadow-[0_0_15px_rgba(0,223,130,0.2)]'
                  : 'bg-zinc-950 border border-zinc-900 text-zinc-400'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control de Merma Técnica */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 mb-4 flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400">Merma Técnica de Desperdicio:</span>
        <div className="flex gap-1.5">
          {[5, 10, 15].map((pct) => (
            <button
              key={pct}
              onClick={() => setMermaPct(pct)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                mermaPct === pct ? 'bg-[#022116] border border-[#00df82] text-[#00df82]' : 'bg-black text-zinc-600'
              }`}
            >
              +{pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Formularios según pestaña */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 mb-5 space-y-3.5">
        {activeTab === 'ceramica' && (
          <>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Superficie a Revestir (m²)</label>
              <input
                type="number"
                value={ceraMetros2}
                onChange={(e) => setCeraMetros2(Number(e.target.value))}
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Rendimiento Caja (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={ceraCajaM2}
                  onChange={(e) => setCeraCajaM2(Number(e.target.value))}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Precio x Caja ($ CLP)</label>
                <input
                  type="number"
                  step="500"
                  value={ceraPrecioCaja}
                  onChange={(e) => setCeraPrecioCaja(Number(e.target.value))}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>
            </div>

            {/* Resultado Cubicación */}
            <div className="bg-black/60 border border-zinc-800 p-3.5 rounded-lg space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Total a comprar (+{mermaPct}% merma):</span>
                <span className="text-white font-bold">{totalM2CeramicaConMerma.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between text-[#00df82] font-bold">
                <span>Cajas necesarias:</span>
                <span>{cajasNecesarias} CAJAS</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Adhesivo Bekron (25kg):</span>
                <span className="text-white font-bold">{sacosBekron} SACOS</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'pintura' && (
          <>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Superficie de Muros / Cielo (m²)</label>
              <input
                type="number"
                value={pinturaM2}
                onChange={(e) => setPinturaM2(Number(e.target.value))}
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Número de Manos</label>
                <input
                  type="number"
                  value={pinturaManos}
                  onChange={(e) => setPinturaManos(Number(e.target.value))}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Precio Galón ($ CLP)</label>
                <input
                  type="number"
                  value={pinturaPrecioGalon}
                  onChange={(e) => setPinturaPrecioGalon(Number(e.target.value))}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>
            </div>

            <div className="bg-black/60 border border-zinc-800 p-3.5 rounded-lg space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Área efectiva (+{mermaPct}% merma):</span>
                <span className="text-white font-bold">{m2TotalesPintura.toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between text-[#00df82] font-bold">
                <span>Galones recomendados:</span>
                <span>{galonesNecesarios} GALONES</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'radier' && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Largo (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={radierLargo}
                  onChange={(e) => setRadierLargo(Number(e.target.value))}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg text-center text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Ancho (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={radierAncho}
                  onChange={(e) => setRadierAncho(Number(e.target.value))}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg text-center text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Espesor (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={radierEspesor}
                  onChange={(e) => setRadierEspesor(Number(e.target.value))}
                  className="w-full h-11 bg-black border border-zinc-800 rounded-lg text-center text-sm font-mono text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>
            </div>

            <div className="bg-black/60 border border-zinc-800 p-3.5 rounded-lg space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Volumen cúbico (+{mermaPct}%):</span>
                <span className="text-white font-bold">{m3ConMerma.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between text-[#00df82] font-bold">
                <span>Sacos de Cemento (25kg):</span>
                <span>{sacosCemento} SACOS</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botón de Inyección */}
      <button
        type="button"
        onClick={handleVolcarCotizacion}
        className="w-full h-13 bg-[#00df82] hover:bg-[#00c975] text-black font-extrabold rounded-xl flex items-center justify-center gap-2 text-xs font-mono shadow-[0_0_25px_rgba(0,223,130,0.25)] active:scale-[0.98] transition-all"
      >
        {insertedSuccess ? (
          <>
            <Check size={16} />
            <span>¡PARTIDAS INYECTADAS A LA COTIZACIÓN!</span>
          </>
        ) : (
          <>
            <Plus size={16} />
            <span>VOLCAR RESULTADO A COTIZACIÓN ACTIVA</span>
          </>
        )}
      </button>
    </main>
  );
}