import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  UserPlus, 
  CreditCard, 
  Sun, 
  Moon, 
  Languages, 
  WifiOff, 
  GraduationCap 
} from 'lucide-react';

interface NavbarProps {
  onAddStudent: () => void;
  onRecordPayment: () => void;
  hasStudents: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddStudent,
  onRecordPayment,
  hasStudents,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
      {/* Mobile Title */}
      <div className="flex items-center space-x-2.5 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <GraduationCap className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
            {t.appName}
          </h2>
          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
            {t.session}
          </span>
        </div>
      </div>

      {/* Desktop Search / Status info */}
      <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>IndexedDB Local Storage</span>
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
          June 2026 – March 2027
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {hasStudents && (
          <button
            onClick={onRecordPayment}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>{t.recordPayment}</span>
          </button>
        )}

        <button
          onClick={onAddStudent}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addStudent}</span>
        </button>

        {/* 1-Tap Language Toggle */}
        <button
          onClick={toggleLanguage}
          title="Switch Language / भाषा बदलें"
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
