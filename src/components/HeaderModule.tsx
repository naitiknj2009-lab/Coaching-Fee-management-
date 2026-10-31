import React from 'react';
import { PracticeProfile } from '../types';
import { Bell, QrCode, ChevronDown, CheckCircle2 } from 'lucide-react';

interface HeaderModuleProps {
  profile: PracticeProfile;
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  onOpenNotifications: () => void;
  onOpenQR: () => void;
  unreadCount: number;
}

export const HeaderModule: React.FC<HeaderModuleProps> = ({
  profile,
  selectedPeriod,
  onSelectPeriod,
  onOpenNotifications,
  onOpenQR,
  unreadCount,
}) => {
  const periods = ['Q4 2024', 'Q3 2024', 'Q2 2024', 'YTD 2024'];

  return (
    <header className="relative bg-gradient-to-b from-[#0c1a30] via-[#0f213d] to-[#152745] text-white pt-6 pb-20 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 rounded-b-[2rem] shadow-xl overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top Bar Chrome */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-lg text-white">
                LedgerCoach
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30">
                {profile.tagline}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs text-slate-300 font-medium">
                {profile.coachName}
              </span>
              <span className="inline-flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                {profile.partnerStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Fiscal Period Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={e => onSelectPeriod(e.target.value)}
                className="appearance-none bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer backdrop-blur-md transition-all"
              >
                {periods.map(p => (
                  <option key={p} value={p} className="bg-slate-900 text-white">
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* QR Quick-Scan Button */}
            <button
              onClick={onOpenQR}
              title="Quick-Scan / In-person payment link"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 backdrop-blur-md transition-all"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* In-app Notification Bell */}
            <button
              onClick={onOpenNotifications}
              title="Alerts & Follow-up Logs"
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 backdrop-blur-md transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#0c1a30] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
