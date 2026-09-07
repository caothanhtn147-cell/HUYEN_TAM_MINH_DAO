'use client';

import React, { useState } from 'react';
import { DrawnCardItem } from '@/types/tarot';

interface TarotCardViewProps {
  card: DrawnCardItem;
  label?: string;
  autoFlip?: boolean;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  label,
  autoFlip = true,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(autoFlip);

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center space-y-3 w-full max-w-sm">
      {/* Position Label */}
      {label && (
        <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20">
          📍 {label}
        </span>
      )}

      {/* 3D Flip Card Container */}
      <div
        onClick={toggleFlip}
        className="group relative h-96 w-full cursor-pointer perspective-1000"
      >
        <div
          className={`relative h-full w-full rounded-2xl border transition-all duration-700 transform-style-3d shadow-xl ${
            isFlipped ? 'rotate-y-180 border-amber-500/40 bg-slate-900/90' : 'border-slate-800 bg-slate-950'
          }`}
        >
          {/* FRONT (Card Back Pattern) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center backface-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-amber-500/30 bg-amber-500/5 text-4xl text-amber-400 shadow-inner">
              ☯
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                HUYỀN TÂM TAROT
              </p>
              <p className="text-[11px] italic text-slate-400">
                Lớp học gương soi tâm lý
              </p>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-wider text-slate-500 animate-pulse">
              [ Click để lật bài ]
            </p>
          </div>

          {/* BACK (Card Reveal Payload) */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 rotate-y-180 backface-hidden rounded-2xl overflow-y-auto bg-slate-900/95 border border-amber-500/30">
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-slate-950/80 px-2 py-0.5 font-bold uppercase text-amber-400 border border-amber-500/20">
                  {card.arcana} {card.suit ? `• ${card.suit}` : ''}
                </span>
                <span
                  className={`rounded px-2 py-0.5 font-bold text-[11px] ${
                    card.is_reversed
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {card.orientation}
                </span>
              </div>

              {/* Title & Reversed visual indicator */}
              <div className="text-center pt-1 border-b border-slate-800 pb-2">
                <h3
                  className={`text-lg font-extrabold tracking-tight text-slate-100 transition-transform ${
                    card.is_reversed ? 'rotate-180 inline-block' : ''
                  }`}
                >
                  {card.name_vi}
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  ({card.name_en})
                </p>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {card.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-950/60 px-2 py-0.5 text-[10px] font-medium text-amber-300/90 border border-slate-800"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              {/* Psychological Mirror Meaning */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  💡 Gương Soi Tâm Lý:
                </span>
                <p className="text-xs leading-relaxed text-slate-200/90 italic">
                  {card.meaning_vi}
                </p>
              </div>
            </div>

            {/* Wisdom Reflection Question */}
            <div className="mt-3 rounded-lg border border-amber-500/20 bg-slate-950/80 p-2.5 text-[11px] text-amber-200">
              <span className="font-bold text-amber-400">❓ Câu hỏi tự soi chiếu: </span>
              <span>{card.wisdom_reflection_vi}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
