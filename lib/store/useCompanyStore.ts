// lib/store/useCompanyStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CompanyProfile } from '@/types/company';

interface CompanyState {
  profile: CompanyProfile;
  updateProfile: (updates: Partial<CompanyProfile>) => void;
  updateBank: (bankUpdates: Partial<CompanyProfile['bank']>) => void;
}

const defaultProfile: CompanyProfile = {
  businessName: 'Smoke Studios SpA',
  rut: '77.890.123-4',
  phone: '+56 9 8765 4321',
  email: 'contacto@smokestudios.cl',
  city: 'Santiago, Chile',
  bank: {
    bankName: 'BancoEstado (CuentaRUT)',
    accountType: 'Cuenta Vista / RUT',
    accountNumber: '18.765.432-1',
    accountHolder: 'Ismael Bastías',
    accountRut: '18.765.432-1',
    accountEmail: 'pagos@smokestudios.cl',
  },
};

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      profile: defaultProfile,

      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),

      updateBank: (bankUpdates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            bank: { ...state.profile.bank, ...bankUpdates },
          },
        })),
    }),
    {
      name: 'cotizaexpress-company-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);