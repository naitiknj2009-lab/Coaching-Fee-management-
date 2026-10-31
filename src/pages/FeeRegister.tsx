import React, { useState } from 'react';
import { StudentFeeSummary, MonthCalculation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ACADEMIC_MONTHS } from '../utils/academicSession';
import { formatCurrency } from '../utils/feeCalculator';
import { PromptInstituteModal } from '../components/PromptInstituteModal';
import { exportYearlyRegisterPDF } from '../utils/exportUtils';
import { 
  TableProperties, 
  Download, 
  Search, 
  HelpCircle, 
  CreditCard, 
  Info, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Minus 
} from 'lucide-react';

interface FeeRegisterProps {
  summaries: StudentFeeSummary[];
  onAddStudent: () => void;
  onRecordPaymentForCell: (studentId: string, monthKey: string) => void;
}

export const FeeRegister: React.FC<FeeRegisterProps> = ({
  summaries,
  onAddStudent,
  onRecordPaymentForCell,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCell, setSelectedCell] = useState<{
    summary: StudentFeeSummary;
    monthCalc: MonthCalculation;
  } | null>(null);

  const [isExportPromptOpen, setIsExportPromptOpen] = useState(false);

  // Active current month key for highlighting
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filteredSummaries = summaries.filter(s =>
    s.student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (m: MonthCalculation) => {
    switch (m.status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            ✅ {t.paid.split(' ')[0]}
          </span>
        );
      case 'UNPAID':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300">
            ❌ {m.amountPaid > 0 ? `BAL ₹${m.remainingBalance}` : t.unpaid.split(' ')[0]}
          </span>
        );
      case 'NOT_JOINED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            ➖ N/J
          </span>
        );
      case 'NOT_OVER':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            ❗ {t.monthNotOver.split(' ')[0]}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.feeRegister}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              Session 2026–27
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            10-Month Digital Ledger (June 2026 to March 2027) • Interactive cell tap to log payments
          </p>
        </div>

        {summaries.length > 0 && (
          <button
            onClick={() => setIsExportPromptOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export A4 Landscape PDF</span>
          </button>
        )}
      </div>

      {/* Legend Card (English and Hindi) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{t.statusLegend}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="flex items-start space-x-2 p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <span className="text-base leading-none">✅</span>
            <div>
              <p className="font-bold text-emerald-800 dark:text-emerald-300">{t.paid}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.paidDesc}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-2 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
            <span className="text-base leading-none">❌</span>
            <div>
              <p className="font-bold text-red-800 dark:text-red-300">{t.unpaid}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.unpaidDesc}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-base leading-none">➖</span>
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300">{t.notJoined}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.notJoinedDesc}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
            <span className="text-base leading-none">❗</span>
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-300">{t.monthNotOver}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.monthNotOverDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Register Table Container */}
      {summaries.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <TableProperties className="w-7 h-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            The Fee Register is Empty
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No students are currently enrolled. Add your first student with their individual joining date and variable monthly fee to initialize the master register.
          </p>
          <div className="mt-5">
            <button
              onClick={onAddStudent}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25"
            >
              <span>{t.addFirstStudent}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Search bar */}
          <div className="p-3.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter register by student..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Showing {filteredSummaries.length} of {summaries.length} students
            </span>
          </div>

          {/* Horizontally Scrollable Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[980px]">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 w-44 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {t.studentName}
                  </th>
                  <th className="p-3 whitespace-nowrap text-center">
                    {t.joiningDate}
                  </th>
                  {ACADEMIC_MONTHS.map(m => {
                    const isCurrent = m.key === currentMonthKey;
                    return (
                      <th
                        key={m.key}
                        className={`p-2.5 text-center whitespace-nowrap ${
                          isCurrent ? 'bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : ''
                        }`}
                      >
                        <div>{m.name}</div>
                        <div className="text-[10px] font-normal opacity-80">{m.hindiName}</div>
                      </th>
                    );
                  })}
                  <th className="p-3 text-right whitespace-nowrap">Expected</th>
                  <th className="p-3 text-right whitespace-nowrap text-emerald-600 dark:text-emerald-400">Received</th>
                  <th className="p-3 text-right whitespace-nowrap text-red-600 dark:text-red-400">Balance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSummaries.map(s => (
                  <tr key={s.student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Sticky Student Name Column */}
                    <td className="p-3 font-semibold text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-slate-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] truncate max-w-[176px]">
                      <div className="truncate">{s.student.name}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {formatCurrency(s.student.monthlyFee)}/mo
                      </div>
                    </td>

                    {/* Joining Date */}
                    <td className="p-3 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {s.student.joiningDate || '-'}
                    </td>

                    {/* 10 Academic Months */}
                    {s.monthCalculations.map(m => {
                      const isCurrent = m.monthKey === currentMonthKey;
                      return (
                        <td
                          key={m.monthKey}
                          onClick={() => setSelectedCell({ summary: s, monthCalc: m })}
                          className={`p-2 text-center cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-inset transition-all ${
                            isCurrent ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                          }`}
                          title={`${s.student.name} - ${m.monthName}: Click to view or record payment`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            {getStatusBadge(m)}
                            {m.amountPaid > 0 && (
                              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                                ₹{m.amountPaid}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Totals */}
                    <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatCurrency(s.totalExpected)}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatCurrency(s.totalPaid)}
                    </td>
                    <td className="p-3 text-right font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                      {formatCurrency(s.totalBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Month Cell Details Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedCell.summary.student.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCell.monthCalc.monthName} {selectedCell.monthCalc.monthKey.split('-')[0]} ({selectedCell.monthCalc.hindiName})
                </p>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-slate-400">Expected</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatCurrency(selectedCell.monthCalc.expectedFee)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Paid</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatCurrency(selectedCell.monthCalc.amountPaid)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Balance</span>
                  <p className={`font-bold mt-0.5 ${selectedCell.monthCalc.remainingBalance > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-600'}`}>
                    {formatCurrency(selectedCell.monthCalc.remainingBalance)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="text-slate-500">Current Status:</span>
                <div>{getStatusBadge(selectedCell.monthCalc)}</div>
              </div>

              {selectedCell.monthCalc.payments.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Payments recorded for this month:
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {selectedCell.monthCalc.payments.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-[11px]">
                        <span>{p.paymentDate} ({p.paymentMethod})</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(p.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
              {!selectedCell.monthCalc.isNotJoined && (
                <button
                  onClick={() => {
                    const studentId = selectedCell.summary.student.id;
                    const mKey = selectedCell.monthCalc.monthKey;
                    setSelectedCell(null);
                    onRecordPaymentForCell(studentId, mKey);
                  }}
                  className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Log Payment for this Month</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Institute Header Confirmation Prompt */}
      <PromptInstituteModal
        isOpen={isExportPromptOpen}
        onClose={() => setIsExportPromptOpen(false)}
        title="Confirm Header for Yearly Fee Register PDF"
        onConfirm={(settings) => {
          setIsExportPromptOpen(false);
          exportYearlyRegisterPDF(summaries, settings);
        }}
      />
    </div>
  );
};
