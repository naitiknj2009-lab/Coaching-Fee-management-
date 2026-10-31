import React, { useState } from 'react';
import { RetainerCadence } from '../types';
import { Filter, X, Check, RotateCcw } from 'lucide-react';

export interface AdvancedFilterState {
  amountBracket: 'ALL' | 'UNDER_4K' | '4K_TO_6K' | 'OVER_6K';
  cadence: 'ALL' | RetainerCadence;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedFilterState;
  onApplyFilters: (filters: AdvancedFilterState) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<AdvancedFilterState>(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Ledger Advanced Filters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-4 text-xs">
          {/* Amount Bracket */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Retainer Fee Bracket
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ALL', label: 'All Amounts' },
                { id: 'UNDER_4K', label: '< $4,000 / mo' },
                { id: '4K_TO_6K', label: '$4,000 – $6,000' },
                { id: 'OVER_6K', label: '> $6,000 / mo' },
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, amountBracket: b.id as any })}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition-all ${
                    localFilters.amountBracket === b.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cadence */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Engagement Cadence
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ALL', label: 'All Cadences' },
                { id: 'Monthly', label: 'Monthly Retainer' },
                { id: 'Sprint', label: 'Sprint' },
                { id: 'Bi-Weekly', label: 'Bi-Weekly' },
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, cadence: c.id as any })}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold transition-all ${
                    localFilters.cadence === c.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
