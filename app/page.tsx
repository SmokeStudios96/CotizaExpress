// app/page.tsx
import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, Settings2, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 p-6 flex flex-col justify-between max-w-lg mx-auto">
      {/* 1. Badge superior Smoke Studios */}
      <div className="pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[#00df82] text-[11px] font-mono tracking-wider mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00df82] animate-pulse" />
          SMOKE STUDIOS COMMERCIAL ENGINE
        </div>

        {/* 2. Título con tracking de Smoke Studios */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.03em] leading-[1.08] text-white mb-3">
          Cotiza<span className="text-[#00df82]">Express</span>
        </h1>

        <p className="text-zinc-400 text-sm leading-relaxed tracking-[-0.01em] font-normal">
          Infraestructura ágil de venta en terreno para contratistas independientes. Automatiza presupuestos formales en CLP y despacha acuerdos en segundos vía WhatsApp.
        </p>
      </div>

      {/* 3. Botones de Acción (Crear Cotización + Pro Tools + Pipeline + Configuración) */}
      <div className="my-6 space-y-2.5">
        {/* Botón Principal: Nueva Cotización */}
        <Link
          href="/cotizar"
          className="w-full h-16 bg-[#00df82] hover:bg-[#00c975] text-black font-extrabold rounded-2xl flex items-center justify-between px-6 text-base tracking-tight shadow-[0_0_30px_rgba(0,223,130,0.25)] active:scale-[0.98] transition-all"
        >
          <span className="flex items-center gap-3">
            <Zap size={20} className="fill-black text-black" />
            Iniciar Nueva Cotización
          </span>
          <ArrowRight size={20} />
        </Link>

        {/* Botón Destacado: Herramientas Pro & Legal (Rewarded Ads) */}
        <Link
          href="/herramientas-pro"
          className="w-full h-13 bg-gradient-to-r from-zinc-950 via-[#02130e] to-zinc-950 border border-[#00df82]/35 hover:border-[#00df82] text-white font-mono text-xs font-bold rounded-xl flex items-center justify-between px-5 transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(0,223,130,0.1)]"
        >
          <span className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-[#00df82]" />
            <span>HERRAMIENTAS PRO & LEGAL</span>
          </span>
          <span className="text-xs text-[#00df82] font-mono">DESBLOQUEAR →</span>
        </Link>

        {/* Botón Secundario: Pipeline / Historial */}
        <Link
          href="/historial"
          className="w-full h-13 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-300 font-bold font-mono rounded-xl flex items-center justify-between px-5 text-xs tracking-wider transition-all active:scale-[0.98]"
        >
          <span className="flex items-center gap-2.5">
            <BarChart3 size={17} className="text-[#00df82]" />
            <span>VER PIPELINE / HISTORIAL</span>
          </span>
          <span className="text-[#00df82]">→</span>
        </Link>

        {/* Botón Terciario: Configuración Bancaria y Emisor */}
        <Link
          href="/configuracion"
          className="w-full h-13 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-between px-5 transition-all active:scale-[0.98]"
        >
          <span className="flex items-center gap-2.5">
            <Settings2 size={17} className="text-zinc-500" />
            <span>DATOS BANCARIOS & EMISOR</span>
          </span>
          <span className="text-xs text-zinc-600">EDITAR →</span>
        </Link>
      </div>

      {/* 4. Módulos Numéricos de Arquitectura */}
      <div className="space-y-3 pb-6">
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex items-start gap-3.5">
          <span className="text-xs font-mono font-bold text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2 py-1 rounded-md">
            01
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">Operación Offline Tolerante</h2>
            <p className="text-xs text-zinc-500 leading-snug mt-0.5 tracking-[-0.01em]">
              Persistencia de estado en dispositivo para trabajar en subterráneos o zonas sin conectividad celular.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex items-start gap-3.5">
          <span className="text-xs font-mono font-bold text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2 py-1 rounded-md">
            02
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">Motor de Cálculo Local (CLP + IVA 19%)</h2>
            <p className="text-xs text-zinc-500 leading-snug mt-0.5 tracking-[-0.01em]">
              Cómputo instantáneo de partidas, desgloses netos e impuestos chilenos sin latencia de red.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex items-start gap-3.5">
          <span className="text-xs font-mono font-bold text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2 py-1 rounded-md">
            03
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">Sincronización a Supabase Pro</h2>
            <p className="text-xs text-zinc-500 leading-snug mt-0.5 tracking-[-0.01em]">
              Respaldo en base de datos centralizada con seguridad RLS para analítica y control comercial.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}