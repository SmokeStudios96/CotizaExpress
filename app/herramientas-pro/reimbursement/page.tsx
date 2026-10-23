// app/herramientas-pro/reimbursement/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCompanyStore } from '@/lib/store/useCompanyStore';
import { useQuoteStore } from '@/lib/store/useQuoteStore';
import { formatCLP, sanitizeChileanPhone } from '@/lib/utils/format';
import { ArrowLeft, Plus, Trash2, Send, Receipt, Store, CreditCard } from 'lucide-react';

interface ExpenseItem {
  id: string;
  store: string;      // Sodimac, Easy, Ferretería local
  ticketNumber: string;
  description: string;
  amount: number;
}

export default function RendicionGastosPage() {
  const { profile } = useCompanyStore();
  const { client } = useQuoteStore();

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: '1',
      store: 'Sodimac Constructor',
      ticketNumber: 'BOL-84920',
      description: 'Tubos PPR 20mm, terminales hilo y teflón',
      amount: 24990,
    },
  ]);

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: crypto.randomUUID(),
        store: 'Ferretería Barrio',
        ticketNumber: '',
        description: '',
        amount: 0,
      },
    ]);
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const totalGastos = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Enviar Rendición por WhatsApp
  const handleSendWhatsApp = () => {
    const cleanPhone = sanitizeChileanPhone(client.phone || '');
    if (!cleanPhone) {
      alert('Ingresa el teléfono del cliente en la cotización o configúralo.');
      return;
    }

    const itemsText = expenses
      .map(
        (e, i) =>
          `*${i + 1}. ${e.store}* (${e.ticketNumber ? '#' + e.ticketNumber : 'Ticket'})\n   ${e.description}: *${formatCLP(e.amount)}*`
      )
      .join('\n\n');

    const bank = profile.bank;
    const msg = `Estimado(a) *${client.name || 'Cliente'}*, adjunto la *Rendición Formal de Gastos en Materiales* comprados para su faena:\n\n${itemsText}\n\n*TOTAL A REEMBOLSAR: ${formatCLP(totalGastos)}*\n\n_Favor transferir el monto a la siguiente cuenta:_\n• *Banco:* ${bank.bankName}\n• *Tipo:* ${bank.accountType}\n• *N°:* ${bank.accountNumber}\n• *RUT:* ${bank.accountRut}\n• *Titular:* ${bank.accountHolder}\n\nQuedo a la espera de su comprobante. Muchas gracias.`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-28 max-w-xl mx-auto select-none">
      <header className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-900 pt-2">
        <Link href="/herramientas-pro" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono">
          <ArrowLeft size={16} />
          <span>VOLVER A PRO</span>
        </Link>
        <span className="text-[10px] font-mono text-[#00df82] bg-[#022116] border border-[#00df82]/30 px-2 py-0.5 rounded">
          REEMBOLSO TRANSPARENTE
        </span>
      </header>

      <div className="mb-5">
        <h1 className="text-2xl font-black tracking-tight text-white">Rendición de Materiales</h1>
        <p className="text-xs text-zinc-400 mt-1">Registra boletas y tickets para solicitar el reembolso transparente por WhatsApp.</p>
      </div>

      {/* Lista de Gastos */}
      <div className="space-y-3 mb-5">
        {expenses.map((item, idx) => (
          <div key={item.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#00df82] bg-[#022116] px-2 py-0.5 rounded">
                COMPRA #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeExpense(item.id)}
                className="text-zinc-600 hover:text-red-400 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Lugar (ej: Sodimac, Easy)"
                value={item.store}
                onChange={(e) => updateExpense(item.id, { store: e.target.value })}
                className="h-10 bg-black border border-zinc-800 rounded-lg px-2.5 text-xs text-white focus:outline-none focus:border-[#00df82]"
              />
              <input
                type="text"
                placeholder="N° Boleta / Ticket"
                value={item.ticketNumber}
                onChange={(e) => updateExpense(item.id, { ticketNumber: e.target.value })}
                className="h-10 bg-black border border-zinc-800 rounded-lg px-2.5 text-xs text-white focus:outline-none focus:border-[#00df82] font-mono"
              />
            </div>

            <input
              type="text"
              placeholder="Detalle de materiales comprados"
              value={item.description}
              onChange={(e) => updateExpense(item.id, { description: e.target.value })}
              className="w-full h-10 bg-black border border-zinc-800 rounded-lg px-2.5 text-xs text-white focus:outline-none focus:border-[#00df82]"
            />

            <div>
              <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">Monto Boleta ($ CLP)</span>
              <input
                type="number"
                step="100"
                value={item.amount || ''}
                onChange={(e) => updateExpense(item.id, { amount: Number(e.target.value) })}
                className="w-full h-10 bg-black border border-zinc-800 rounded-lg px-2.5 text-right font-mono font-bold text-sm text-[#00df82] focus:outline-none focus:border-[#00df82]"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExpense}
          className="w-full h-12 bg-black border border-dashed border-zinc-800 hover:border-[#00df82]/40 rounded-xl font-mono text-xs flex items-center justify-center gap-2 text-zinc-300"
        >
          <Plus size={15} className="text-[#00df82]" />
          <span>AÑADIR OTRA BOLETA / TICKET</span>
        </button>
      </div>

      {/* Resumen Total y Cobro */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-zinc-400">TOTAL A REEMBOLSAR:</span>
          <span className="text-xl font-black font-mono text-[#00df82]">{formatCLP(totalGastos)}</span>
        </div>

        <button
          type="button"
          onClick={handleSendWhatsApp}
          className="w-full h-13 bg-[#00df82] hover:bg-[#00c975] text-black font-extrabold rounded-xl flex items-center justify-center gap-2 text-xs font-mono shadow-[0_0_20px_rgba(0,223,130,0.25)] active:scale-[0.98] transition-all"
        >
          <Send size={16} />
          <span>ENVIAR RENDICIÓN POR WHATSAPP</span>
        </button>
      </div>
    </main>
  );
}