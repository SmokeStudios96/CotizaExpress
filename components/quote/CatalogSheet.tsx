// components/quote/CatalogSheet.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useCatalogStore } from '@/lib/store/useCatalogStore';
import { formatCLP } from '@/lib/utils/format';
import { CatalogItem, CatalogCategory } from '@/types/catalog';
import { Search, X, Plus, Wrench, Zap, Wind, HardHat, Layers } from 'lucide-react';

interface CatalogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: CatalogItem) => void;
}

export default function CatalogSheet({ isOpen, onClose, onSelectItem }: CatalogSheetProps) {
  const { items } = useCatalogStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>('todos');

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'gasfiteria', label: 'Gasfitería', icon: Wrench },
    { id: 'electricidad', label: 'Electricidad', icon: Zap },
    { id: 'climatizacion', label: 'Climatización', icon: Wind },
    { id: 'mano_de_obra', label: 'Mano de Obra', icon: HardHat },
  ] as const;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-end sm:items-center">
      {/* Contenedor Bottom Sheet */}
      <div className="w-full max-w-xl bg-black border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250">
        
        {/* Manilla táctil superior (para sensación de App nativa) */}
        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Encabezado del Catálogo */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#022116] border border-[#00df82]/30 flex items-center justify-center text-[#00df82]">
              <Layers size={14} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Catálogo Rápido de Terreno</h3>
              <p className="text-[11px] text-zinc-500">Toca cualquier partida para sumarla</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Buscador de Alto Contraste */}
        <div className="p-4 pb-2 space-y-3 bg-zinc-950/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-zinc-500" size={17} />
            <input
              type="text"
              placeholder="Buscar servicio (ej: calefont, automático, jornal)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 bg-black border border-zinc-800 rounded-lg pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00df82] transition-colors"
            />
          </div>

          {/* Selector Horizontal de Categorías (Píldoras Smoke Studios) */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => {
              const Icon = 'icon' in cat ? cat.icon : null;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md whitespace-nowrap text-[11px] font-mono tracking-wider flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#00df82] text-black font-bold shadow-[0_0_15px_rgba(0,223,130,0.2)]'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de Partidas con valores en CLP */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 text-xs font-mono">
              NO SE ENCONTRARON SERVICIOS
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="w-full bg-zinc-950 border border-zinc-900 hover:border-[#00df82]/40 active:bg-[#022116]/30 p-3.5 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all touch-manipulation group"
              >
                <div className="pr-3">
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white leading-snug">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600">
                      Unidad: {item.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-[#00df82]">
                    {formatCLP(item.defaultPrice)}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#022116] border border-[#00df82]/30 flex items-center justify-center text-[#00df82] group-hover:bg-[#00df82] group-hover:text-black transition-colors">
                    <Plus size={15} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}