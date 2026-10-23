// lib/store/useCatalogStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CatalogItem } from '@/types/catalog';

interface CatalogState {
  items: CatalogItem[];
  addItem: (item: Omit<CatalogItem, 'id'>) => void;
  deleteItem: (id: string) => void;
}

const defaultChileanServices: CatalogItem[] = [
  // Gasfitería
  { id: 'cat-1', name: 'Instalación de grifería monomando (lavaplatos/baño)', category: 'gasfiteria', defaultPrice: 28000, unit: 'un' },
  { id: 'cat-2', name: 'Cambio de mecanismo fitting estanque WC', category: 'gasfiteria', defaultPrice: 32000, unit: 'un' },
  { id: 'cat-3', name: 'Destape de tubería / sifón con máquina', category: 'gasfiteria', defaultPrice: 45000, unit: 'gl' },
  { id: 'cat-4', name: 'Mantención preventiva calefont ionizado', category: 'gasfiteria', defaultPrice: 48000, unit: 'un' },
  { id: 'cat-5', name: 'Detección visual y reparación fuga de agua menor', category: 'gasfiteria', defaultPrice: 35000, unit: 'gl' },

  // Electricidad
  { id: 'cat-6', name: 'Instalación punto de iluminación o enchufe embutido', category: 'electricidad', defaultPrice: 35000, unit: 'un' },
  { id: 'cat-7', name: 'Cambio de disyuntor automático / diferencial tablero', category: 'electricidad', defaultPrice: 25000, unit: 'un' },
  { id: 'cat-8', name: 'Instalación de lámpara colgante / apliqué mural', category: 'electricidad', defaultPrice: 22000, unit: 'un' },
  { id: 'cat-9', name: 'Normalización circuito eléctrico con certificación', category: 'electricidad', defaultPrice: 85000, unit: 'gl' },

  // Climatización y Calefacción
  { id: 'cat-10', name: 'Instalación básica aire acondicionado Split', category: 'climatizacion', defaultPrice: 110000, unit: 'un' },
  { id: 'cat-11', name: 'Limpieza y sanitización filtros unidad Split', category: 'climatizacion', defaultPrice: 38000, unit: 'un' },

  // Mano de Obra y Faena General
  { id: 'cat-12', name: 'Visita técnica y presupuesto en terreno', category: 'mano_de_obra', defaultPrice: 15000, unit: 'gl' },
  { id: 'cat-13', name: 'Jornal maestro primera (Día 8 hrs)', category: 'mano_de_obra', defaultPrice: 50000, unit: 'dia' },
  { id: 'cat-14', name: 'Jornal ayudante / enfierrador (Día 8 hrs)', category: 'mano_de_obra', defaultPrice: 35000, unit: 'dia' },
];

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      items: defaultChileanServices,

      addItem: (newItem) =>
        set((state) => ({
          items: [{ ...newItem, id: crypto.randomUUID() }, ...state.items],
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'cotizaexpress-catalog-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);