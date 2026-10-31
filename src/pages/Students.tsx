import React, { useState } from 'react';
import { Student, StudentFeeSummary, InstituteSettings } from '../types';
import { db, getSettings } from '../db';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/feeCalculator';
import { exportStudentStatementPDF } from '../utils/exportUtils';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Phone, 
  Calendar, 
  FileText, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  CreditCard, 
  Eye, 
  Download,
  AlertCircle,
  CheckCircle,
  X,
  ArrowUpDown
} from 'lucide-react';

interface StudentsProps {
  summaries: StudentFeeSummary[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onRecordPayment: (studentId: string) => void;
  onRefresh: () => void;
}

export const Students: React.FC<StudentsProps> = ({
  summaries,
  onAddStudent,
  onEditStudent,
  onRecordPayment,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'joiningDate' | 'balance'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Student Profile Drawer
  const [selectedSummary, setSelectedSummary] = useState<StudentFeeSummary | null>(null);

  // Delete confirmation
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Filtering
  const filtered = summaries.filter(s => {
    const matchSearch = s.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.student.phone && s.student.phone.includes(searchQuery));

    if (!matchSearch) return false;

    if (statusFilter === 'active') return s.student.isActive;
    if (statusFilter === 'inactive') return !s.student.isActive;
    if (statusFilter === 'pending') return s.totalBalance > 0;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') {
      cmp = a.student.name.localeCompare(b.student.name);
    } else if (sortBy === 'joiningDate') {
      cmp = (a.student.joiningDate || '').localeCompare(b.student.joiningDate || '');
    } else if (sortBy === 'balance') {
      cmp = a.totalBalance - b.totalBalance;
    }
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const handleDelete = async () => {
    if (!studentToDelete) return;
    // Delete payments and fee records for this student
    await db.payments.where('studentId').equals(studentToDelete.id).delete();
    await db.monthlyFees.where('studentId').equals(studentToDelete.id).delete();
    await db.students.delete(studentToDelete.id);
    setStudentToDelete(null);
    if (selectedSummary?.student.id === studentToDelete.id) {
      setSelectedSummary(null);
    }
    onRefresh();
  };

  const handleExportStatement = async (summary: StudentFeeSummary) => {
    const settings = await getSettings();
    exportStudentStatementPDF(summary, settings);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.students}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage student records, individual monthly fees, and payment ledgers
          </p>
        </div>
        <button
          onClick={onAddStudent}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addStudent}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`${t.search} (Name or phone)`}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl shadow-sm">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.all} ({summaries.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'active'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.active} ({summaries.filter(s => s.student.isActive).length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'pending'
                ? 'bg-red-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending ({summaries.filter(s => s.totalBalance > 0).length})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'inactive'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.inactive} ({summaries.filter(s => !s.student.isActive).length})
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="joiningDate">Sort by Joining Date</option>
            <option value="balance">Sort by Balance</option>
          </select>
          <button
            onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            title="Toggle sort direction"
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Student List */}
      {sorted.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {summaries.length === 0 ? t.noStudentsFound : 'No students matching the filter criteria.'}
          </p>
          {summaries.length === 0 && (
            <div className="mt-4">
              <button
                onClick={onAddStudent}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25"
              >
                <span>{t.addFirstStudent}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(s => {
            const hasPending = s.totalBalance > 0;
            return (
              <div
                key={s.student.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      s.student.isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {s.student.isActive ? t.active : t.inactive}
                    </span>

                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      Fee: {formatCurrency(s.student.monthlyFee)}/mo
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {s.student.name}
                  </h3>

                  {/* Info Meta */}
                  <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Joined: {s.student.joiningDate || '-'}</span>
                    </div>
                    {s.student.phone && (
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{s.student.phone}</span>
                      </div>
                    )}
                    {s.student.notes && (
                      <div className="flex items-center space-x-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{s.student.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Stats */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[11px]">Paid</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(s.totalPaid)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 text-[11px]">Balance</span>
                      <p className={`font-bold ${hasPending ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {formatCurrency(s.totalBalance)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => onRecordPayment(s.student.id)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay</span>
                  </button>

                  <button
                    onClick={() => setSelectedSummary(s)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Statement</span>
                  </button>

                  <button
                    onClick={() => onEditStudent(s.student)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title={t.editStudent}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setStudentToDelete(s.student)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title={t.deleteStudent}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Individual Student Profile Modal / Ledger Drawer */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {selectedSummary.student.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Individual Student Ledger • Academic Session 2026–27
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExportStatement(selectedSummary)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedSummary(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Joining Date</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {selectedSummary.student.joiningDate || '-'}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Base Monthly Fee</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(selectedSummary.student.monthlyFee)}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Total Paid</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatCurrency(selectedSummary.totalPaid)}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Remaining Balance</span>
                <p className={`font-semibold mt-0.5 ${selectedSummary.totalBalance > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>
                  {formatCurrency(selectedSummary.totalBalance)}
                </p>
              </div>
            </div>

            {/* Monthly Ledger Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sticky top-0">
                  <tr>
                    <th className="p-2.5 font-semibold">Month</th>
                    <th className="p-2.5 font-semibold">Expected</th>
                    <th className="p-2.5 font-semibold">Received</th>
                    <th className="p-2.5 font-semibold">Balance</th>
                    <th className="p-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedSummary.monthCalculations.map(m => (
                    <tr key={m.monthKey} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-medium text-slate-900 dark:text-white">
                        {m.monthName} ({m.hindiName})
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">
                        {formatCurrency(m.expectedFee)}
                      </td>
                      <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(m.amountPaid)}
                      </td>
                      <td className="p-2.5 font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(m.remainingBalance)}
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'PAID'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : m.status === 'NOT_JOINED'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            : m.status === 'NOT_OVER'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedSummary(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              {t.confirmDelete}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Delete <span className="font-semibold text-slate-900 dark:text-white">"{studentToDelete.name}"</span> and all their recorded payments? {t.deleteWarning}
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/25"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
