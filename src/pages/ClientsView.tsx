import React, { useState } from 'react';
import { Client, Invoice } from '../types';
import { db } from '../db';
import { formatCurrency } from '../utils/exportUtils';
import { 
  Users, 
  Search, 
  Plus, 
  Building, 
  Briefcase, 
  Mail, 
  Phone, 
  CreditCard, 
  Sparkles,
  Calendar,
  X 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClientsViewProps {
  clients: Client[];
  invoices: Invoice[];
  onNewChargeForClient: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  invoices,
  onNewChargeForClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // New Client Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [activePackage, setActivePackage] = useState('Executive Leadership Retainer');
  const [cadence, setCadence] = useState<'Monthly' | 'Sprint' | 'Bi-Weekly' | 'Quarterly'>('Monthly');
  const [retainerFee, setRetainerFee] = useState(5000);
  const [corporateSponsor, setCorporateSponsor] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: 'cli_' + Date.now().toString(36),
      name: name.trim(),
      title: title.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      activePackage,
      cadence,
      retainerFee: Number(retainerFee),
      status: 'ACTIVE',
      corporateSponsor: corporateSponsor.trim() || undefined,
      notes: notes.trim() || undefined,
      ltv: Number(retainerFee),
      joinedDate: new Date().toISOString().split('T')[0],
    };

    await db.clients.add(newClient);

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}

    setIsAddClientOpen(false);
    // Reset form
    setName('');
    setTitle('');
    setCompany('');
    setEmail('');
    setPhone('');
    setCorporateSponsor('');
    setNotes('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Executive Client Portfolio
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              {clients.length} Active Engagements
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Leader profiles, corporate sponsor agreements, and retainer health
          </p>
        </div>

        <button
          onClick={() => setIsAddClientOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Executive Client</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by leader name, company, or executive title..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm"
        />
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(client => {
          const clientInvoices = invoices.filter(i => i.clientId === client.id);
          const hasOverdue = clientInvoices.some(i => i.status === 'OVERDUE');
          const hasPending = clientInvoices.some(i => i.status === 'PENDING');

          return (
            <div
              key={client.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-executive transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Fee */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {client.status}
                  </span>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {formatCurrency(client.retainerFee)} / {client.cadence}
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  {client.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {client.title} • <strong className="text-slate-700 dark:text-slate-300">{client.company}</strong>
                </p>

                {/* Scope & Corporate Sponsor */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                  <div className="flex items-center text-slate-700 dark:text-slate-300 font-semibold truncate">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
                    <span className="truncate">{client.activePackage}</span>
                  </div>
                  {client.corporateSponsor && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {client.corporateSponsor}
                    </div>
                  )}
                </div>

                {/* Engagement Metrics */}
                <div className="mt-3 flex items-center justify-between text-xs px-1">
                  <div>
                    <span className="text-slate-400 text-[11px]">Lifetime Value</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(client.ltv)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px]">Billing Health</span>
                    <p className={`font-bold ${
                      hasOverdue ? 'text-red-600' : hasPending ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {hasOverdue ? 'Overdue Due' : hasPending ? 'Pending Inv' : 'All Cleared'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setSelectedClient(client)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600"
                >
                  View Details
                </button>

                <button
                  onClick={() => onNewChargeForClient(client)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                >
                  <CreditCard className="w-3 h-3" />
                  <span>Issue Charge</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {isAddClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add New Executive Client
              </h3>
              <button
                onClick={() => setIsAddClientOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Leader Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Richard Hendricks"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Executive Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Chief Executive Officer"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Pied Piper Inc."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Retainer Fee ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="500"
                    step="250"
                    value={retainerFee}
                    onChange={e => setRetainerFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="richard@piedpiper.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / Direct Line
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Corporate Sponsor Notes (e.g. Enterprise L&D, Self-Sponsored)
                </label>
                <input
                  type="text"
                  value={corporateSponsor}
                  onChange={e => setCorporateSponsor(e.target.value)}
                  placeholder="e.g. Sponsored via Corporate Executive Education Stipend"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
                >
                  Save Executive Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Detail Drawer / Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {selectedClient.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedClient.title} • {selectedClient.company}
                </p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Package:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedClient.activePackage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cadence:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedClient.cadence} ({formatCurrency(selectedClient.retainerFee)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-blue-600">{selectedClient.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Phone:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{selectedClient.phone || '-'}</span>
                </div>
              </div>

              {selectedClient.corporateSponsor && (
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">Corporate Sponsorship:</span>
                  {selectedClient.corporateSponsor}
                </div>
              )}

              {selectedClient.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Engagement Notes:</span>
                  {selectedClient.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
