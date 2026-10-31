import React, { useState } from 'react';
import { PracticeProfile } from '../types';
import { QrCode, X, Copy, Check, ExternalLink, Share2 } from 'lucide-react';

interface QRQuickScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PracticeProfile;
}

export const QRQuickScanModal: React.FC<QRQuickScanModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [copied, setCopied] = useState(false);
  const paymentLink = `https://ledgercoach.app/pay/${encodeURIComponent(profile.coachName.toLowerCase().replace(/\s+/g, '-'))}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2 text-left">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                In-Person Retainer QR
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct client scan at offsites & executive retreats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="my-5 p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-inner inline-block">
          {/* Stylized high-res QR SVG representation */}
          <svg className="w-44 h-44 mx-auto text-[#0c1a30]" viewBox="0 0 100 100" fill="currentColor">
            {/* Top-left corner */}
            <rect x="5" y="5" width="25" height="25" fill="#0c1a30" rx="3" />
            <rect x="9" y="9" width="17" height="17" fill="#ffffff" rx="2" />
            <rect x="13" y="13" width="9" height="9" fill="#1e3a8a" rx="1.5" />

            {/* Top-right corner */}
            <rect x="70" y="5" width="25" height="25" fill="#0c1a30" rx="3" />
            <rect x="74" y="9" width="17" height="17" fill="#ffffff" rx="2" />
            <rect x="78" y="13" width="9" height="9" fill="#1e3a8a" rx="1.5" />

            {/* Bottom-left corner */}
            <rect x="5" y="70" width="25" height="25" fill="#0c1a30" rx="3" />
            <rect x="9" y="74" width="17" height="17" fill="#ffffff" rx="2" />
            <rect x="13" y="78" width="9" height="9" fill="#1e3a8a" rx="1.5" />

            {/* Alignment and data blocks */}
            <rect x="36" y="8" width="6" height="6" />
            <rect x="48" y="8" width="6" height="6" />
            <rect x="58" y="12" width="6" height="6" />
            <rect x="36" y="20" width="6" height="6" />
            <rect x="48" y="20" width="12" height="6" />

            <rect x="8" y="36" width="6" height="6" />
            <rect x="20" y="36" width="6" height="6" />
            <rect x="34" y="34" width="10" height="10" fill="#1e3a8a" />
            <rect x="50" y="34" width="10" height="10" />
            <rect x="66" y="36" width="8" height="6" />
            <rect x="80" y="36" width="6" height="6" />

            <rect x="8" y="48" width="8" height="6" />
            <rect x="22" y="48" width="6" height="8" />
            <rect x="36" y="50" width="6" height="6" />
            <rect x="48" y="50" width="8" height="6" />
            <rect x="62" y="48" width="6" height="6" />
            <rect x="74" y="50" width="12" height="6" />

            <rect x="36" y="66" width="8" height="8" />
            <rect x="50" y="68" width="6" height="6" />
            <rect x="62" y="66" width="8" height="8" />
            <rect x="76" y="66" width="8" height="8" />

            <rect x="36" y="80" width="6" height="8" />
            <rect x="48" y="82" width="12" height="6" />
            <rect x="66" y="80" width="8" height="8" />
            <rect x="80" y="80" width="6" height="8" />
          </svg>
        </div>

        <p className="text-xs font-bold text-slate-900 dark:text-white">
          {profile.coachName}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Instant Retainer & Advisory Deposit Portal
        </p>

        {/* Link input */}
        <div className="mt-4 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <span className="truncate max-w-[200px] text-slate-600 dark:text-slate-300 font-mono text-[11px]">
            {paymentLink}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg flex items-center space-x-1 font-semibold text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
