'use client';

import React from 'react';
import { IChingHexagramItem } from '@/types/iching';
import { IChingLineView } from './IChingLineView';

interface IChingHexagramCardViewProps {
  hexagram: IChingHexagramItem;
  titleBadge?: string;
  isTransformed?: boolean;
  changingLineNumbers?: number[];
}

export const IChingHexagramCardView: React.FC<IChingHexagramCardViewProps> = ({
  hexagram,
  titleBadge = 'Quẻ Gốc (Chủ Quẻ)',
  isTransformed = false,
  changingLineNumbers = [],
}) => {
  // Binary code is 6 characters: index 0 = Line 1, index 5 = Line 6
  // We want to render from Line 6 (top) to Line 1 (bottom)
  const lineValues = hexagram.binary_code.split('').map((char) => parseInt(char, 10));

  return (
    <div className={`rounded-2xl border ${
      isTransformed 
        ? 'border-purple-500/40 bg-slate-900/80 shadow-purple-500/10' 
        : 'border-amber-500/40 bg-slate-900/80 shadow-amber-500/10'
    } p-6 shadow-2xl backdrop-blur space-y-5 transition-all duration-300`}>
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
          isTransformed 
            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' 
            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        }`}>
          {titleBadge}
        </span>
        <span className="text-xs font-mono text-slate-400">
          Mã nhị phân: <strong className="text-slate-200">{hexagram.binary_code}</strong>
        </span>
      </div>

      {/* Hexagram Name & Trigrams */}
      <div className="space-y-1 text-center md:text-left">
        <div className="flex items-baseline gap-3">
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-50 tracking-tight">
            {hexagram.name_vi}
          </h3>
          <span className="text-sm font-semibold italic text-amber-400/90">
            ({hexagram.pinyin_name} — {hexagram.name_en})
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Quẻ Thượng: <span className="font-semibold text-slate-200">{hexagram.upper_trigram}</span> • 
          Quẻ Hạ: <span className="font-semibold text-slate-200">{hexagram.lower_trigram}</span>
        </p>
      </div>

      {/* 6-Line Stack (Line 6 to Line 1) */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4 space-y-1">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
          Tượng Quẻ 6 Hào (Từ Hào 6 trên xuống Hào 1 dưới)
        </div>
        {[6, 5, 4, 3, 2, 1].map((lineNum) => {
          const val = lineValues[lineNum - 1]; // 0-indexed
          const isChanging = changingLineNumbers.includes(lineNum);
          return (
            <IChingLineView
              key={lineNum}
              lineNumber={lineNum}
              lineValue={val}
              isChanging={isChanging}
            />
          );
        })}
      </div>

      {/* Judgement (Thoán Từ) */}
      <div className="space-y-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <span>📜 Thoán Từ (Định Hướng Tổng Quan)</span>
        </h4>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic">
          &quot;{hexagram.judgement_vi}&quot;
        </p>
      </div>

      {/* Symbolism Image (Tượng Dịch) */}
      <div className="space-y-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <span>🌿 Tượng Dịch (Quy Luật Tự Nhiên & Ứng Xử)</span>
        </h4>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic">
          &quot;{hexagram.image_vi}&quot;
        </p>
      </div>

      {/* Interpretations for Changing Lines (if applicable) */}
      {changingLineNumbers.length > 0 && !isTransformed && (
        <div className="space-y-2 rounded-xl bg-rose-950/20 border border-rose-500/30 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
            <span>⚡ Lời Giải Hào Biến (Trọng Tâm Chuyển Dịch)</span>
          </h4>
          <div className="space-y-1.5 text-xs text-slate-200">
            {changingLineNumbers.map((lineNum) => {
              const text = hexagram.lines_interpretation_vi[String(lineNum)];
              return (
                <div key={lineNum} className="flex gap-2">
                  <span className="font-bold text-rose-400 min-w-[3.5rem]">
                    [Hào {lineNum}]:
                  </span>
                  <span>{text || 'Chi tiết hào chuyển dịch theo thời vận.'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wisdom Reflection */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <span>🧠 Câu Hỏi Tự Soi Chiếu (Huyền Tâm Minh Đạo)</span>
        </h4>
        <p className="text-xs md:text-sm font-medium text-amber-100 italic">
          &quot;{hexagram.wisdom_reflection_vi}&quot;
        </p>
      </div>
    </div>
  );
};
