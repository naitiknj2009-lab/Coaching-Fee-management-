import React, { useState } from 'react';
import { StudentFeeSummary, Payment, InstituteSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/feeCalculator';
import { PromptInstituteModal } from '../components/PromptInstituteModal';
import { 
  exportYearlyRegisterPDF, 
  exportRegisterExcel, 
  exportRegisterCSV 
} from '../utils/exportUtils';
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Users,
  Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsProps {
  summaries: StudentFeeSummary[];
  payments: Payment[];
}

export const Reports: React.FC<ReportsProps> = ({ summaries, payments }) => {
  const { t } = useLanguage();
  const [activeExportAction, setActiveExportAction] = useState<string | null>(null);

  const totalExpected = summaries.reduce((acc, s) => acc + s.totalExpected, 0);
  const totalCollected = summaries.reduce((acc, s) => acc + s.totalPaid, 0);
  const totalBalance = summaries.reduce((acc, s) => acc + s.totalBalance, 0);

  const executeExport = (action: string, settings: InstituteSettings) => {
    switch (action) {
      case 'yearly_pdf':
        exportYearlyRegisterPDF(summaries, settings);
        break;
      case 'excel':
        exportRegisterExcel(summaries, settings.session);
        break;
      case 'csv':
        exportRegisterCSV(summaries, settings.session);
        break;
      case 'outstanding_pdf': {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.setFontSize(16);
        doc.setTextColor(30, 58, 138);
        doc.text(settings.instituteName || 'COACHING FEE MANAGEMENT', 14, 18);
        doc.setFontSize(12);
        doc.setTextColor(220, 38, 38);
        doc.text('Outstanding Fees Report / बकाया फीस विवरण', 14, 25);
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Academic Session: ${settings.session || '2026–27'} | Date: ${new Date().toLocaleDateString()}`, 14, 30);

        const pendingList = summaries.filter(s => s.totalBalance > 0);
        const head = [['#', 'Student Name', 'Phone', 'Expected', 'Paid', 'Outstanding Balance']];
        const body = pendingList.map((s, i) => [
          String(i + 1),
          s.student.name,
          s.student.phone || '-',
          formatCurrency(s.totalExpected),
          formatCurrency(s.totalPaid),
          formatCurrency(s.totalBalance),
        ]);
        body.push([
          '',
          'TOTAL OUTSTANDING',
          '',
          formatCurrency(pendingList.reduce((a, s) => a + s.totalExpected, 0)),
          formatCurrency(pendingList.reduce((a, s) => a + s.totalPaid, 0)),
          formatCurrency(pendingList.reduce((a, s) => a + s.totalBalance, 0)),
        ]);

        autoTable(doc, {
          head,
          body,
          startY: 35,
          theme: 'striped',
          headStyles: { fillColor: [220, 38, 38] },
          styles: { fontSize: 9 },
        });
        doc.save(`Outstanding_Fees_${settings.session || '2026-27'}.pdf`);
        break;
      }
      case 'monthly_summary_pdf': {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.setFontSize(16);
        doc.setTextColor(30, 58, 138);
        doc.text(settings.instituteName || 'COACHING FEE MANAGEMENT', 14, 18);
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('Yearly Financial Collection Summary (2026–27)', 14, 25);

        const head = [['Metric', 'Figure']];
        const body = [
          ['Total Enrolled Students', String(summaries.length)],
          ['Active Students', String(summaries.filter(s => s.student.isActive).length)],
          ['Total Expected Tuition Fees', formatCurrency(totalExpected)],
          ['Total Tuition Fees Collected', formatCurrency(totalCollected)],
          ['Total Outstanding Fees', formatCurrency(totalBalance)],
          ['Overall Collection Rate', `${totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}%`],
          ['Total Transactions Recorded', String(payments.length)],
        ];

        autoTable(doc, {
          head,
          body,
          startY: 32,
          theme: 'grid',
          headStyles: { fillColor: [30, 58, 138] },
          styles: { fontSize: 10, cellPadding: 4 },
        });
        doc.save(`Financial_Summary_${settings.session || '2026-27'}.pdf`);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.reports}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Audit-ready financial ledgers, A4 printable registers, Excel sheets, and CSV exports
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Yearly Register PDF */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t.yearlyFeeRegister}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete A4 landscape register with all 10 months (June to March), status icons, and Hindi/English legends inspired by reference specifications.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setActiveExportAction('yearly_pdf')}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Landscape PDF</span>
            </button>
          </div>
        </div>

        {/* Excel (.xlsx) Export */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Excel Spreadsheet (.xlsx)
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Full structured workbook with student records, individual monthly statuses, expected amounts, collected fees, and balances.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setActiveExportAction('excel')}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Outstanding Balances Report */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t.outstandingReport}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Targeted list of students with unpaid or partially paid months, pending balances, and phone numbers for fee reminders.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setActiveExportAction('outstanding_pdf')}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Outstanding PDF</span>
            </button>
          </div>
        </div>

        {/* Financial Summary Audit */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t.yearlyReport}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Consolidated financial audit report showing expected tuition, collections, overall collection percentages, and active counts.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setActiveExportAction('monthly_summary_pdf')}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Summary PDF</span>
            </button>
          </div>
        </div>

        {/* CSV Data Export */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Universal CSV Export
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Plain text comma-separated values compatible with Google Sheets, LibreOffice, Python, or accounting software.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setActiveExportAction('csv')}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institute Header Prompt Dialog */}
      <PromptInstituteModal
        isOpen={activeExportAction !== null}
        onClose={() => setActiveExportAction(null)}
        onConfirm={(settings) => {
          const action = activeExportAction;
          setActiveExportAction(null);
          if (action) {
            executeExport(action, settings);
          }
        }}
      />
    </div>
  );
};
