import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  Users, 
  TableProperties, 
  CreditCard, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'students', label: t.students, icon: Users },
    { id: 'feeRegister', label: t.feeRegister, icon: TableProperties },
    { id: 'payments', label: t.payments, icon: CreditCard },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-pb">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[54px]">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
