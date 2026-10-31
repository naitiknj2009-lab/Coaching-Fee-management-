import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  Users, 
  TableProperties, 
  CreditCard, 
  BarChart3, 
  Database, 
  Settings,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'students', label: t.students, icon: Users },
    { id: 'feeRegister', label: t.feeRegister, icon: TableProperties },
    { id: 'payments', label: t.payments, icon: CreditCard },
    { id: 'reports', label: t.reports, icon: BarChart3 },
    { id: 'backup', label: t.backupRestore, icon: Database },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-screen sticky top-0 p-4 shrink-0">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 px-3 py-4 mb-4 border-b border-slate-100 dark:border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight text-slate-900 dark:text-white">
            {t.appName}
          </h1>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t.session}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-xs text-slate-400 dark:text-slate-500 px-3">
        <p className="font-medium text-slate-600 dark:text-slate-400">Academic 2026–27</p>
        <p className="text-[11px] mt-0.5">100% Offline • IndexedDB</p>
      </div>
    </aside>
  );
};
