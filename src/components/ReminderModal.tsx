import React, { useState, useEffect } from 'react';
import { Invoice, ReminderTone, ReminderLog } from '../types';
import { db } from '../db';
import { formatCurrency } from '../utils/exportUtils';
import { Send, X, Mail, MessageSquare, Sparkles, CheckCircle2, ShieldAlert, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  defaultTone?: ReminderTone;
  onReminderSent: (invoiceId: string) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  invoice,
  defaultTone = 'Gentle Nudge',
  onReminderSent,
}) => {
  const [tone, setTone] = useState<ReminderTone>(defaultTone);
  const [channel, setChannel] = useState<'Email' | 'SMS'>('Email');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (defaultTone) {
      setTone(defaultTone);
    }
  }, [defaultTone]);

  useEffect(() => {
    if (!invoice) return;

    if (tone === 'Gentle Nudge') {
      setSubject(`${invoice.clientName.split(' ')[0]} — Quick check-in regarding ${invoice.period} Advisory Retainer (#${invoice.id})`);
      setMessageBody(
        `Hi ${invoice.clientName.split(' ')[0]},\n\nHope our recent sessions on executive leadership alignment have been fruitful.\n\nSharing a courteous note that invoice #${invoice.id} for the ${invoice.packageName} (${formatCurrency(invoice.amount)}) is currently open. Let me know if you need any adjustments or if I should loop in your finance team.\n\nWarm regards,\nElena Vance`
      );
    } else if (tone === 'Milestone Follow-up') {
      setSubject(`Coaching Milestone Update & Statement #${invoice.id}`);
      setMessageBody(
        `Hi ${invoice.clientName.split(' ')[0]},\n\nLooking forward to our upcoming strategic cadence next week. Ahead of our milestone review, here is the updated retainer link for #${invoice.id} (${formatCurrency(invoice.amount)}).\n\nDirect Stripe link: ${invoice.stripePaymentUrl || 'https://pay.stripe.com/ledgercoach'}\n\nBest,\nElena`
      );
    } else {
      // Urgent Ping
      setSubject(`Urgent: Follow-up on Overdue Retainer Statement #${invoice.id} (${invoice.company})`);
      setMessageBody(
        `Hi ${invoice.clientName.split(' ')[0]},\n\nI hope all is well. Reaching out directly regarding invoice #${invoice.id} (${formatCurrency(invoice.amount)}) which is currently ${invoice.overdueDays || 15} days past due.\n\nTo ensure uninterrupted advisory access, could you confirm when settlement will be executed, or share the direct contact for your AP department?\n\nThank you,\nElena Vance`
      );
    }
  }, [invoice, tone]);

  if (!isOpen || !invoice) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${subject}\n\n${messageBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    setIsSending(true);

    const logEntry: ReminderLog = {
      id: 'rem_' + Date.now().toString(36),
      invoiceId: invoice.id,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      tone,
      channel,
      sentAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      subject,
      preview: messageBody.slice(0, 120) + '...',
      status: 'Delivered',
    };

    await db.reminders.add(logEntry);
    await db.invoices.update(invoice.id, { lastPinged: 'Pinged Today' });

    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch {}

    setTimeout(() => {
      setIsSending(false);
      onReminderSent(invoice.id);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-2xl ${
              tone === 'Urgent Ping'
                ? 'bg-red-50 dark:bg-red-950/60 text-red-600'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
            }`}>
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Dispatch Payment Nudge
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To: <span className="font-semibold text-slate-800 dark:text-slate-200">{invoice.clientName}</span> ({invoice.company}) • {formatCurrency(invoice.amount)}
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

        {/* Tone Selector Pills */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Communication Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Gentle Nudge', 'Milestone Follow-up', 'Urgent Ping'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center leading-tight ${
                    tone === t
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Selector */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Delivery Channel
            </span>
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setChannel('Email')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  channel === 'Email' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Executive Email</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  channel === 'SMS' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct SMS</span>
              </button>
            </div>
          </div>

          {/* Subject Line (if Email) */}
          {channel === 'Email' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Draft Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Message Content
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={messageBody}
              onChange={e => setMessageBody(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-white/10">
          <span className="text-[11px] text-slate-400 flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 mr-1" />
            Courteous AI-tuned executive phrasing
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Confirm & Dispatch Nudge'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
