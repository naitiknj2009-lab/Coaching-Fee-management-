import React, { useState } from 'react';
import { db, getSettings } from '../db';
import { useLanguage } from '../context/LanguageContext';
import { 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText,
  RefreshCw 
} from 'lucide-react';

interface BackupRestoreProps {
  onDataRestored: () => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({ onDataRestored }) => {
  const { t } = useLanguage();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingBackupData, setPendingBackupData] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportBackup = async () => {
    try {
      const students = await db.students.toArray();
      const monthlyFees = await db.monthlyFees.toArray();
      const payments = await db.payments.toArray();
      const settings = await getSettings();

      const backup = {
        app: 'Coaching Fee Manager',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        session: settings.session || '2026–27',
        data: {
          students,
          monthlyFees,
          payments,
          settings,
        },
      };

      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CoachingFeeManager_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setImportError('Failed to generate JSON backup.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || !parsed.data || !Array.isArray(parsed.data.students)) {
          setImportError('Invalid backup file structure: missing data array.');
          return;
        }
        setPendingBackupData(parsed);
      } catch (err) {
        setImportError('Failed to parse JSON file. Ensure the file is not corrupted.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmRestore = async () => {
    if (!pendingBackupData) return;
    setIsProcessing(true);
    setImportError(null);

    try {
      const { students, monthlyFees, payments, settings } = pendingBackupData.data;

      await db.transaction('rw', db.students, db.monthlyFees, db.payments, db.settings, async () => {
        await db.students.clear();
        await db.monthlyFees.clear();
        await db.payments.clear();

        if (students?.length > 0) {
          await db.students.bulkAdd(students);
        }
        if (monthlyFees?.length > 0) {
          await db.monthlyFees.bulkAdd(monthlyFees);
        }
        if (payments?.length > 0) {
          await db.payments.bulkAdd(payments);
        }
        if (settings) {
          await db.settings.put({ key: 'institute_settings', value: settings });
        }
      });

      setImportStatus(t.restoreSuccess);
      setPendingBackupData(null);
      onDataRestored();
    } catch (err: any) {
      console.error(err);
      setImportError(`Failed to restore data: ${err?.message || 'Database transaction failed.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.backupRestore}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Secure, zero-dependency offline backup & instant restore of all tuition records
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {importError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{importError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Backup Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t.exportBackup}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Downloads a complete JSON file containing all students, variable monthly fee schedules, payment records, and institute settings.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={handleExportBackup}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup File (.json)</span>
            </button>
          </div>
        </div>

        {/* Import Backup Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t.importBackup}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Restore previously exported data. You will be able to review the contents of the backup before applying it to your database.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
            <label className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Select Backup File (.json)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            Zero External Tracking & 100% Privacy
          </p>
          <p className="mt-0.5 text-slate-500 dark:text-slate-400">
            Your coaching fee records stay strictly on your device inside IndexedDB. Backups are downloaded directly through your browser or Android WebView without passing through external servers.
          </p>
        </div>
      </div>

      {/* Restore Preview & Confirmation Dialog */}
      {pendingBackupData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400 pb-3 border-b border-slate-100 dark:border-white/10">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Confirm Backup Restore
              </h3>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You are about to restore a database backup created on{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {new Date(pendingBackupData.exportedAt).toLocaleString()}
              </span>.
            </p>

            <div className="my-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Session:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{pendingBackupData.session || '2026–27'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Students to Restore:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{pendingBackupData.data?.students?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payments to Restore:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{pendingBackupData.data?.payments?.length || 0}</span>
              </div>
            </div>

            <p className="text-[11px] text-red-500 font-medium">
              Warning: Restoring this backup will replace current records with the contents of this file.
            </p>

            <div className="mt-5 flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPendingBackupData(null)}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={confirmRestore}
                disabled={isProcessing}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Restoring...</span>
                  </>
                ) : (
                  <span>Restore Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
