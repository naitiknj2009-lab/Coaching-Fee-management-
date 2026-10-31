import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { StudentFeeSummary, Payment, InstituteSettings } from '../types';
import { ACADEMIC_MONTHS } from './academicSession';
import { formatCurrency } from './feeCalculator';

export function exportYearlyRegisterPDF(
  summaries: StudentFeeSummary[],
  settings: InstituteSettings
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138); // Primary blue
  doc.text(settings.instituteName || 'COACHING FEE MANAGEMENT', 14, 15);

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Academic Session: ${settings.session || '2026–27'}  |  Yearly Monthly Fee Register`, 14, 21);

  if (settings.tutorName || settings.contactNumber) {
    const contactLine = [
      settings.tutorName ? `Instructor: ${settings.tutorName}` : '',
      settings.contactNumber ? `Phone: ${settings.contactNumber}` : '',
      settings.address ? `Address: ${settings.address}` : '',
    ].filter(Boolean).join('  •  ');
    doc.setFontSize(9);
    doc.text(contactLine, 14, 26);
  }

  // Table Headers
  const head = [
    [
      '#',
      'Student Name',
      'Joining Date',
      ...ACADEMIC_MONTHS.map(m => m.name),
      'Expected',
      'Received',
      'Balance',
    ],
  ];

  const body = summaries.map((s, idx) => {
    const row = [
      String(idx + 1),
      s.student.name,
      s.student.joiningDate || '-',
    ];

    s.monthCalculations.forEach(m => {
      let cellText = '-';
      if (m.status === 'PAID') cellText = 'PAID';
      else if (m.status === 'NOT_JOINED') cellText = 'N/J';
      else if (m.status === 'NOT_OVER') cellText = 'ONGOING';
      else if (m.status === 'UNPAID') {
        cellText = m.amountPaid > 0 ? `BAL ${m.remainingBalance}` : 'UNPAID';
      }
      row.push(cellText);
    });

    row.push(formatCurrency(s.totalExpected));
    row.push(formatCurrency(s.totalPaid));
    row.push(formatCurrency(s.totalBalance));
    return row;
  });

  // Add Totals row
  const totalExp = summaries.reduce((acc, s) => acc + s.totalExpected, 0);
  const totalRec = summaries.reduce((acc, s) => acc + s.totalPaid, 0);
  const totalBal = summaries.reduce((acc, s) => acc + s.totalBalance, 0);

  body.push([
    '',
    'TOTALS',
    '',
    ...ACADEMIC_MONTHS.map(() => ''),
    formatCurrency(totalExp),
    formatCurrency(totalRec),
    formatCurrency(totalBal),
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      halign: 'center',
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { halign: 'left', cellWidth: 32 },
      2: { cellWidth: 20 },
      // 10 months take equal width
      13: { halign: 'right', fontStyle: 'bold' },
      14: { halign: 'right', fontStyle: 'bold', textColor: [5, 150, 105] },
      15: { halign: 'right', fontStyle: 'bold', textColor: [220, 38, 38] },
    },
    didParseCell: (data) => {
      if (data.section === 'body') {
        const text = String(data.cell.raw);
        if (text === 'PAID') {
          data.cell.styles.textColor = [5, 150, 105];
          data.cell.styles.fontStyle = 'bold';
        } else if (text === 'UNPAID' || text.startsWith('BAL')) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else if (text === 'N/J') {
          data.cell.styles.textColor = [148, 163, 184];
        } else if (text === 'ONGOING') {
          data.cell.styles.textColor = [217, 119, 6];
        }
      }
    },
  });

  // Footer Legend (English and Hindi)
  const finalY = (doc as any).lastAutoTable?.finalY || 160;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Status Legend: PAID = Full fee received (जमा) | UNPAID = Fee pending (बकाया) | N/J = Not Joined (शामिल नहीं) | ONGOING = Month in progress (प्रगति पर)',
    14,
    Math.min(finalY + 10, 195)
  );

  doc.save(`Fee_Register_${settings.session || '2026-27'}.pdf`);
}

export function exportStudentStatementPDF(
  summary: StudentFeeSummary,
  settings: InstituteSettings
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text(settings.instituteName || 'COACHING FEE MANAGEMENT', 14, 18);

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Student Fee Ledger & Statement', 14, 25);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Academic Session: ${settings.session || '2026–27'}  |  Date: ${new Date().toLocaleDateString()}`, 14, 30);

  // Student Details Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 34, 182, 26, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Student: ${summary.student.name}`, 18, 41);
  doc.text(`Joining Date: ${summary.student.joiningDate || '-'}`, 18, 48);
  doc.text(`Monthly Fee: ${formatCurrency(summary.student.monthlyFee)}`, 18, 55);

  doc.text(`Contact: ${summary.student.phone || '-'}`, 110, 41);
  doc.text(`Status: ${summary.student.isActive ? 'Active' : 'Inactive'}`, 110, 48);
  doc.text(`Pending Balance: ${formatCurrency(summary.totalBalance)}`, 110, 55);

  // Table of Monthly Statuses
  const head = [['Month', 'Expected Fee', 'Amount Paid', 'Balance', 'Status']];
  const body = summary.monthCalculations.map(m => [
    `${m.monthName} (${m.hindiName})`,
    formatCurrency(m.expectedFee),
    formatCurrency(m.amountPaid),
    formatCurrency(m.remainingBalance),
    m.status,
  ]);

  body.push([
    'TOTALS',
    formatCurrency(summary.totalExpected),
    formatCurrency(summary.totalPaid),
    formatCurrency(summary.totalBalance),
    summary.totalBalance === 0 ? 'ALL CLEARED' : 'PENDING',
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 66,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 9 },
  });

  doc.save(`Student_Statement_${summary.student.name.replace(/\s+/g, '_')}.pdf`);
}

export function exportPaymentReceiptPDF(
  payment: Payment,
  student: { name: string; phone?: string },
  settings: InstituteSettings
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

  // Receipt Border
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(1);
  doc.rect(8, 8, 132, 194);

  // Header
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text(settings.instituteName || 'COACHING FEE MANAGEMENT', 74, 20, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  if (settings.tagline) {
    doc.text(settings.tagline, 74, 25, { align: 'center' });
  }
  if (settings.contactNumber || settings.address) {
    doc.text([settings.contactNumber, settings.address].filter(Boolean).join(' • '), 74, 30, { align: 'center' });
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 34, 134, 34);

  // Title
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('FEE PAYMENT RECEIPT / फीस रसीद', 74, 42, { align: 'center' });

  // Receipt meta
  doc.setFontSize(9);
  doc.text(`Receipt ID: ${payment.id.slice(0, 8).toUpperCase()}`, 16, 52);
  doc.text(`Date: ${payment.paymentDate}`, 132, 52, { align: 'right' });

  // Receipt Body Box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 58, 120, 58, 'F');

  doc.setFontSize(10);
  doc.text(`Received From: ${student.name}`, 18, 68);
  if (student.phone) {
    doc.text(`Phone: ${student.phone}`, 18, 76);
  }
  doc.text(`Fee Month: ${payment.monthKey}`, 18, 84);
  doc.text(`Payment Mode: ${payment.paymentMethod}`, 18, 92);
  if (payment.transactionId) {
    doc.text(`Ref / Trans. ID: ${payment.transactionId}`, 18, 100);
  }
  if (payment.notes) {
    doc.text(`Remarks: ${payment.notes}`, 18, 108);
  }

  // Amount Highlight
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(37, 99, 235);
  doc.roundedRect(14, 124, 120, 24, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('AMOUNT PAID (प्राप्त राशि)', 74, 132, { align: 'center' });
  doc.setFontSize(16);
  doc.setTextColor(5, 150, 105);
  doc.text(formatCurrency(payment.amount), 74, 142, { align: 'center' });

  // Signatures
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Student / Parent Signature', 18, 180);
  doc.text('Authorized Signatory', 130, 180, { align: 'right' });

  doc.save(`Receipt_${student.name.replace(/\s+/g, '_')}_${payment.paymentDate}.pdf`);
}

export function exportRegisterExcel(summaries: StudentFeeSummary[], session: string = '2026-27') {
  const data = summaries.map((s, idx) => {
    const row: Record<string, any> = {
      'S.No': idx + 1,
      'Student Name': s.student.name,
      'Phone': s.student.phone || '',
      'Joining Date': s.student.joiningDate || '',
      'Base Monthly Fee': s.student.monthlyFee,
    };

    s.monthCalculations.forEach(m => {
      row[m.monthName] = m.status === 'PAID' ? 'PAID' : (m.status === 'NOT_JOINED' ? 'NOT JOINED' : `Bal: ${m.remainingBalance}`);
    });

    row['Total Expected'] = s.totalExpected;
    row['Total Received'] = s.totalPaid;
    row['Total Balance'] = s.totalBalance;
    row['Status'] = s.student.isActive ? 'Active' : 'Inactive';
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Fee Register');
  XLSX.writeFile(wb, `Coaching_Fee_Register_${session}.xlsx`);
}

export function exportRegisterCSV(summaries: StudentFeeSummary[], session: string = '2026-27') {
  const headers = [
    'S.No',
    'Student Name',
    'Phone',
    'Joining Date',
    'Base Monthly Fee',
    ...ACADEMIC_MONTHS.map(m => m.name),
    'Total Expected',
    'Total Received',
    'Total Balance',
    'Status',
  ];

  const rows = summaries.map((s, idx) => [
    idx + 1,
    `"${s.student.name.replace(/"/g, '""')}"`,
    `"${s.student.phone || ''}"`,
    s.student.joiningDate || '',
    s.student.monthlyFee,
    ...s.monthCalculations.map(m => m.status === 'PAID' ? 'PAID' : (m.status === 'NOT_JOINED' ? 'NOT JOINED' : `Bal: ${m.remainingBalance}`)),
    s.totalExpected,
    s.totalPaid,
    s.totalBalance,
    s.student.isActive ? 'Active' : 'Inactive',
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Coaching_Fee_Register_${session}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
