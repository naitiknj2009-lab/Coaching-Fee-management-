import React, { useState } from 'react';
import { Payment, Student, InstituteSettings } from '../types';
import { db, getSettings } from '../db';
import { useLanguage } from '../context/LanguageContext';
import { ACADEMIC_MONTHS } from '../utils/academicSession';
import { formatCurrency } from '../utils/feeCalculator';
import { exportPaymentReceiptPDF } from '../utils/exportUtils';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Plus, 
  Calendar, 
  User, 
  Hash, 
  FileText,
  AlertCircle 
} from 'lucide-react';

interface PaymentsProps {
  payments: Payment[];
  students: Student[];
  onRecordPayment: () => void;
  onRefresh: () => void;
}

export const Payments: React.FC<PaymentsProps> = ({
  payments,
  students,
  onRecordPayment,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');

  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  // Student Map
  const studentMap = new Map<string, Student>();
  students.forEach(s => studentMap.set(s.id, s));

  // Filter
  const filtered = payments.filter(p => {
    const student = studentMap.get(p.studentId);
    const studentName = student?.name || '';
    const matchSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.transactionId && p.transactionId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;
    if (selectedMonth !== 'all' && p.monthKey !== selectedMonth) return false;
    if (selectedStudent !== 'all' && p.studentId !== selectedStudent) return false;
    if (selectedMethod !== 'all' && p.paymentMethod !== selectedMethod) return false;
    return true;
  });

  // Sort descending by payment date
  const sorted = [...filtered].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

  const handleDelete = async () => {
    if (!paymentToDelete) return;
    await db.payments.delete(paymentToDelete.id);
    setPaymentToDelete(null);
    onRefresh();
  };

  const handlePrintReceipt = async (p: Payment) => {
    const student = studentMap.get(p.studentId);
    const settings = await getSettings();
    exportPaymentReceiptPDF(p, { name: student?.name || 'Student', phone: student?.phone }, settings);
  };

  const totalFilteredAmount = sorted.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Title & Add Payment Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.payments}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Payment transactions, partial installments, and printable fee receipts
          </p>
        </div>

        {students.length > 0 && (
          <button
            onClick={onRecordPayment}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.recordPayment}</span>
          </button>
        )}
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400">Filtered Collection: </span>
          <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400 ml-1">
            {formatCurrency(totalFilteredAmount)}
          </span>
          <span className="text-slate-400 ml-2">({sorted.length} transactions)</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`${t.search} (Name, Ref, Remarks)`}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Month */}
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Months (सभी माह)</option>
          {ACADEMIC_MONTHS.map(m => (
            <option key={m.key} value={m.key}>
              {m.name} {m.year} ({m.hindiName})
            </option>
          ))}
        </select>

        {/* Filter Student */}
        <select
          value={selectedStudent}
          onChange={e => setSelectedStudent(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Students (सभी छात्र)</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Filter Method */}
        <select
          value={selectedMethod}
          onChange={e => setSelectedMethod(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Modes (सभी माध्यम)</option>
          <option value="Cash">{t.cash}</option>
          <option value="UPI">{t.upi}</option>
          <option value="Bank Transfer">{t.bankTransfer}</option>
          <option value="Other">{t.other}</option>
        </select>
      </div>

      {/* Payments List Table */}
      {sorted.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {payments.length === 0 ? t.noRecentPayments : t.noPaymentsFound}
          </p>
          {students.length > 0 && payments.length === 0 && (
            <div className="mt-4">
              <button
                onClick={onRecordPayment}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25"
              >
                <span>{t.recordPayment}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">{t.studentName}</th>
                  <th className="p-3">Fee Month</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Ref / Trans ID</th>
                  <th className="p-3">Remarks</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Receipt</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sorted.map(p => {
                  const student = studentMap.get(p.studentId);
                  const month = ACADEMIC_MONTHS.find(m => m.key === p.monthKey);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {p.paymentDate}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {student?.name || 'Unknown Student'}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {month ? `${month.name} (${month.hindiName})` : p.monthKey}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {p.transactionId || '-'}
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 max-w-[140px] truncate">
                        {p.notes || '-'}
                      </td>
                      <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        +{formatCurrency(p.amount)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handlePrintReceipt(p)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          title="Generate printable PDF receipt"
                        >
                          <Download className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setPaymentToDelete(p)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete transaction record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Payment Modal */}
      {paymentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Delete Payment Record?
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Remove payment of <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(paymentToDelete.amount)}</span> for {studentMap.get(paymentToDelete.studentId)?.name}? Remaining student balance will update automatically.
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <button
                onClick={() => setPaymentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/25"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
