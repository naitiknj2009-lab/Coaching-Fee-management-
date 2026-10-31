import React from 'react';
import { Invoice, Client, PracticeProfile } from '../types';
import { formatCurrency, formatCompactCurrency } from '../utils/exportUtils';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award, 
  Zap, 
  Building, 
  FileDown,
  ArrowUpRight 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface ReportsViewProps {
  invoices: Invoice[];
  clients: Client[];
  profile: PracticeProfile;
  onExportReport: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  invoices,
  clients,
  profile,
  onExportReport,
}) => {
  const totalVolume = invoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
  const collectionRate = totalVolume > 0 ? Math.round((totalCollected / totalVolume) * 100) : 0;

  // Revenue Velocity by Month/Quarter
  const revenueTrendData = [
    { period: 'Jul 24', revenue: 16500, collected: 16500 },
    { period: 'Aug 24', revenue: 21000, collected: 21000 },
    { period: 'Sep 24', revenue: 27500, collected: 27500 },
    { period: 'Oct 24', revenue: 31750, collected: 26750 },
    { period: 'Nov 24', revenue: 35000, collected: 29500 },
    { period: 'Dec 24 (Proj)', revenue: 38250, collected: 32000 },
  ];

  // Revenue by Package Breakdown
  const packageMap: Record<string, number> = {};
  invoices.forEach(inv => {
    packageMap[inv.packageName] = (packageMap[inv.packageName] || 0) + inv.amount;
  });

  const packageColors = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#10b981'];
  const packageData = Object.entries(packageMap).map(([name, value], idx) => ({
    name: name.replace('Executive ', '').replace(' Retainer', ''),
    fullName: name,
    value,
    color: packageColors[idx % packageColors.length],
  }));

  // Top clients by LTV
  const topClients = [...clients].sort((a, b) => b.ltv - a.ltv).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-2">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Executive Analytics & Practice Metrics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Revenue velocity, Days Sales Outstanding (DSO), and Client LTV distribution
          </p>
        </div>

        <button
          onClick={onExportReport}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <FileDown className="w-4 h-4" />
          <span>Download CPA Audit Report</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DSO (Velocity)</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            5.4 Days
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            Target &lt; 6 days (Optimal)
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reminder Conversion</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            78.5%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            Settled within 24h
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Collection Efficiency</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {collectionRate}%
          </div>
          <span className="text-[11px] text-slate-400">
            {formatCompactCurrency(totalCollected)} of {formatCompactCurrency(totalVolume)}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Retainer LTV</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            $28.1k
          </div>
          <span className="text-[11px] text-slate-400">
            Across active roster
          </span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="mb-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Revenue Growth & Collection Velocity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly billings vs. settled cash acceleration
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Settled Cash" />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Recognized Volume" opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Corporate Clients by LTV */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
              Top Retainers by LTV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Long-standing corporate leadership clients
            </p>

            <div className="space-y-3">
              {topClients.map((client, idx) => (
                <div key={client.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {client.name}
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold">#{idx + 1}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{client.company}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      {formatCurrency(client.ltv)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {formatCurrency(client.retainerFee)}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
