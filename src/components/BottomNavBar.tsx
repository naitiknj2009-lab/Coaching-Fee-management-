import React from 'react';
import { 
  CreditCard, 
  Users, 
  Receipt, 
  BarChart3, 
  Bell 
} from 'lucide-react';

export type ActiveTab = 'ledger' | 'clients' | 'billing' | 'reports' | 'alerts';

interface BottomNavBarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  dueAlertsCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  dueAlertsCount,
}) => {
  const tabs = [
    { id: 'clients' as ActiveTab, label: 'Clients', icon: Users },
    { id: 'billing' as ActiveTab, label: 'Billing', icon: Receipt },
    { id: 'ledger' as ActiveTab, label: 'Ledger', icon: CreditCard },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: BarChart3 },
    { id: 'alerts' as ActiveTab, label: 'Alerts', icon: Bell, badge: dueAlertsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c1a30]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 px-3 py-2 shadow-2xl safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 shadow-sm' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c1a30]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
