// lib/store/useQuoteStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QuoteItem, ClientData, Quote } from '@/types/quote';

const IVA_RATE = 0.19;

interface QuoteDraftState {
  client: ClientData;
  items: QuoteItem[];
  includeIva: boolean;
  terms: string;
  
  // Acciones Cliente
  setClient: (client: Partial<ClientData>) => void;
  
  // Acciones Ítems
  addItem: (item?: Partial<QuoteItem>) => void;
  updateItem: (id: string, updates: Partial<Omit<QuoteItem, 'id' | 'subtotal'>>) => void;
  removeItem: (id: string) => void;
  
  // Acciones Cotización
  setIncludeIva: (include: boolean) => void;
  setTerms: (terms: string) => void;
  resetDraft: () => void;
  
  // Getters computados
  getTotals: () => { netAmount: number; ivaAmount: number; totalAmount: number };
}

const defaultClient: ClientData = {
  name: '',
  phone: '',
  address: '',
  notes: '',
};

export const useQuoteStore = create<QuoteDraftState>()(
  persist(
    (set, get) => ({
      client: { ...defaultClient },
      items: [
        {
          id: crypto.randomUUID(),
          description: 'Mano de obra general',
          quantity: 1,
          unitPrice: 35000,
          subtotal: 35000,
        },
      ],
      includeIva: false,
      terms: 'Validez de la cotización: 7 días. Requiere 50% de anticipo para iniciar faenas.',

      setClient: (clientUpdates) =>
        set((state) => ({ client: { ...state.client, ...clientUpdates } })),

      addItem: (customItem) =>
        set((state) => {
          const qty = customItem?.quantity ?? 1;
          const price = customItem?.unitPrice ?? 0;
          const newItem: QuoteItem = {
            id: crypto.randomUUID(),
            description: customItem?.description || '',
            quantity: qty,
            unitPrice: price,
            subtotal: qty * price,
          };
          return { items: [...state.items, newItem] };
        }),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;
            const quantity = updates.quantity ?? item.quantity;
            const unitPrice = updates.unitPrice ?? item.unitPrice;
            return {
              ...item,
              ...updates,
              quantity,
              unitPrice,
              subtotal: Math.max(0, quantity * unitPrice),
            };
          }),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      setIncludeIva: (includeIva) => set({ includeIva }),
      setTerms: (terms) => set({ terms }),

      resetDraft: () =>
        set({
          client: { ...defaultClient },
          items: [],
          includeIva: false,
        }),

      getTotals: () => {
        const { items, includeIva } = get();
        const netAmount = items.reduce((acc, curr) => acc + curr.subtotal, 0);
        const ivaAmount = includeIva ? Math.round(netAmount * IVA_RATE) : 0;
        const totalAmount = netAmount + ivaAmount;
        return { netAmount, ivaAmount, totalAmount };
      },
    }),
    {
      name: 'cotizaexpress-draft-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);