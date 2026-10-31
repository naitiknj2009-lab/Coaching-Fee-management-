import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Client, PracticeProfile } from '../types';

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCompactCurrency(amount: number, symbol: string = '$'): string {
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }
  return `${symbol}${amount.toLocaleString()}`;
}

export function exportLedgerPDF(
  invoices: Invoice[],
  profile: PracticeProfile,
  period: string = 'Q4 2024'
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Luxury Header Banner
  doc.setFillColor(12, 26, 48); // Midnight Navy #0c1a30
  doc.rect(0, 0, 210, 36, 'F');

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('LEDGERCOACH', 14, 18);

  doc.setFontSize(9);
  doc.setTextColor(147, 197, 253); // Light Blue
  doc.text('EXECUTIVE RETAINER & REVENUE LEDGER', 14, 25);

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Coach: ${profile.coachName}  |  ${profile.partnerStatus}`, 196, 18, { align: 'right' });
  doc.text(`Fiscal Period: ${period}  |  Generated: ${new Date().toLocaleDateString()}`, 196, 25, { align: 'right' });

  // Summary Metrics Bar
  const totalVolume = invoices.reduce((s, inv) => s + inv.amount, 0);
  const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((s, inv) => s + inv.amount, 0);
  const totalDue = invoices.filter(i => i.status !== 'PAID').reduce((s, inv) => s + inv.amount, 0);
  const paidPct = totalVolume > 0 ? Math.round((totalCollected / totalVolume) * 100) : 0;

  doc.setFillColor(248, 250, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 42, 182, 20, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('RECOGNIZED VOLUME', 20, 49);
  doc.text('COLLECTED CASH', 80, 49);
  doc.text('OUTSTANDING DUE', 130, 49);
  doc.text('COLLECTION EFFICIENCY', 170, 49);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(totalVolume, profile.currencySymbol), 20, 56);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(formatCurrency(totalCollected, profile.currencySymbol), 80, 56);
  doc.setTextColor(239, 68, 68); // Red
  doc.text(formatCurrency(totalDue, profile.currencySymbol), 130, 56);
  doc.setTextColor(30, 58, 138); // Brand
  doc.text(`${paidPct}% Paid`, 170, 56);

  // Table
  const head = [['Invoice #', 'Client / Leader', 'Organization', 'Package', 'Due Date', 'Status', 'Amount']];
  const body = invoices.map(i => [
    i.id,
    i.clientName,
    i.company,
    i.packageName,
    i.dueDate,
    i.status,
    formatCurrency(i.amount, profile.currencySymbol),
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 68,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [12, 26, 48], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold' },
      5: { halign: 'center', fontStyle: 'bold' },
      6: { halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        if (data.cell.raw === 'PAID') {
          data.cell.styles.textColor = [16, 185, 129];
        } else if (data.cell.raw === 'PENDING') {
          data.cell.styles.textColor = [245, 158, 11];
        } else if (data.cell.raw === 'OVERDUE') {
          data.cell.styles.textColor = [239, 68, 68];
        }
      }
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 180;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official statement prepared for CPA / Bookkeeping. Confidential • ${profile.practiceName}`, 14, Math.min(finalY + 12, 280));

  doc.save(`LedgerCoach_Statement_${period.replace(/\s+/g, '_')}.pdf`);
}

export function exportLedgerCSV(invoices: Invoice[], profile: PracticeProfile, period: string = 'Q4 2024') {
  const headers = ['Invoice ID', 'Client Name', 'Company', 'Package', 'Amount', 'Currency', 'Issued Date', 'Due Date', 'Cleared Date', 'Status', 'Payment Method', 'Notes'];

  const rows = invoices.map(i => [
    `"${i.id}"`,
    `"${i.clientName.replace(/"/g, '""')}"`,
    `"${i.company.replace(/"/g, '""')}"`,
    `"${i.packageName.replace(/"/g, '""')}"`,
    i.amount,
    `"${profile.currencySymbol}"`,
    i.issuedDate,
    i.dueDate,
    i.clearedDate || '',
    i.status,
    `"${i.paymentMethod || 'Stripe'}"`,
    `"${(i.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LedgerCoach_${period.replace(/\s+/g, '_')}_Ledger.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportSingleInvoiceReceiptPDF(invoice: Invoice, profile: PracticeProfile) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

  // Border & Header
  doc.setFillColor(12, 26, 48);
  doc.rect(0, 0, 148, 28, 'F');

  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('LEDGERCOACH', 12, 14);

  doc.setFontSize(8);
  doc.setTextColor(147, 197, 253);
  doc.text('EXECUTIVE ADVISORY RETAINER RECEIPT', 12, 20);

  doc.setTextColor(255, 255, 255);
  doc.text(`Receipt #: ${invoice.id}`, 136, 14, { align: 'right' });
  doc.text(`Issued: ${invoice.issuedDate}`, 136, 20, { align: 'right' });

  // Coach & Practice Info
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Practitioner: ${profile.coachName} (${profile.partnerStatus})`, 12, 36);
  doc.text(`Contact: ${profile.email} • ${profile.phone}`, 12, 41);

  // Client Details Box
  doc.setFillColor(248, 250, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, 46, 124, 26, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('BILLED TO CLIENT:', 16, 52);

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`${invoice.clientName}`, 16, 58);
  doc.setFontSize(8);
  doc.text(`${invoice.company}`, 16, 64);
  doc.text(`Package: ${invoice.packageName}`, 16, 69);

  // Amount Highlight
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(12, 78, 124, 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text(`RETAINER FEE AMOUNT (${invoice.status})`, 74, 85, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(invoice.amount, profile.currencySymbol), 74, 94, { align: 'center' });

  // Metadata Table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Payment Status: ${invoice.status}`, 14, 110);
  doc.text(`Settled / Due Date: ${invoice.clearedDate || invoice.dueDate}`, 14, 116);
  doc.text(`Payment Channel: ${invoice.paymentMethod || 'Stripe Electronic Transfer'}`, 14, 122);
  if (invoice.notes) {
    doc.text(`Engagement Notes: ${invoice.notes}`, 14, 128);
  }

  // Footer & Wire Details
  doc.setDrawColor(226, 232, 240);
  doc.line(12, 140, 136, 140);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Direct Settlement Account: ${profile.bankDetails}`, 12, 148);
  doc.text('Thank you for partnering with LedgerCoach Executive Advisory.', 12, 153);

  doc.save(`Receipt_${invoice.id}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`);
}
