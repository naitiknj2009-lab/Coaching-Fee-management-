import React from 'react';
import { PlusCircle, Send, Briefcase, FileDown } from 'lucide-react';

interface QuickActionCommandCenterProps {
  onNewCharge: () => void;
  onSendReminders: () => void;
  onOpenRetainers: () => void;
  onExportLedger: () => void;
  dueRemindersCount: number;
  activeRetainersCount: number;
}

export const QuickActionCommandCenter: React.FC<QuickActionCommandCenterProps> = ({
  onNewCharge,
  onSendReminders,
  onOpenRetainers,
  onExportLedger,
  dueRemindersCount,
  activeRetainersCount,
}) => {
  return (
    <div className="max-w-5xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Executive Command Center
        </h3>
        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
          High-Velocity Operations
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* New Charge */}
        <button
          onClick={onNewCharge}
          className="group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 shadow-sm hover:shadow-executive transition-all text-left flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
              Instant Link
            </span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              New Charge
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Issue retainer or advisory fee invoice
            </p>
          </div>
        </button>

        {/* Send Reminders */}
        <button
          onClick={onSendReminders}
          className="group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-amber-500/50 shadow-sm hover:shadow-executive transition-all text-left flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            {dueRemindersCount > 0 && (
              <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800 animate-pulse">
                {dueRemindersCount} due
              </span>
            )}
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Send Reminders
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Courteous automated follow-ups
            </p>
          </div>
        </button>

        {/* Retainers Hub */}
        <button
          onClick={onOpenRetainers}
          className="group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 shadow-sm hover:shadow-executive transition-all text-left flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              {activeRetainersCount} Active
            </span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Retainers Hub
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Client contracts & recurring cadences
            </p>
          </div>
        </button>

        {/* Export Ledger */}
        <button
          onClick={onExportLedger}
          className="group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/50 shadow-sm hover:shadow-executive transition-all text-left flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
              CPA Ready
            </span>
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Export Ledger
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Formatted PDF & CSV for tax prep
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
