import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { formatCurrency } from '../utils/exportUtils';
import { 
  Search, 
  Filter, 
  Send, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Zap,
  Building,
  ArrowRight
} from 'lucide-react';

interface TransactionLedgerProps {
  invoices: Invoice[];
  onViewReceipt: (invoice: Invoice) => void;
  onSendReminder: (invoice: Invoice, tone: 'Gentle Nudge' | 'Urgent Ping') => void;
  onOpenAdvancedFilters: () => void;
  activeFilterCount: number;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  invoices,
  onViewReceipt,
  onSendReminder,
  onOpenAdvancedFilters,
  activeFilterCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');

  // Filter counters
  const totalCount = invoices.length;
  const paidCount = invoices.filter(i => i.status === 'PAID').length;
  const pendingCount = invoices.filter(i => i.status === 'PENDING').length;
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  // Filtered list
  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Transaction Ledger & Retainer Pipeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time collection pipeline, payment verification, and follow-up triggers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Advanced Filter Modal Trigger */}
          <button
            onClick={onOpenAdvancedFilters}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeFilterCount > 0
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Input & Status Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by executive name, company, invoice #INV-2041, or package..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm"
          />
        </div>

        {/* Filter Pills with Counters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => setStatusFilter('PAID')}
            className={`inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'PAID'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            <span>Paid ({paidCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'PENDING'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('OVERDUE')}
            className={`inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'OVERDUE'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-red-500" />
            <span>Overdue ({overdueCount})</span>
          </button>
        </div>
      </div>

      {/* Transactions Feed */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No invoices matching the current filter.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search terms or filter selection.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(invoice => {
            const isPaid = invoice.status === 'PAID';
            const isPending = invoice.status === 'PENDING';
            const isOverdue = invoice.status === 'OVERDUE';

            return (
              <div
                key={invoice.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-executive transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Client & Invoice Info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                      #{invoice.id}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {invoice.period}
                    </span>
                    {invoice.lastPinged && (
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/40">
                        {invoice.lastPinged}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {invoice.clientName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                      <Building className="w-3 h-3 mr-1 text-slate-400" />
                      {invoice.company}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {invoice.packageName}
                    </span>
                  </div>

                  {/* Due date / Cleared date indicator */}
                  <div className="pt-1 text-[11px]">
                    {isPaid && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Cleared on {invoice.clearedDate || invoice.dueDate} ({invoice.paymentMethod || 'Stripe'})
                      </span>
                    )}
                    {isPending && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Due on {invoice.dueDate} ({invoice.dueDaysLeft ? `in ${invoice.dueDaysLeft} days` : 'Due soon'})
                      </span>
                    )}
                    {isOverdue && (
                      <span className="text-red-600 dark:text-red-400 font-bold flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        OVERDUE {invoice.overdueDays || 15}D (Due: {invoice.dueDate})
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Net Amount & Context Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-white/10 gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(invoice.amount)}
                    </div>
                    {/* Status Badge */}
                    <div className="mt-0.5">
                      {isPaid && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          PAID
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          PENDING
                        </span>
                      )}
                      {isOverdue && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                          OVERDUE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Context Action Button */}
                  <div>
                    {isPaid && (
                      <button
                        onClick={() => onViewReceipt(invoice)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>
                    )}

                    {isPending && (
                      <button
                        onClick={() => onSendReminder(invoice, 'Gentle Nudge')}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/25 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Remind</span>
                      </button>
                    )}

                    {isOverdue && (
                      <button
                        onClick={() => onSendReminder(invoice, 'Urgent Ping')}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/30 transition-all"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Urgent Ping</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
