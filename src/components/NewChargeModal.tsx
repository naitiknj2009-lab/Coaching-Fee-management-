import React, { useState } from 'react';
import { Client, Invoice, RetainerCadence } from '../types';
import { db } from '../db';
import { PlusCircle, X, DollarSign, Calendar, User, Briefcase, FileText, CheckCircle2, Link2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onInvoiceCreated: (invoice: Invoice) => void;
}

export const NewChargeModal: React.FC<NewChargeModalProps> = ({
  isOpen,
  onClose,
  clients,
  onInvoiceCreated,
}) => {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [packageName, setPackageName] = useState('Executive Leadership Retainer');
  const [amount, setAmount] = useState<number>(4500);
  const [cadence, setCadence] = useState<RetainerCadence>('Monthly');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [issuePaymentLink, setIssuePaymentLink] = useState(true);

  if (!isOpen) return null;

  const handleClientChange = (selectedId: string) => {
    setClientId(selectedId);
    const client = clients.find(c => c.id === selectedId);
    if (client) {
      setAmount(client.retainerFee);
      setPackageName(client.activePackage);
      setCadence(client.cadence);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId) || {
      name: 'Executive Client',
      company: 'Enterprise Partner',
    };

    const invNum = Math.floor(2000 + Math.random() * 900);
    const newInvoice: Invoice = {
      id: `INV-${invNum}`,
      clientId,
      clientName: client.name,
      company: client.company,
      packageName,
      amount: Number(amount),
      period: 'Q4 2024',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'PENDING',
      dueDaysLeft: 14,
      paymentMethod: 'Stripe',
      notes: notes.trim() || undefined,
      stripePaymentUrl: `https://pay.stripe.com/ledgercoach/inv-${invNum}`,
    };

    await db.invoices.add(newInvoice);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}

    onInvoiceCreated(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Issue New Retainer Charge
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-value advisory invoice & payment link
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Client Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Executive Client *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                required
                value={clientId}
                onChange={e => handleClientChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company} ({c.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coaching Package */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Coaching Package / Scope *
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={packageName}
                onChange={e => setPackageName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Executive Leadership Retainer">Executive Leadership Retainer</option>
                <option value="C-Suite Advisory Sprint">C-Suite Advisory Sprint</option>
                <option value="Founder Scale Retainer">Founder Scale Retainer</option>
                <option value="Board Advisory Retainer">Board Advisory Retainer</option>
                <option value="Executive Bi-Weekly Advisory">Executive Bi-Weekly Advisory</option>
                <option value="Custom Strategic Advisory">Custom Strategic Advisory</option>
              </select>
            </div>
          </div>

          {/* Amount & Cadence */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fee Amount ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="500"
                  step="250"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cadence *
              </label>
              <select
                value={cadence}
                onChange={e => setCadence(e.target.value as RetainerCadence)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Monthly">Monthly Retainer</option>
                <option value="Sprint">Sprint Commitment</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Quarterly">Quarterly Block</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Payment Due Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Engagement Notes / Deliverables
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Q4 Executive Sprint (Sessions 1-4) & 360-Review"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Toggle Instant Link */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="paymentLink"
              checked={issuePaymentLink}
              onChange={e => setIssuePaymentLink(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <label htmlFor="paymentLink" className="text-xs text-slate-600 dark:text-slate-400 flex items-center font-medium">
              <Link2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
              Generate instant 1-tap Stripe checkout link
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
            >
              Issue Retainer Charge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
