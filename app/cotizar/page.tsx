// app/cotizar/page.tsx
import QuoteForm from '@/components/quote/QuoteForm';

export const metadata = {
  title: 'Nueva Cotización Express | CotizaExpress',
  description: 'Generador de presupuestos rápidos para terreno',
};

export default function CotizarPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center">
      <QuoteForm />
    </main>
  );
}