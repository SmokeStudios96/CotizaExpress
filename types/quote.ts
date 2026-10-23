// types/quote.ts

export type QuoteStatus = 'draft' | 'pending' | 'accepted' | 'rejected' | 'paid';

export interface ClientData {
  name: string;
  phone: string;       // Formato +56 9 XXXXXXXX
  address?: string;    // Dirección / Comuna
  notes?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;   // Valor en CLP
  subtotal: number;    // quantity * unitPrice
}

export interface Quote {
  id: string;
  quoteNumber: string; // Ej: COT-2026-001
  status: QuoteStatus;
  client: ClientData;
  items: QuoteItem[];
  includeIva: boolean; // Control de IVA 19%
  netAmount: number;   // Subtotal Neto
  ivaAmount: number;   // 19% si includeIva === true
  totalAmount: number; // Neto + IVA
  terms: string;
  createdAt: string;
  updatedAt: string;
  syncedWithSupabase?: boolean;
}