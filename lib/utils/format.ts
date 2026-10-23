// lib/utils/format.ts

/**
 * Formatea valores numéricos a Pesos Chilenos (CLP) sin decimales
 */
export const formatCLP = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));
};

/**
 * Limpia y normaliza el número al formato internacional chileno (+569XXXXXXXX)
 */
export const sanitizeChileanPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('569') && digits.length === 11) return digits;
  if (digits.startsWith('9') && digits.length === 9) return `56${digits}`;
  if (digits.length === 8) return `569${digits}`;
  return digits;
};

/**
 * Genera el enlace directo para WhatsApp con mensaje formal precargado
 */
export const generateWhatsAppLink = (
  phone: string, 
  clientName: string, 
  total: number, 
  quoteNumber: string
): string => {
  const cleanPhone = sanitizeChileanPhone(phone);
  const text = `Hola *${clientName}*, adjunto el detalle de su presupuesto formal *#${quoteNumber}* por un total de *${formatCLP(total)}*.\n\nQuedo atento a sus comentarios para coordinar la ejecución del trabajo.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};