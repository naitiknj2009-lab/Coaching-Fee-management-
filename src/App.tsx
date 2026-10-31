import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase, getProfile, DEFAULT_PROFILE } from './db';
import { Invoice, Client, ReminderLog, PracticeProfile } from './types';
import { HeaderModule } from './components/HeaderModule';
import { BottomNavBar, ActiveTab } from './components/BottomNavBar';
import { LedgerHome } from './pages/LedgerHome';
import { ClientsView } from './pages/ClientsView';
import { BillingView } from './pages/BillingView';
import { ReportsView } from './pages/ReportsView';
import { AlertsView } from './pages/AlertsView';

import { NewChargeModal } from './components/NewChargeModal';
import { ReminderModal } from './components/ReminderModal';
import { ReceiptModal } from './components/ReceiptModal';
import { QRQuickScanModal } from './components/QRQuickScanModal';
import { ExportLedgerModal } from './components/ExportLedgerModal';
import { FilterModal, AdvancedFilterState } from './components/FilterModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('ledger');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Q4 2024');
  const [profile, setProfile] = useState<PracticeProfile>(DEFAULT_PROFILE);

  // Modals state
  const [isNewChargeOpen, setIsNewChargeOpen] = useState(false);
  const [isQRScanOpen, setIsQRScanOpen] = useState(false);
  const [isExportLedgerOpen, setIsExportLedgerOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Receipt Modal
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<Invoice | null>(null);

  // Reminder Modal
  const [reminderInvoice, setReminderInvoice] = useState<Invoice | null>(null);
  const [reminderTone, setReminderTone] = useState<'Gentle Nudge' | 'Urgent Ping'>('Gentle Nudge');

  // Filters State
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    amountBracket: 'ALL',
    cadence: 'ALL',
  });

  // Initialize seed database on launch
  useEffect(() => {
    initializeDatabase().then(() => {
      getProfile().then(p => setProfile(p));
    });
  }, []);

  // Live queries from Dexie
  const rawInvoices = useLiveQuery(() => db.invoices.toArray()) || [];
  const clients = useLiveQuery(() => db.clients.toArray()) || [];
  const reminders = useLiveQuery(() => db.reminders.toArray()) || [];

  // Filter invoices by period & advanced filters
  const periodInvoices = rawInvoices.filter(i => {
    if (selectedPeriod === 'YTD 2024') return true;
    return i.period === selectedPeriod;
  });

  const invoices = periodInvoices.filter(inv => {
    if (advancedFilters.amountBracket === 'UNDER_4K' && inv.amount >= 4000) return false;
    if (advancedFilters.amountBracket === '4K_TO_6K' && (inv.amount < 4000 || inv.amount > 6000)) return false;
    if (advancedFilters.amountBracket === 'OVER_6K' && inv.amount <= 6000) return false;
    return true;
  });

  const activeFilterCount =
    (advancedFilters.amountBracket !== 'ALL' ? 1 : 0) +
    (advancedFilters.cadence !== 'ALL' ? 1 : 0);

  const dueRemindersCount = invoices.filter(i => i.status !== 'PAID').length;

  const handleOpenReminder = (invoice: Invoice, tone: 'Gentle Nudge' | 'Urgent Ping') => {
    setReminderInvoice(invoice);
    setReminderTone(tone);
  };

  const handleSendBatchReminders = () => {
    const firstDue = invoices.find(i => i.status !== 'PAID');
    if (firstDue) {
      handleOpenReminder(firstDue, firstDue.status === 'OVERDUE' ? 'Urgent Ping' : 'Gentle Nudge');
    } else {
      setCurrentTab('alerts');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-900 dark:bg-[#070d18] dark:text-slate-100 flex flex-col font-sans pb-24 selection:bg-blue-600 selection:text-white">
      {/* 1. Header & Identity Chrome */}
      <HeaderModule
        profile={profile}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        onOpenNotifications={() => setCurrentTab('alerts')}
        onOpenQR={() => setIsQRScanOpen(true)}
        unreadCount={dueRemindersCount}
      />

      {/* Main Content View Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {currentTab === 'ledger' && (
          <LedgerHome
            invoices={invoices}
            clients={clients}
            profile={profile}
            selectedPeriod={selectedPeriod}
            onNewCharge={() => setIsNewChargeOpen(true)}
            onSendReminders={handleSendBatchReminders}
            onOpenRetainers={() => setCurrentTab('billing')}
            onExportLedger={() => setIsExportLedgerOpen(true)}
            onViewReceipt={(inv) => setSelectedReceiptInvoice(inv)}
            onSendSingleReminder={handleOpenReminder}
            onOpenAdvancedFilters={() => setIsFilterModalOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsView
            clients={clients}
            invoices={rawInvoices}
            onNewChargeForClient={() => setIsNewChargeOpen(true)}
          />
        )}

        {currentTab === 'billing' && (
          <BillingView
            invoices={rawInvoices}
            clients={clients}
            profile={profile}
            onNewCharge={() => setIsNewChargeOpen(true)}
            onViewReceipt={(inv) => setSelectedReceiptInvoice(inv)}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            invoices={rawInvoices}
            clients={clients}
            profile={profile}
            onExportReport={() => setIsExportLedgerOpen(true)}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            reminders={reminders}
            invoices={rawInvoices}
            onTriggerReminder={(inv) => handleOpenReminder(inv, inv.status === 'OVERDUE' ? 'Urgent Ping' : 'Gentle Nudge')}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        dueAlertsCount={dueRemindersCount}
      />

      {/* Modals & Dialogs */}
      <NewChargeModal
        isOpen={isNewChargeOpen}
        onClose={() => setIsNewChargeOpen(false)}
        clients={clients}
        onInvoiceCreated={() => {}}
      />

      <ReminderModal
        isOpen={reminderInvoice !== null}
        onClose={() => setReminderInvoice(null)}
        invoice={reminderInvoice}
        defaultTone={reminderTone}
        onReminderSent={() => {}}
      />

      <ReceiptModal
        isOpen={selectedReceiptInvoice !== null}
        onClose={() => setSelectedReceiptInvoice(null)}
        invoice={selectedReceiptInvoice}
        profile={profile}
      />

      <QRQuickScanModal
        isOpen={isQRScanOpen}
        onClose={() => setIsQRScanOpen(false)}
        profile={profile}
      />

      <ExportLedgerModal
        isOpen={isExportLedgerOpen}
        onClose={() => setIsExportLedgerOpen(false)}
        invoices={invoices}
        profile={profile}
        currentPeriod={selectedPeriod}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={advancedFilters}
        onApplyFilters={setAdvancedFilters}
        onResetFilters={() => setAdvancedFilters({ amountBracket: 'ALL', cadence: 'ALL' })}
      />
    </div>
  );
};
export default App;
