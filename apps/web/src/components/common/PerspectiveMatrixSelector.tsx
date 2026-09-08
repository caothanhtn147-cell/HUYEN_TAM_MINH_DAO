'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export type PerspectiveMode =
  | 'MASS_PUBLIC'
  | 'MYSTICISM'
  | 'COGNITIVE_TECH'
  | 'BIG_TECH'
  | 'JCT_GOVERNANCE';

interface PerspectiveMatrixSelectorProps {
  currentPerspective: PerspectiveMode;
  onChangePerspective: (mode: PerspectiveMode) => void;
}

export const PerspectiveMatrixSelector: React.FC<PerspectiveMatrixSelectorProps> = ({
  currentPerspective,
  onChangePerspective,
}) => {
  const { t, language } = useLanguage();

  const perspectives: { id: PerspectiveMode; label: string; icon: string; desc: string; color: string }[] = [
    {
      id: 'MASS_PUBLIC',
      label: t('perspectiveMass'),
      icon: '🌐',
      desc: language === 'en' ? 'Practical daily life application, easy to understand.' : 'Góc nhìn thực tế đời sống, dễ hiểu, ứng dụng ngay.',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'MYSTICISM',
      label: t('perspectiveMystic'),
      icon: '📜',
      desc: language === 'en' ? 'Deep ancient scriptures, I-Ching, Bazi & Yin-Yang Five Elements.' : 'Đào sâu điển tịch, Kinh Dịch, Bát Tự & Âm Dương ngũ hành.',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      id: 'COGNITIVE_TECH',
      label: t('perspectiveTech'),
      icon: '🔬',
      desc: language === 'en' ? 'Neuroscience, Jungian archetypes & cognitive bias analysis.' : 'Góc nhìn khoa học thần kinh, tiềm thức Jungian & thiên kiến.',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      id: 'BIG_TECH',
      label: t('perspectiveEnterprise'),
      icon: '🏢',
      desc: language === 'en' ? 'Enterprise leadership strategy, risk governance & decision making.' : 'Áp dụng vào chiến lược lãnh đạo, quản trị rủi ro & ra quyết định.',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'JCT_GOVERNANCE',
      label: t('perspectiveJCT'),
      icon: '👑',
      desc: language === 'en' ? 'Supreme JCT Master Matrix synthesizing all 5 perspectives.' : 'Tổ hợp ma trận trí tuệ cao cấp, tổng hòa 5 vị thế tối thượng.',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    },
  ];

  const activeObj = perspectives.find((p) => p.id === currentPerspective) || perspectives[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <span>{t('matrixHeader')}</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {t('matrixCurrentLabel')} <strong className="text-slate-200">{activeObj.label}</strong>
        </span>
      </div>

      {/* Perspective Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {perspectives.map((p) => {
          const isSelected = currentPerspective === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChangePerspective(p.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer border ${
                isSelected
                  ? p.color + ' shadow-md'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Description */}
      <p className="text-[11px] italic text-slate-400 pt-0.5">
        💡 {activeObj.desc}
      </p>
    </div>
  );
};
