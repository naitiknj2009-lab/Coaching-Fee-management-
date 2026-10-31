import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { db } from '../db';
import { useLanguage } from '../context/LanguageContext';
import { User, Phone, Calendar, Banknote, FileText, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
  onSaved?: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
  onSaved,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [joiningDate, setJoiningDate] = useState('2026-06-01');
  const [monthlyFee, setMonthlyFee] = useState<number>(1000);
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setJoiningDate(studentToEdit.joiningDate);
      setMonthlyFee(studentToEdit.monthlyFee);
      setPhone(studentToEdit.phone || '');
      setNotes(studentToEdit.notes || '');
      setIsActive(studentToEdit.isActive);
    } else {
      setName('');
      setJoiningDate('2026-06-01');
      setMonthlyFee(1000);
      setPhone('');
      setNotes('');
      setIsActive(true);
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (studentToEdit) {
      await db.students.update(studentToEdit.id, {
        name: name.trim(),
        joiningDate,
        monthlyFee: Number(monthlyFee),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        isActive,
      });
    } else {
      const newStudent: Student = {
        id: 'std_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name: name.trim(),
        joiningDate,
        monthlyFee: Number(monthlyFee),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        isActive,
        createdAt: new Date().toISOString(),
      };
      await db.students.add(newStudent);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch {}
    }

    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {studentToEdit ? t.editStudent : t.addStudent}
            </h3>
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
              {t.studentName} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.joiningDate} *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={joiningDate}
                  onChange={e => setJoiningDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.monthlyFee} (₹) *
              </label>
              <div className="relative">
                <Banknote className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="0"
                  step="50"
                  value={monthlyFee}
                  onChange={e => setMonthlyFee(Number(e.target.value))}
                  placeholder="1000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.phoneNumber}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.notes}
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Class/Batch, Subject, Parent Name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Student Status
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                {isActive ? t.active : t.inactive}
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-white/10">
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
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
