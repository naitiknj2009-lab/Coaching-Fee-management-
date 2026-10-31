import React from 'react';
import { Invoice, PracticeProfile } from '../types';
import { formatCurrency, exportSingleInvoiceReceiptPDF } from '../utils/exportUtils';
import { FileText, Download, X, Building, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  profile: PracticeProfile;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  invoice,
  profile,
}) => {
  if (!isOpen || !invoice) return null;

  const handleDownload = () => {
    exportSingleInvoiceReceiptPDF(invoice, profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Retainer Statement & Receipt
              </h3>
              <p className="text-xs text-slate-400">
                Invoice #{invoice.id} • {invoice.period}
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
          {/* Header Billed To */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Billed Executive Client
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {invoice.clientName}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 flex items-center">
              <Building className="w-3 h-3 mr-1" />
              {invoice.company}
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Scope: {invoice.packageName}
            </p>
          </div>

          {/* Amount Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
              Total Fee Amount ({invoice.status})
            </span>
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
              {formatCurrency(invoice.amount)}
            </div>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
              Settlement Status: Verified via {invoice.paymentMethod || 'Stripe Electronic'}
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-2 px-1">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-400">Issued Date</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{invoice.issuedDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-400">Cleared / Due Date</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{invoice.clearedDate || invoice.dueDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-400">Practitioner</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{profile.coachName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Direct Account</span>
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">{profile.bankDetails}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
