'use client';

import React from 'react';

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

const PERSPECTIVES: { id: PerspectiveMode; label: string; icon: string; desc: string; color: string }[] = [
  {
    id: 'MASS_PUBLIC',
    label: 'Đại Chúng Phổ Thông',
    icon: '🌐',
    desc: 'Góc nhìn thực tế đời sống, dễ hiểu, ứng dụng ngay.',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
  },
  {
    id: 'MYSTICISM',
    label: 'Cổ Học & Triết Lý',
    icon: '📜',
    desc: 'Đào sâu điển tịch, Kinh Dịch, Bát Tự & Âm Dương ngũ hành.',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  },
  {
    id: 'COGNITIVE_TECH',
    label: 'Tâm Lý Học Nhận Thức',
    icon: '🔬',
    desc: 'Góc nhìn khoa học thần kinh, tiềm thức Jungian & thiên kiến.',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
  },
  {
    id: 'BIG_TECH',
    label: 'Quản Trị Enterprise',
    icon: '🏢',
    desc: 'Áp dụng vào chiến lược lãnh đạo, quản trị rủi ro & ra quyết định.',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  },
  {
    id: 'JCT_GOVERNANCE',
    label: 'Vị Thế Sư Phụ JCT',
    icon: '👑',
    desc: 'Tổ hợp ma trận trí tuệ cao cấp, tổng hòa 5 vị thế tối thượng.',
    color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
  },
];

export const PerspectiveMatrixSelector: React.FC<PerspectiveMatrixSelectorProps> = ({
  currentPerspective,
  onChangePerspective,
}) => {
  const activeObj = PERSPECTIVES.find((p) => p.id === currentPerspective) || PERSPECTIVES[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <span>👑 Ma Trận Soi Chiếu 5 Vị Thế (5-Perspective Matrix)</span>
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Vị thế hiện tại: <strong className="text-slate-200">{activeObj.label}</strong>
        </span>
      </div>

      {/* Perspective Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {PERSPECTIVES.map((p) => {
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
