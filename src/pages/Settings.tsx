import React, { useState, useEffect } from 'react';
import { InstituteSettings } from '../types';
import { db, getSettings, saveSettings } from '../db';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Globe, 
  Moon, 
  Sun, 
  Save, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';

interface SettingsProps {
  onRefresh: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onRefresh }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [settings, setSettingsState] = useState<InstituteSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    getSettings().then(s => setSettingsState(s));
  }, []);

  if (!settings) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleResetData = async () => {
    await db.students.clear();
    await db.monthlyFees.clear();
    await db.payments.clear();
    setShowResetDialog(false);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.settings}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Coaching center information, academic defaults, theme, and language
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Coaching Center Profile Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-white/10">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Coaching Institute Profile (PDF & Receipt Headers)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.instituteName}
            </label>
            <input
              type="text"
              required
              value={settings.instituteName}
              onChange={e => setSettingsState({ ...settings, instituteName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.tagline}
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={e => setSettingsState({ ...settings, tagline: e.target.value })}
              placeholder="e.g. CBSE & State Board Tutors / Class IX - XII"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.tutorName}
              </label>
              <input
                type="text"
                value={settings.tutorName}
                onChange={e => setSettingsState({ ...settings, tutorName: e.target.value })}
                placeholder="e.g. Prof. R. K. Sharma"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.contactNumber}
              </label>
              <input
                type="text"
                value={settings.contactNumber}
                onChange={e => setSettingsState({ ...settings, contactNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.address}
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={e => setSettingsState({ ...settings, address: e.target.value })}
              placeholder="e.g. 12/4 Near Gandhi Chowk, Kota"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Academic Session & Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-white/10">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Application Preferences & Academic Session
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Academic Session
              </label>
              <input
                type="text"
                disabled
                value={settings.session}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">June 2026 to March 2027</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Default Monthly Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={settings.defaultMonthlyFee}
                onChange={e => setSettingsState({ ...settings, defaultMonthlyFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Theme selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t.theme}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['system', 'light', 'dark'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setTheme(mode);
                    setSettingsState({ ...settings, theme: mode });
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize flex items-center justify-center space-x-1.5 transition-all ${
                    theme === mode
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {mode === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : mode === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Globe className="w-3.5 h-3.5" />}
                  <span>{mode === 'system' ? t.systemMode : mode === 'light' ? t.lightMode : t.darkMode}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t.language}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['en', 'hi'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setLanguage(l);
                    setSettingsState({ ...settings, language: l });
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    language === l
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>{l === 'en' ? 'English (अंग्रेज़ी)' : 'हिन्दी (Hindi)'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t.save}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Database */}
      <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
        <h4 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center space-x-2">
          <Trash2 className="w-4 h-4" />
          <span>Reset Database (Zero Data State)</span>
        </h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Permanently clear all enrolled students, monthly fee schedules, and payment transactions. Returns application to its initial empty database state.
        </p>
        <button
          type="button"
          onClick={() => setShowResetDialog(true)}
          className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm shadow-red-500/20"
        >
          Reset All Student & Fee Records
        </button>
      </div>

      {/* Confirm Reset Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Confirm Complete Data Reset?
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              This will permanently wipe all students and payments from your local IndexedDB storage. Are you sure you want to proceed?
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <button
                onClick={() => setShowResetDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/25"
              >
                Yes, Wipe All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
