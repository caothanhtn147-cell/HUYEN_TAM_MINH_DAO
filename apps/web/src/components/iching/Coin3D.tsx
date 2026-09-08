'use client';

import React from 'react';
import { audioSynth } from '@/utils/audioSynth';

interface Coin3DProps {
  isFlipping: boolean;
  values?: number[]; // Array of 3 numbers (2 or 3)
}

export const Coin3D: React.FC<Coin3DProps> = ({ isFlipping, values = [3, 3, 2] }) => {
  React.useEffect(() => {
    if (isFlipping) {
      audioSynth.playCoinClink();
    }
  }, [isFlipping]);

  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {values.map((val, idx) => {
        const isTail = val === 3; // 3 = Ngửa (Dương / Head), 2 = Sấp (Âm / Tail)
        return (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            <div
              className={`relative h-16 w-16 rounded-full border-2 border-amber-400/60 bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-300 p-1 shadow-lg shadow-amber-500/20 transition-all duration-700 flex items-center justify-center ${
                isFlipping ? 'animate-[spin_0.4s_linear_infinite] scale-110' : 'hover:scale-105'
              }`}
            >
              {/* Inner Square Cutout for Ancient Chinese/Vietnamese Coin */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-800/60 bg-amber-900/80 shadow-inner">
                <div className="flex h-5 w-5 items-center justify-center border border-amber-400/80 bg-amber-950 font-mono text-[10px] font-extrabold text-amber-300">
                  {isTail ? '陽' : '陰'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              {isTail ? 'Dương (+3)' : 'Âm (+2)'}
            </span>
          </div>
        );
      })}
    </div>
  );
};
