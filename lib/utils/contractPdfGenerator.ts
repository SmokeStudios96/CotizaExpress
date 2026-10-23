// lib/utils/contractPdfGenerator.ts
import jsPDF from 'jspdf';
import { formatCLP } from '@/lib/utils/format';
import { QuoteItem, ClientData } from '@/types/quote';
import { CompanyProfile } from '@/types/company';

interface ContractPdfProps {
  quoteNumber: string;
  client: ClientData;
  items: QuoteItem[];
  totalAmount: number;
  advancePercentage: number; // 50 o 30
  workDays: number;
  startDate: string;
  company: CompanyProfile;
}

export function generateContractPDF({
  quoteNumber,
  client,
  items,
  totalAmount,
  advancePercentage,
  workDays,
  startDate,
  company,
}: ContractPdfProps) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const advanceAmount = Math.round((totalAmount * advancePercentage) / 100);
  const balanceAmount = totalAmount - advanceAmount;

  // Header Smoke Studios
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(0, 223, 130);
  doc.rect(0, 22.5, pageWidth, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('CONTRATO PRIVADO DE PRESTACIÓN DE SERVICIOS Y CONFECCIÓN DE OBRA', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 223, 130);
  doc.text(`RESPALDO LEGAL REF: PRESUPUESTO #${quoteNumber} • REPÚBLICA DE CHILE`, 14, 17);

  let y = 32;

  // Cláusula de Comparecencia
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  const introText = `En Santiago de Chile, a ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}, entre don/doña ${company.businessName.toUpperCase()}, RUT ${company.rut}, con domicilio en ${company.city}, en adelante "EL CONTRATISTA"; y por otra parte don/doña ${client.name.toUpperCase()}, con domicilio en ${client.address || 'el lugar de las obras'}, en adelante "EL CLIENTE", se ha convenido el siguiente contrato conforme a los Artículos 1996 y siguientes del Código Civil:`;
  const splitIntro = doc.splitTextToSize(introText, pageWidth - 28);
  doc.text(splitIntro, 14, y);
  y += splitIntro.length * 4 + 4;

  // Cláusula 1: Objeto
  doc.setFont('helvetica', 'bold');
  doc.text('PRIMERO: OBJETO Y ALCANCE DE LOS TRABAJOS', 14, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  const itemsText = items.map((it, idx) => `  ${idx + 1}. ${it.description} (Cant: ${it.quantity} - Subtotal: ${formatCLP(it.subtotal)})`).join('\n');
  const splitItems = doc.splitTextToSize(`EL CONTRATISTA se compromete a ejecutar de forma profesional y con materiales de primera calidad las siguientes faenas descritas en el presupuesto de referencia:\n${itemsText}`, pageWidth - 28);
  doc.text(splitItems, 14, y);
  y += splitItems.length * 4 + 4;

  // Cláusula 2: Precio y Anticipo
  doc.setFont('helvetica', 'bold');
  doc.text('SEGUNDO: PRECIO, FORMA DE PAGO Y ANTICIPO', 14, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  const pagoText = `El valor total acordado asciende a ${formatCLP(totalAmount)} CLP. La forma de pago se pacta en dos hitos inmutables:\n` +
    `a) Un anticipo del ${advancePercentage}% equivalente a ${formatCLP(advanceAmount)} CLP, pagadero a la firma del presente instrumento como condición para acopiar materiales e iniciar faenas.\n` +
    `b) El saldo restante del ${100 - advancePercentage}% equivalente a ${formatCLP(balanceAmount)} CLP, pagadero inmediatamente contra entrega y recepción conforme de los trabajos.`;
  const splitPago = doc.splitTextToSize(pagoText, pageWidth - 28);
  doc.text(splitPago, 14, y);
  y += splitPago.length * 4 + 4;

  // Cláusula 3: Modificaciones y Obras Extraordinarias (Clave en terreno)
  doc.setFont('helvetica', 'bold');
  doc.text('TERCERO: MODIFICACIONES DE OBRA Y TRABAJOS ADICIONALES', 14, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  const modText = `Cualquier modificación, aumento de partida o imprevisto técnico no contemplado en el presupuesto original requerirá autorización previa por escrito (incluyendo aceptación por WhatsApp) y se cotizará y cobrará de manera independiente, facultando a EL CONTRATISTA a reajustar los plazos de entrega.`;
  const splitMod = doc.splitTextToSize(modText, pageWidth - 28);
  doc.text(splitMod, 14, y);
  y += splitMod.length * 4 + 4;

  // Cláusula 4: Plazo
  doc.setFont('helvetica', 'bold');
  doc.text('CUARTO: PLAZOS DE EJECUCIÓN Y FUERZA MAYOR', 14, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  const plazoText = `Las faenas iniciarán formalmente el ${startDate || 'al recibirse el anticipo'} y tendrán un plazo estimado de ejecución de ${workDays} días hábiles, prorrogables por motivos climáticos, cortes de suministros ajenos a las partes o atraso imputable a EL CLIENTE.`;
  const splitPlazo = doc.splitTextToSize(plazoText, pageWidth - 28);
  doc.text(splitPlazo, 14, y);
  y += splitPlazo.length * 4 + 8;

  // Firmas
  if (y > 230) { doc.addPage(); y = 30; }
  doc.setDrawColor(180, 180, 180);
  doc.line(20, y + 25, 80, y + 25);
  doc.line(pageWidth - 80, y + 25, pageWidth - 20, y + 25);

  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text(company.businessName.toUpperCase(), 50, y + 29, { align: 'center' });
  doc.text(`RUT: ${company.rut} (CONTRATISTA)`, 50, y + 33, { align: 'center' });

  doc.text(client.name.toUpperCase(), pageWidth - 50, y + 29, { align: 'center' });
  doc.text(`Móvil: ${client.phone} (CLIENTE)`, pageWidth - 50, y + 33, { align: 'center' });

  doc.save(`Contrato_Faena_${quoteNumber}.pdf`);
}