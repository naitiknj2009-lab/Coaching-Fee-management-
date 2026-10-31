import React from 'react';
import { formatCurrency, formatCompactCurrency } from '../utils/exportUtils';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';

interface HeroPerformanceCardProps {
  recognizedVolume: number;
  growthPct: number;
  collectedAmount: number;
  dueAmount: number;
  paidPercentage: number;
  period: string;
}

export const HeroPerformanceCard: React.FC<HeroPerformanceCardProps> = ({
  recognizedVolume,
  growthPct,
  collectedAmount,
  dueAmount,
  paidPercentage,
  period,
}) => {
  // SVG Ring Gauge Calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (paidPercentage / 100) * circumference;

  return (
    <div className="relative -mt-14 max-w-5xl mx-auto z-20">
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-executive-lg hover:shadow-2xl transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Volume & Growth */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recognized Retainer Volume ({period})
              </span>
              <span className="inline-flex items-center text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{growthPct}%
              </span>
            </div>

            <div className="flex items-baseline space-x-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(recognizedVolume)}
              </h1>
            </div>

            {/* Micro Breakdown Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                {formatCompactCurrency(collectedAmount)} collected
              </span>

              <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                {formatCompactCurrency(dueAmount)} due
              </span>

              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium ml-1">
                Avg. DSO: <strong className="text-slate-700 dark:text-slate-300">5.4 days</strong>
              </span>
            </div>
          </div>

          {/* Right: Circular Efficiency Ring Gauge */}
          <div className="flex items-center space-x-4 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/10">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 80 80">
                {/* Track circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">
                  {paidPercentage}%
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
                  Paid
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Collection Velocity
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[140px] leading-tight">
                {paidPercentage >= 80 ? 'Optimal collection rate for high-trust engagements.' : 'Follow-ups recommended for pending balances.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
