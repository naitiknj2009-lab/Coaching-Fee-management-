import React, { useState } from 'react';
import { Invoice, Client, PracticeProfile } from '../types';
import { formatCurrency } from '../utils/exportUtils';
import { 
  Receipt, 
  Plus, 
  Search, 
  Calendar, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface BillingViewProps {
  invoices: Invoice[];
  clients: Client[];
  profile: PracticeProfile;
  onNewCharge: () => void;
  onViewReceipt: (invoice: Invoice) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  clients,
  profile,
  onNewCharge,
  onViewReceipt,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'recurring'>('invoices');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const totalVolume = invoices.reduce((s, i) => s + i.amount, 0);
  const collectedVolume = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
  const pendingVolume = invoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + i.amount, 0);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Billing & Retainer Invoices
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scheduled recurring advisory billings, checkout links, and settlement records
          </p>
        </div>

        <button
          onClick={onNewCharge}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Financial Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Billed</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {formatCurrency(totalVolume)}
          </div>
          <span className="text-xs text-slate-400">{invoices.length} total statements</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Settled Cash</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(collectedVolume)}
          </div>
          <span className="text-xs text-emerald-600/80">{invoices.filter(i => i.status === 'PAID').length} cleared</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Awaiting Settlement</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {formatCurrency(pendingVolume)}
          </div>
          <span className="text-xs text-amber-600/80">{invoices.filter(i => i.status !== 'PAID').length} pending</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'invoices'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          All Issued Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveSubTab('recurring')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'recurring'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Recurring Retainer Cadences ({clients.length})
        </button>
      </div>

      {/* Invoices Tab */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Invoice</th>
                  <th className="p-3.5">Client & Company</th>
                  <th className="p-3.5">Package</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Fee</th>
                  <th className="p-3.5 text-center">Checkout Link</th>
                  <th className="p-3.5 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoices.map(inv => {
                  const link = inv.stripePaymentUrl || `https://pay.stripe.com/ledgercoach/${inv.id.toLowerCase()}`;
                  const isCopied = copiedLink === link;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        #{inv.id}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{inv.clientName}</div>
                        <div className="text-[11px] text-slate-400">{inv.company}</div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-[150px] truncate">
                        {inv.packageName}
                      </td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {inv.dueDate}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : inv.status === 'PENDING'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                            : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleCopyLink(link)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          title="Copy direct payment checkout link"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Payment Link'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onViewReceipt(inv)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          title="View & Download PDF Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recurring Cadence Tab */}
      {activeSubTab === 'recurring' && (
        <div className="space-y-3">
          {clients.map(client => (
            <div
              key={client.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {client.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {client.company}
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  {client.activePackage}
                </p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                  <span>Frequency: {client.cadence}</span>
                  <span>•</span>
                  <span>Direct Account: {profile.bankDetails}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(client.retainerFee)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">
                    Auto-Renews {client.cadence}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
