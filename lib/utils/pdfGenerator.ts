// lib/utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCLP } from '@/lib/utils/format';
import { QuoteItem, ClientData } from '@/types/quote';
import { CompanyProfile } from '@/types/company';

export interface GeneratePdfProps {
  quoteNumber: string;
  client: ClientData;
  items: QuoteItem[];
  includeIva: boolean;
  netAmount: number;
  ivaAmount: number;
  totalAmount: number;
  terms: string;
  company?: CompanyProfile; // CORRECCIÓN: Soporte para datos del contratista
}

export function generateQuotePDF({
  quoteNumber,
  client,
  items,
  includeIva,
  netAmount,
  ivaAmount,
  totalAmount,
  terms,
  company,
}: GeneratePdfProps) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor = [0, 223, 130];
  const darkColor = [15, 15, 15];
  const grayColor = [100, 100, 100];

  const businessName = company?.businessName || 'SMOKE STUDIOS SPA';
  const companyRut = company?.rut ? `RUT: ${company.rut}` : 'RUT: 77.890.123-4';
  const companyPhone = company?.phone || '+56 9 8765 4321';
  const companyEmail = company?.email || 'contacto@smokestudios.cl';

  // 1. BARRA SUPERIOR
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(0, 223, 130);
  doc.rect(0, 26.5, pageWidth, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(businessName.toUpperCase(), 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 223, 130);
  doc.text(`${companyRut} • ${companyPhone} • ${companyEmail}`, 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`PRESUPUESTO #${quoteNumber}`, pageWidth - 14, 12, { align: 'right' });

  const fechaChile = new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
  }).format(new Date());

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(`Fecha: ${fechaChile}`, pageWidth - 14, 18, { align: 'right' });

  // 2. DATOS CLIENTE Y CONDICIONES
  let currentY = 36;
  const colWidth = (pageWidth - 32) / 2;

  doc.setFillColor(248, 249, 250);
  doc.roundedRect(14, currentY, colWidth, 26, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('CLIENTE / RECEPTOR', 18, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(client.name || 'Cliente Particular', 18, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Móvil: ${client.phone || 'No indicado'}`, 18, currentY + 17);
  doc.text(`Dirección: ${client.address || 'En faena'}`, 18, currentY + 22);

  const box2X = 14 + colWidth + 4;
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(box2X, currentY, colWidth, 26, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('DETALLES OPERACIONALES', box2X + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Moneda: Pesos Chilenos (CLP)', box2X + 4, currentY + 12);
  doc.text(includeIva ? 'Tributación: Afecto a IVA (19%)' : 'Tributación: Exento / Neto', box2X + 4, currentY + 17);
  doc.text('Validez Oferta: 7 días corridos', box2X + 4, currentY + 22);

  currentY += 32;

  // 3. TABLA DE PARTIDAS
  const tableData = items.map((item, idx) => [
    `#${String(idx + 1).padStart(2, '0')}`,
    item.description || 'Servicio estándar',
    item.quantity.toString(),
    formatCLP(item.unitPrice),
    formatCLP(item.subtotal),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['ÍTEM', 'DESCRIPCIÓN DE LA PARTIDA / FAENA', 'CANT.', 'UNITARIO', 'SUBTOTAL']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [15, 15, 15],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 30, 30],
      lineColor: [230, 230, 230],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 26, halign: 'right' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // 4. TOTALES
  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY + 6;

  if (finalY > 215) {
    doc.addPage();
    finalY = 20;
  }

  const totalsBoxWidth = 72;
  const totalsBoxX = pageWidth - 14 - totalsBoxWidth;

  doc.setFillColor(248, 249, 250);
  doc.rect(totalsBoxX, finalY, totalsBoxWidth, includeIva ? 26 : 16, 'F');

  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('Subtotal Neto:', totalsBoxX + 4, finalY + 5.5);
  doc.text(formatCLP(netAmount), pageWidth - 18, finalY + 5.5, { align: 'right' });

  if (includeIva) {
    doc.text('IVA (19%):', totalsBoxX + 4, finalY + 11);
    doc.text(formatCLP(ivaAmount), pageWidth - 18, finalY + 11, { align: 'right' });

    doc.setFillColor(15, 15, 15);
    doc.rect(totalsBoxX, finalY + 15, totalsBoxWidth, 11, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(0, 223, 130);
    doc.text('TOTAL A PAGAR:', totalsBoxX + 4, finalY + 22);
    doc.text(formatCLP(totalAmount), pageWidth - 18, finalY + 22, { align: 'right' });
  } else {
    doc.setFillColor(15, 15, 15);
    doc.rect(totalsBoxX, finalY + 8, totalsBoxWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(0, 223, 130);
    doc.text('TOTAL A PAGAR:', totalsBoxX + 4, finalY + 13.5);
    doc.text(formatCLP(totalAmount), pageWidth - 18, finalY + 13.5, { align: 'right' });
  }

  // 5. CAJA DE TRANSFERENCIA BANCARIA
  const bank = company?.bank;
  const bankBoxWidth = pageWidth - 14 - totalsBoxWidth - 6;

  doc.setFillColor(240, 253, 248);
  doc.roundedRect(14, finalY, bankBoxWidth, 26, 2, 2, 'F');
  doc.setDrawColor(0, 223, 130);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, finalY, bankBoxWidth, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 140, 80);
  doc.text('DATOS PARA TRANSFERENCIA BANCARIA (ANTICIPO 50% / SALDO)', 18, finalY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);
  doc.text(`Banco: ${bank?.bankName || 'BancoEstado (CuentaRUT)'}`, 18, finalY + 10.5);
  doc.text(`Tipo: ${bank?.accountType || 'Cuenta Vista / RUT'}  •  N°: ${bank?.accountNumber || '18.765.432-1'}`, 18, finalY + 15);
  doc.text(`Titular: ${bank?.accountHolder || 'Titular Cuenta'}  •  RUT: ${bank?.accountRut || 'RUT Titular'}`, 18, finalY + 19.5);
  doc.text(`Comprobante a: ${bank?.accountEmail || companyEmail}`, 18, finalY + 23.5);

  // 6. TÉRMINOS
  finalY += 32;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('CONDICIONES DE SERVICIO & GARANTÍA:', 14, finalY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const splitTerms = doc.splitTextToSize(
    terms || 'Se requiere el 50% de anticipo para reserva de faena y acopio de materiales. Saldo restante contra entrega conforme.',
    pageWidth - 28
  );
  doc.text(splitTerms, 14, finalY + 4);

  // 7. FIRMAS
  const sigY = finalY + 22;
  if (sigY < 275) {
    doc.setDrawColor(210, 210, 210);
    doc.line(14, sigY + 8, 70, sigY + 8);
    doc.line(pageWidth - 70, sigY + 8, pageWidth - 14, sigY + 8);

    doc.setFontSize(7);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Firma: ${businessName}`, 14, sigY + 12);
    doc.text('Firma / Aceptación Conforme Cliente', pageWidth - 70, sigY + 12);
  }

  // 8. FOOTER
  doc.setFontSize(6.5);
  doc.setTextColor(170, 170, 170);
  doc.text(
    `Documento oficial generado con CotizaExpress • ${businessName} • ${companyEmail}`,
    pageWidth / 2,
    290,
    { align: 'center' }
  );

  doc.save(`Presupuesto_${quoteNumber}.pdf`);
}