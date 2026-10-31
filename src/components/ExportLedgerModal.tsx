import React, { useState } from 'react';
import { Invoice, PracticeProfile } from '../types';
import { exportLedgerPDF, exportLedgerCSV } from '../utils/exportUtils';
import { FileDown, X, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

interface ExportLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  profile: PracticeProfile;
  currentPeriod: string;
}

export const ExportLedgerModal: React.FC<ExportLedgerModalProps> = ({
  isOpen,
  onClose,
  invoices,
  profile,
  currentPeriod,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [period, setPeriod] = useState(currentPeriod);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      if (selectedFormat === 'PDF') {
        exportLedgerPDF(invoices, profile, period);
      } else {
        exportLedgerCSV(invoices, profile, period);
      }
      setIsExporting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-xl">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Export Executive Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Audited statements for CPA & Tax Reconciliation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Fiscal Period
            </label>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Q4 2024">Q4 2024 (October – December)</option>
              <option value="Q3 2024">Q3 2024 (July – September)</option>
              <option value="Q2 2024">Q2 2024 (April – June)</option>
              <option value="YTD 2024">Full Fiscal Year YTD 2024</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Output Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat('PDF')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedFormat === 'PDF'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileText className="w-5 h-5 text-blue-600 mb-1.5" />
                <h5 className="font-bold text-xs">Executive PDF Summary</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Formatted for CPAs & board presentations
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('CSV')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedFormat === 'CSV'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1.5" />
                <h5 className="font-bold text-xs">Structured CSV</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Import into QuickBooks, Xero, or Excel
                </p>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Included Invoices:</span>
              <strong className="text-slate-900 dark:text-white">{invoices.length} transactions</strong>
            </div>
            <div className="flex justify-between">
              <span>Practitioner:</span>
              <strong className="text-slate-900 dark:text-white">{profile.coachName}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : `Export ${selectedFormat}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
