import React, { useState, useEffect } from 'react';
import { InstituteSettings } from '../types';
import { getSettings, saveSettings } from '../db';
import { useLanguage } from '../context/LanguageContext';
import { Building2, X } from 'lucide-react';

interface PromptInstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: InstituteSettings) => void;
  title?: string;
}

export const PromptInstituteModal: React.FC<PromptInstituteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}) => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<InstituteSettings | null>(null);
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  useEffect(() => {
    if (isOpen) {
      getSettings().then(s => setSettings(s));
    }
  }, [isOpen]);

  if (!isOpen || !settings) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveAsDefault) {
      saveSettings(settings);
    }
    onConfirm(settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {title || t.instituteDetailsPrompt}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check headers before compiling your document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.instituteName}
            </label>
            <input
              type="text"
              required
              value={settings.instituteName}
              onChange={e => setSettings({ ...settings, instituteName: e.target.value })}
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
              onChange={e => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.tutorName}
              </label>
              <input
                type="text"
                value={settings.tutorName}
                onChange={e => setSettings({ ...settings, tutorName: e.target.value })}
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
                onChange={e => setSettings({ ...settings, contactNumber: e.target.value })}
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
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="saveDefault"
              checked={saveAsDefault}
              onChange={e => setSaveAsDefault(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <label htmlFor="saveDefault" className="text-xs text-slate-600 dark:text-slate-400">
              Save updates as default for future exports
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              {t.continueExport}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
