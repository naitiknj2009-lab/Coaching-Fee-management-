import React from 'react';
import { StudentFeeSummary, Payment } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/feeCalculator';
import { ACADEMIC_MONTHS } from '../utils/academicSession';
import { 
  Users, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  CreditCard
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  summaries: StudentFeeSummary[];
  payments: Payment[];
  onAddStudent: () => void;
  onRecordPayment: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summaries,
  payments,
  onAddStudent,
  onRecordPayment,
  onNavigateToTab,
}) => {
  const { t } = useLanguage();

  const totalStudents = summaries.length;
  const activeStudents = summaries.filter(s => s.student.isActive).length;
  const totalExpected = summaries.reduce((acc, s) => acc + s.totalExpected, 0);
  const totalCollected = summaries.reduce((acc, s) => acc + s.totalPaid, 0);
  const totalPending = summaries.reduce((acc, s) => acc + s.totalBalance, 0);
  const studentsWithPending = summaries.filter(s => s.totalBalance > 0).length;

  // Current month collection
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthPayments = payments.filter(p => p.monthKey === currentMonthKey);
  const currentMonthCollection = currentMonthPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  // Collection percentage
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  // Monthly breakdown for chart
  const chartData = ACADEMIC_MONTHS.map(m => {
    const monthPayments = payments.filter(p => p.monthKey === m.key);
    const collected = monthPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const expected = summaries.reduce((acc, s) => {
      const monthCalc = s.monthCalculations.find(mc => mc.monthKey === m.key);
      return acc + (monthCalc?.expectedFee || 0);
    }, 0);
    return {
      name: m.name.substring(0, 3),
      fullName: m.name,
      collected,
      expected,
    };
  });

  // Recent payments
  const sortedPayments = [...payments].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 6);

  // Pending students list
  const pendingStudents = summaries
    .filter(s => s.totalBalance > 0)
    .sort((a, b) => b.totalBalance - a.totalBalance)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 lg:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Session 2026–27 (June – March)</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            {t.appName}
          </h2>
          <p className="mt-1.5 text-sm text-blue-100/90 leading-relaxed">
            Monitor tuition enrollments, individual variable fees, installment ledgers, and financial balances in real time.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onAddStudent}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all active:scale-95"
            >
              <span>{totalStudents === 0 ? t.addFirstStudent : t.addStudent}</span>
            </button>
            {totalStudents > 0 && (
              <button
                onClick={onRecordPayment}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600/60 hover:bg-blue-600 border border-white/20 text-white transition-all active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>{t.recordPayment}</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient Decorative Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none blur-2xl"></div>
      </div>

      {/* Metrics Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Total Students */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalStudents}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {totalStudents}
          </div>
          <div className="mt-1 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 mr-1">{activeStudents}</span>
            <span>{t.activeStudents.toLowerCase()}</span>
          </div>
        </div>

        {/* Expected Fees */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalExpectedFees}
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalExpected)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across enrolled months
          </div>
        </div>

        {/* Collected Fees */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalFeesCollected}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalCollected)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600">{collectionRate}%</span> {t.collectionProgress.toLowerCase()}
          </div>
        </div>

        {/* Total Pending */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalPendingFees}
            </span>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalPending)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-red-600">{studentsWithPending}</span> {t.studentsWithPending.toLowerCase()}
          </div>
        </div>
      </div>

      {/* Metrics Row 2 (Current Month & Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.currentMonthCollection}
            </span>
            <div className="mt-1.5 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {formatCurrency(currentMonthCollection)}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Recorded payments in ongoing cycle ({currentMonthKey})
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span>{t.feeCollectionOverview}</span>
              <span className="font-bold text-slate-900 dark:text-white">{collectionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, collectionRate))}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Received: {formatCurrency(totalCollected)}</span>
              <span>Pending: {formatCurrency(totalPending)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Banner if no students */}
      {totalStudents === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            {t.noStudentsFound}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Your database starts completely clean without any sample records. Add your students manually to start tracking their monthly attendance, variable fees, and payment status.
          </p>
          <div className="mt-5">
            <button
              onClick={onAddStudent}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>{t.addFirstStudent}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Charts and Activity Grids */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Collection Bar Chart */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t.monthlyCollectionChart}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Month-by-month fee collection comparison (June 2026 - March 2027)
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('feeRegister')}
                className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <span>Register</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="collected" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Collected" />
                  <Bar dataKey="expected" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Expected" opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Payments & Outstanding list */}
          <div className="space-y-6">
            {/* Recent Payments */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t.recentPayments}
                </h3>
                <button
                  onClick={() => onNavigateToTab('payments')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View All
                </button>
              </div>

              {sortedPayments.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">
                  {t.noRecentPayments}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {sortedPayments.map(p => {
                    const student = summaries.find(s => s.student.id === p.studentId)?.student;
                    return (
                      <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {student?.name || 'Student'}
                          </p>
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{p.paymentDate}</span>
                            <span>•</span>
                            <span>{p.paymentMethod}</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(p.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Outstanding Balances */}
            {pendingStudents.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Highest Pending Balances
                  </h3>
                  <button
                    onClick={() => onNavigateToTab('students')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  {pendingStudents.map(s => (
                    <div key={s.student.id} className="flex items-center justify-between p-2 rounded-xl bg-red-50/50 dark:bg-red-950/20 text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {s.student.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5">
                          ({s.pendingMonthsCount} mo. pending)
                        </span>
                      </div>
                      <span className="font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(s.totalBalance)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
