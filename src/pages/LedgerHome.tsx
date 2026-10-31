import React from 'react';
import { Invoice, Client, PracticeProfile } from '../types';
import { HeroPerformanceCard } from '../components/HeroPerformanceCard';
import { QuickActionCommandCenter } from '../components/QuickActionCommandCenter';
import { TransactionLedger } from '../components/TransactionLedger';

interface LedgerHomeProps {
  invoices: Invoice[];
  clients: Client[];
  profile: PracticeProfile;
  selectedPeriod: string;
  onNewCharge: () => void;
  onSendReminders: () => void;
  onOpenRetainers: () => void;
  onExportLedger: () => void;
  onViewReceipt: (invoice: Invoice) => void;
  onSendSingleReminder: (invoice: Invoice, tone: 'Gentle Nudge' | 'Urgent Ping') => void;
  onOpenAdvancedFilters: () => void;
  activeFilterCount: number;
}

export const LedgerHome: React.FC<LedgerHomeProps> = ({
  invoices,
  clients,
  profile,
  selectedPeriod,
  onNewCharge,
  onSendReminders,
  onOpenRetainers,
  onExportLedger,
  onViewReceipt,
  onSendSingleReminder,
  onOpenAdvancedFilters,
  activeFilterCount,
}) => {
  // Aggregate Metrics for Hero Card
  const recognizedVolume = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const collectedAmount = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const dueAmount = invoices
    .filter(i => i.status !== 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const paidPercentage = recognizedVolume > 0
    ? Math.round((collectedAmount / recognizedVolume) * 100)
    : 0;

  const dueRemindersCount = invoices.filter(i => i.status !== 'PAID').length;
  const activeRetainersCount = clients.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-2">
      {/* 1. Hero Performance Card */}
      <HeroPerformanceCard
        recognizedVolume={recognizedVolume}
        growthPct={14.2}
        collectedAmount={collectedAmount}
        dueAmount={dueAmount}
        paidPercentage={paidPercentage}
        period={selectedPeriod}
      />

      {/* 2. Quick Action Command Center (2x2 Matrix) */}
      <QuickActionCommandCenter
        onNewCharge={onNewCharge}
        onSendReminders={onSendReminders}
        onOpenRetainers={onOpenRetainers}
        onExportLedger={onExportLedger}
        dueRemindersCount={dueRemindersCount}
        activeRetainersCount={activeRetainersCount}
      />

      {/* 3. Transaction Ledger & Payment Pipeline */}
      <TransactionLedger
        invoices={invoices}
        onViewReceipt={onViewReceipt}
        onSendReminder={onSendSingleReminder}
        onOpenAdvancedFilters={onOpenAdvancedFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
};
