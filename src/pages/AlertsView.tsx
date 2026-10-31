import React, { useState } from 'react';
import { ReminderLog, Invoice } from '../types';
import { formatCurrency } from '../utils/exportUtils';
import { 
  Bell, 
  Send, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Copy, 
  Check,
  AlertCircle
} from 'lucide-react';

interface AlertsViewProps {
  reminders: ReminderLog[];
  invoices: Invoice[];
  onTriggerReminder: (invoice: Invoice) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  reminders,
  invoices,
  onTriggerReminder,
}) => {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');
  const pendingInvoices = invoices.filter(i => i.status === 'PENDING');

  const templates = [
    {
      id: 'gentle',
      title: 'Gentle Executive Nudge (High-Trust)',
      tone: 'Gentle Nudge',
      text: 'Hi [Name], Hope our session on Tuesday provided clarity on the product re-org. Sharing a courteous note that your monthly advisory retainer statement is pending. Please let me know if you need any adjustments or if I should loop in your AP coordinator.',
    },
    {
      id: 'milestone',
      title: 'Pre-Milestone Alignment Check-in',
      tone: 'Milestone Follow-up',
      text: 'Hi [Name], Ahead of our upcoming strategic offsite next week, sharing the retainer statement for your review. Looking forward to our continued partnership on the leadership transition.',
    },
    {
      id: 'urgent',
      title: 'Overdue Statement Direct Inquiry',
      tone: 'Urgent Ping',
      text: 'Hi [Name], Checking in regarding statement #[ID] ($[Amount]) which is past due. To ensure uninterrupted advisory access for your team, could you confirm when execution is scheduled with finance, or share AP contact details?',
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-2">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Communication Outbox & Follow-up Logs
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Courteous executive reminders, dispatch audit trails, and delivery confirmation
        </p>
      </div>

      {/* Action Required: Overdue Invoices Callout */}
      {overdueInvoices.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 font-extrabold text-sm mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Action Required: {overdueInvoices.length} Overdue Retainers Awaiting Nudge</span>
          </div>
          <div className="space-y-2 mt-3">
            {overdueInvoices.map(inv => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 text-xs"
              >
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {inv.clientName}
                  </span>
                  <span className="text-slate-400 ml-1.5 font-medium">
                    ({inv.company}) • #{inv.id}
                  </span>
                  <div className="text-[11px] text-red-600 font-bold mt-0.5">
                    {formatCurrency(inv.amount)} • Overdue {inv.overdueDays || 15} days
                  </div>
                </div>

                <button
                  onClick={() => onTriggerReminder(inv)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Nudge</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dispatched Reminder Logs */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          Recent Executive Communication Outbox
        </h3>

        {reminders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No reminders dispatched yet. Reminders triggered from the ledger will log here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {reminders.map(rem => (
              <div
                key={rem.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/5 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {rem.clientName}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {rem.tone}
                    </span>
                    <span className="text-slate-400 text-[11px]">{rem.channel}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{rem.sentAt}</span>
                </div>

                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {rem.subject}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {rem.preview}
                </p>

                <div className="pt-1 flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Delivered to executive inbox</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Courteous Template Library */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Courteous Executive Reminder Templates
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tested executive advisory scripts that protect high-trust relationships
            </p>
          </div>
          <Sparkles className="w-4 h-4 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates.map(tpl => {
            const isCopied = copiedTemplate === tpl.id;
            return (
              <div
                key={tpl.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {tpl.tone}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                    {tpl.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-sans">
                    "{tpl.text}"
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/50 dark:border-white/5 flex justify-end">
                  <button
                    onClick={() => handleCopy(tpl.id, tpl.text)}
                    className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy Template'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
