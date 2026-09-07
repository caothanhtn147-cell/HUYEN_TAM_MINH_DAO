'use client';

import React from 'react';

interface WalletIndicatorProps {
  balance: number;
  sessionCost?: number;
  onTopUpClick?: () => void;
}

export const WalletIndicator: React.FC<WalletIndicatorProps> = ({
  balance,
  sessionCost = 10,
  onTopUpClick,
}) => {
  const isLowBalance = balance < sessionCost;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-lg">
          ☯
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Số Dư Ví Linh Điểm
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">
              {balance.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-300">Linh Điểm</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right text-xs">
          <span className="text-slate-400">Chi phí phiên tư vấn: </span>
          <span className="font-bold text-amber-300">-{sessionCost} Linh Điểm</span>
          {isLowBalance && (
            <p className="text-[11px] font-semibold text-rose-400">
              ⚠️ Không đủ Linh Điểm để tư vấn
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onTopUpClick}
          className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-400 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
        >
          + Nạp Linh Điểm
        </button>
      </div>
    </div>
  );
};
