// app/configuracion/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCompanyStore } from '@/lib/store/useCompanyStore';
import { ArrowLeft, Building2, CreditCard, Check, Settings2, Save } from 'lucide-react';

const CHILEAN_BANKS = [
  'BancoEstado (CuentaRUT)',
  'Banco de Chile / Edwards',
  'Banco Santander Chile',
  'BCI (Banco de Crédito e Inversiones)',
  'Scotiabank Chile',
  'Itaú Chile',
  'Banco Falabella',
  'Banco Ripley',
  'Banco Security',
  'Banco Consorcio',
  'Tenpo Prepago',
  'MACH (Banco Bci)',
];

export default function ConfiguracionPage() {
  const { profile, updateProfile, updateBank } = useCompanyStore();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
          <span className="text-[11px] font-mono text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2.5 py-1 rounded-md">
            CONFIGURACIÓN
          </span>
        </div>
      </header>

      {/* Título de Sección */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#022116] border border-[#00df82]/30 text-[#00df82] text-[10px] font-mono tracking-wider uppercase mb-2">
          <Settings2 size={12} />
          <span>PERFIL DEL CONTRATISTA</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Datos de Emisión & Pago
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Esta información aparecerá automáticamente en el membrete y en los datos de transferencia del PDF.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* SECCIÓN 1: Identidad del Contratista */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-4.5 space-y-3.5">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#00df82]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#00df82] uppercase">
              01. IDENTIDAD COMERCIAL
            </span>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Razón Social o Nombre de Fantasía *</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => updateProfile({ businessName: e.target.value })}
              placeholder="Ej: Smoke Studios SpA / Juan Pérez Gasfitería"
              className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">RUT Empresa / Personal *</label>
              <input
                type="text"
                value={profile.rut}
                onChange={(e) => updateProfile({ rut: e.target.value })}
                placeholder="Ej: 77.123.456-7"
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82] font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Teléfono Móvil *</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => updateProfile({ phone: e.target.value })}
                placeholder="+56 9 8765 4321"
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82] font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Email Comercial</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile({ email: e.target.value })}
                placeholder="contacto@empresa.cl"
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82]"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Ciudad / Región</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => updateProfile({ city: e.target.value })}
                placeholder="Santiago, Chile"
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82]"
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: Datos Bancarios para Transferencias */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-4.5 space-y-3.5">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-[#00df82]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#00df82] uppercase">
              02. DATOS PARA TRANSFERENCIA BANCARIA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Banco Destino *</label>
              <select
                value={profile.bank.bankName}
                onChange={(e) => updateBank({ bankName: e.target.value })}
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#00df82]"
              >
                {CHILEAN_BANKS.map((b) => (
                  <option key={b} value={b} className="bg-black text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Tipo de Cuenta *</label>
              <select
                value={profile.bank.accountType}
                onChange={(e) => updateBank({ accountType: e.target.value as any })}
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3 text-xs text-white focus:outline-none focus:border-[#00df82]"
              >
                <option value="Cuenta Vista / RUT" className="bg-black text-white">Cuenta Vista / RUT</option>
                <option value="Cuenta Corriente" className="bg-black text-white">Cuenta Corriente</option>
                <option value="Cuenta de Ahorro" className="bg-black text-white">Cuenta de Ahorro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Número de Cuenta *</label>
            <input
              type="text"
              value={profile.bank.accountNumber}
              onChange={(e) => updateBank({ accountNumber: e.target.value })}
              placeholder="Ej: 18765432 o 0-000-123456"
              className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82] font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Titular de la Cuenta *</label>
              <input
                type="text"
                value={profile.bank.accountHolder}
                onChange={(e) => updateBank({ accountHolder: e.target.value })}
                placeholder="Nombre completo titular"
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82]"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">RUT del Titular *</label>
              <input
                type="text"
                value={profile.bank.accountRut}
                onChange={(e) => updateBank({ accountRut: e.target.value })}
                placeholder="Ej: 18.765.432-1"
                className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82] font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Email para Enviar Comprobante</label>
            <input
              type="email"
              value={profile.bank.accountEmail}
              onChange={(e) => updateBank({ accountEmail: e.target.value })}
              placeholder="pagos@empresa.cl"
              className="w-full h-11 bg-black border border-zinc-800 rounded-lg px-3.5 text-xs text-white focus:outline-none focus:border-[#00df82]"
            />
          </div>
        </section>

        {/* Botón Guardar */}
        <button
          type="submit"
          className="w-full h-13 bg-[#00df82] hover:bg-[#00c774] text-black font-extrabold rounded-xl flex items-center justify-center gap-2 text-xs font-mono shadow-[0_0_25px_rgba(0,223,130,0.25)] transition-all active:scale-[0.98]"
        >
          {savedSuccess ? (
            <>
              <Check size={16} />
              <span>¡DATOS ACTUALIZADOS CORRECTAMENTE!</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>GUARDAR CONFIGURACIÓN</span>
            </>
          )}
        </button>
      </form>
    </main>
  );
}