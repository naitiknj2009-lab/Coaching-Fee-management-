import React, { useState, useEffect } from 'react';
import { Student, Payment, PaymentMethod } from '../types';
import { db, getSettings } from '../db';
import { useLanguage } from '../context/LanguageContext';
import { ACADEMIC_MONTHS } from '../utils/academicSession';
import { exportPaymentReceiptPDF } from '../utils/exportUtils';
import { formatCurrency } from '../utils/feeCalculator';
import { CreditCard, Calendar, Banknote, User, Hash, FileText, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  preselectedStudentId?: string;
  preselectedMonthKey?: string;
  onPaymentSaved?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  students,
  preselectedStudentId,
  preselectedMonthKey,
  onPaymentSaved,
}) => {
  const { t } = useLanguage();
  const [studentId, setStudentId] = useState('');
  const [monthKey, setMonthKey] = useState('2026-06');
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [downloadReceipt, setDownloadReceipt] = useState(true);

  // Month balance preview
  const [expectedFee, setExpectedFee] = useState<number>(0);
  const [alreadyPaid, setAlreadyPaid] = useState<number>(0);

  useEffect(() => {
    if (preselectedStudentId) {
      setStudentId(preselectedStudentId);
    } else if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
    if (preselectedMonthKey) {
      setMonthKey(preselectedMonthKey);
    }
  }, [preselectedStudentId, preselectedMonthKey, students, isOpen]);

  // Recalculate preview
  useEffect(() => {
    const student = students.find(s => s.id === studentId);
    if (!student || !monthKey) return;

    let isMounted = true;
    (async () => {
      const explicitRec = await db.monthlyFees.get(`${studentId}_${monthKey}`);
      const expected = explicitRec ? explicitRec.expectedFee : student.monthlyFee;

      const payments = await db.payments.where('studentId').equals(studentId).toArray();
      const monthPayments = payments.filter(p => p.monthKey === monthKey);
      const paid = monthPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

      if (isMounted) {
        setExpectedFee(expected);
        setAlreadyPaid(paid);
        const rem = Math.max(0, expected - paid);
        setAmount(rem > 0 ? rem : expected);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [studentId, monthKey, students]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || amount <= 0) return;

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newPayment: Payment = {
      id: 'pay_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      studentId,
      monthKey,
      amount: Number(amount),
      paymentDate,
      paymentMethod,
      transactionId: transactionId.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await db.payments.add(newPayment);

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch {}

    if (downloadReceipt) {
      const settings = await getSettings();
      exportPaymentReceiptPDF(newPayment, { name: student.name, phone: student.phone }, settings);
    }

    onPaymentSaved?.();
    onClose();
  };

  const remaining = Math.max(0, expectedFee - alreadyPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {t.recordPayment}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log fee collection, partial payment, or advance
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.studentName} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  required
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatCurrency(s.monthlyFee)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fee Month *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  required
                  value={monthKey}
                  onChange={e => setMonthKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                >
                  {ACADEMIC_MONTHS.map(m => (
                    <option key={m.key} value={m.key}>
                      {m.name} {m.year} ({m.hindiName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Month Status Pill */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Expected: </span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(expectedFee)}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Already Paid: </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(alreadyPaid)}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Remaining: </span>
              <span className={`font-semibold ${remaining > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'}`}>
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.amount} (₹) *
              </label>
              <div className="relative">
                <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="1"
                  step="10"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.paymentDate} *
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.paymentMethod} *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="Cash">{t.cash}</option>
                <option value="UPI">{t.upi}</option>
                <option value="Bank Transfer">{t.bankTransfer}</option>
                <option value="Other">{t.other}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.transactionId}
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="UPI / Ref / Check #"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.notes}
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Remarks or partial payment note"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="downloadReceipt"
              checked={downloadReceipt}
              onChange={e => setDownloadReceipt(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <label htmlFor="downloadReceipt" className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" />
              Generate printable PDF receipt immediately
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
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              Confirm & Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
