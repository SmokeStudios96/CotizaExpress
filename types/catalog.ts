// types/catalog.ts

export type CatalogCategory = 
  | 'todos'
  | 'gasfiteria' 
  | 'electricidad' 
  | 'climatizacion'
  | 'obras_menores' 
  | 'mano_de_obra';

export interface CatalogItem {
  id: string;
  name: string;
  category: Exclude<CatalogCategory, 'todos'>;
  defaultPrice: number; // Pesos Chilenos (CLP)
  unit: 'un' | 'gl' | 'mt' | 'hr' | 'dia';
}