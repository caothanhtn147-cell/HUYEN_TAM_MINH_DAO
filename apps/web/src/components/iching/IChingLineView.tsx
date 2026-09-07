'use client';

import React from 'react';
import { CoinTossLine } from '@/types/iching';

interface IChingLineViewProps {
  lineValue: number; // 1 for Yang (Dương), 0 for Yin (Âm)
  isChanging?: boolean;
  lineType?: 'old_yin' | 'young_yang' | 'young_yin' | 'old_yang';
  lineNumber?: number;
  showDetails?: boolean;
  tossDetails?: CoinTossLine;
}

export const IChingLineView: React.FC<IChingLineViewProps> = ({
  lineValue,
  isChanging = false,
  lineType,
  lineNumber,
  showDetails = false,
  tossDetails,
}) => {
  const isYang = lineValue === 1;

  // Determine line description and colors
  let typeLabel = isYang ? 'Dương (Thiếu Dương)' : 'Âm (Thiếu Âm)';
  let typeBadgeBg = isYang ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let changeSymbol = null;

  if (lineType === 'old_yang') {
    typeLabel = 'Lão Dương (9) ⚡ Hào Biến → Âm';
    typeBadgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
    changeSymbol = '⭕';
  } else if (lineType === 'old_yin') {
    typeLabel = 'Lão Âm (6) ⚡ Hào Biến → Dương';
    typeBadgeBg = 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse';
    changeSymbol = '❌';
  }

  return (
    <div className="flex items-center gap-3 w-full my-1">
      {/* Line Number Badge */}
      {lineNumber && (
        <span className="w-14 text-xs font-bold text-slate-400 text-right">
          Hào {lineNumber}
        </span>
      )}

      {/* Graphical Line Render */}
      <div className="flex-1 flex items-center justify-center h-7 rounded-lg bg-slate-950/80 border border-slate-800/80 px-3 py-1 relative overflow-hidden shadow-inner">
        {isYang ? (
          /* Solid Yang Line */
          <div className={`w-full h-2.5 rounded-sm transition-all duration-300 ${
            isChanging ? 'bg-rose-500 shadow-md shadow-rose-500/50' : 'bg-amber-400 shadow-sm shadow-amber-400/30'
          }`} />
        ) : (
          /* Broken Yin Line */
          <div className="w-full h-2.5 flex justify-between gap-3">
            <div className={`w-[46%] h-full rounded-sm transition-all duration-300 ${
              isChanging ? 'bg-purple-500 shadow-md shadow-purple-500/50' : 'bg-emerald-400 shadow-sm shadow-emerald-400/30'
            }`} />
            <div className={`w-[46%] h-full rounded-sm transition-all duration-300 ${
              isChanging ? 'bg-purple-500 shadow-md shadow-purple-500/50' : 'bg-emerald-400 shadow-sm shadow-emerald-400/30'
            }`} />
          </div>
        )}

        {/* Changing Line Indicator Overlay */}
        {changeSymbol && (
          <span className="absolute right-2 text-xs font-extrabold drop-shadow">
            {changeSymbol}
          </span>
        )}
      </div>

      {/* Toss Details Badge */}
      {showDetails && tossDetails && (
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-400 font-mono">
            [{tossDetails.coin1 === 3 ? '🔴' : '⚪'}, {tossDetails.coin2 === 3 ? '🔴' : '⚪'}, {tossDetails.coin3 === 3 ? '🔴' : '⚪'}]
          </span>
          <span className="text-slate-300 font-bold min-w-[1.5rem] text-center">
            ={tossDetails.total_sum}
          </span>
          <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${typeBadgeBg}`}>
            {typeLabel}
          </span>
        </div>
      )}
    </div>
  );
};
