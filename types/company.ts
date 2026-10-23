// types/company.ts

export interface BankDetails {
  bankName: string;
  accountType: 'Cuenta Vista / RUT' | 'Cuenta Corriente' | 'Cuenta de Ahorro';
  accountNumber: string;
  accountHolder: string;
  accountRut: string;
  accountEmail: string;
}

export interface CompanyProfile {
  businessName: string;   // Ej: "Electricidad & Climatización Silva SpA"
  rut: string;            // Ej: "76.452.123-K" o RUT personal
  phone: string;          // Ej: "+56 9 1234 5678"
  email: string;          // Ej: "contacto@smokestudios.cl"
  city: string;           // Ej: "Santiago, Chile"
  bank: BankDetails;
}