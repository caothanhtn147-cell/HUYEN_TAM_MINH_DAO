'use client';

import React, { useState, useEffect } from 'react';
import { audioSynth } from '@/utils/audioSynth';
import { useLanguage } from '@/context/LanguageContext';

export const SoundWaveVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    return () => {
      audioSynth.stop432HzDrone();
    };
  }, []);

  const handleToggle = () => {
    const nextState = audioSynth.toggle432HzDrone((state) => setIsPlaying(state));
    setIsPlaying(nextState);
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-xl backdrop-blur flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Animated Waveform Icon */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          {isPlaying ? (
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_300ms] h-3/4" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms] h-full" />
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_400ms] h-1/2" />
            </div>
          ) : (
            <span className="text-xl">🎵</span>
          )}
        </div>

        <div className="space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-emerald-300">
              {t('duongDao432Title')}
            </h3>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 animate-pulse">
                ● Live 432Hz Harmonic
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {t('duongDao432Sub')}
          </p>
        </div>
      </div>

      {/* Control Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-lg ${
          isPlaying
            ? 'bg-rose-500 text-slate-950 hover:bg-rose-400 shadow-rose-500/20'
            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20 active:scale-95'
        }`}
      >
        {isPlaying ? (
          <span>{t('duongDaoBtnStop432')}</span>
        ) : (
          <span>{t('duongDaoBtnStart432')}</span>
        )}
      </button>
    </div>
  );
};
