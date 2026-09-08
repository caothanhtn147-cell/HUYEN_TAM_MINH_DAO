'use client';

import React from 'react';
import { TuViChartResponse, TuViPalace } from '@/types/astrology';
import { useLanguage } from '@/context/LanguageContext';

interface TuViPalaceViewProps {
  chart: TuViChartResponse;
}

export const TuViPalaceView: React.FC<TuViPalaceViewProps> = ({ chart }) => {
  const { t, language } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30">
            {t('astroTabTuVi')}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Element Group: <strong className="text-purple-300">{chart.cuc_name}</strong> • {t('astroPalaceMenh')}: <strong className="text-amber-300">{chart.menh_palace_branch}</strong> • {t('astroPalaceThan')}: <strong className="text-emerald-300">{chart.than_palace_branch}</strong>
          </p>
        </div>
      </div>

      {/* Core Archetype Banner */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
          🌟 Core Tu Vi Archetype (Tử Vi Archetype)
        </h3>
        <p className="text-xs md:text-sm text-purple-100 font-medium leading-relaxed">
          {chart.core_archetype_vi}
        </p>
      </div>

      {/* 12 Palaces Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {chart.palaces.map((palace: TuViPalace) => {
          const isMenh = palace.palace_name === 'Mệnh';
          const isThan = palace.earthly_branch === chart.than_palace_branch;

          return (
            <div
              key={palace.palace_name}
              className={`rounded-xl border p-4 space-y-2 relative transition ${
                isMenh
                  ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                  : isThan
                  ? 'border-purple-500/60 bg-purple-500/10'
                  : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  {language === 'en' ? 'Palace' : 'Cung'} {palace.palace_name}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  [{palace.earthly_branch}]
                </span>
              </div>

              {/* Special Badges */}
              <div className="flex flex-wrap gap-1">
                {isMenh && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/40">
                    ⭐ {t('astroPalaceMenh')}
                  </span>
                )}
                {isThan && (
                  <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-purple-300 border border-purple-500/40">
                    🌙 {t('astroPalaceThan')}
                  </span>
                )}
              </div>

              {/* Main Stars */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'en' ? 'Major Stars:' : 'Chính Tinh:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {palace.main_stars.map((star) => (
                    <span
                      key={star}
                      className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-100 border border-slate-700"
                    >
                      {star}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1 leading-snug">
                {palace.symbolic_meaning_vi}
              </p>
            </div>
          );
        })}
      </div>

      {/* Wisdom Reflections */}
      {chart.wisdom_reflections.length > 0 && (
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <span>🧘 {language === 'en' ? 'Self-Observation Prompts' : 'Gợi Mở Nhận Thức Tự Nhiên'}</span>
          </h4>
          <ul className="space-y-1 text-xs text-purple-100 font-medium list-disc list-inside">
            {chart.wisdom_reflections.map((ref, idx) => (
              <li key={idx} className="leading-relaxed">
                {ref}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
