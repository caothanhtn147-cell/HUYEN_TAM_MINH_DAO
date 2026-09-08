'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

export const BreathingGuideCircle: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState<number>(0);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isActive) return;

    const runSequence = () => {
      // Step 1: Inhale 4s
      setPhase('inhale');
      setCountdown(4);

      let currentSecond = 4;
      const inhaleInterval = setInterval(() => {
        currentSecond -= 1;
        setCountdown(currentSecond);
        if (currentSecond <= 0) {
          clearInterval(inhaleInterval);

          // Step 2: Hold 7s
          setPhase('hold');
          setCountdown(7);
          let holdSecond = 7;
          const holdInterval = setInterval(() => {
            holdSecond -= 1;
            setCountdown(holdSecond);
            if (holdSecond <= 0) {
              clearInterval(holdInterval);

              // Step 3: Exhale 8s
              setPhase('exhale');
              setCountdown(8);
              let exhaleSecond = 8;
              const exhaleInterval = setInterval(() => {
                exhaleSecond -= 1;
                setCountdown(exhaleSecond);
                if (exhaleSecond <= 0) {
                  clearInterval(exhaleInterval);
                  setCycleCount((prev) => prev + 1);
                }
              }, 1000);
            }
          }, 1000);
        }
      }, 1000);
    };

    runSequence();
    const totalCycleTime = (4 + 7 + 8) * 1000;
    const cycleInterval = setInterval(runSequence, totalCycleTime);

    return () => {
      clearInterval(cycleInterval);
    };
  }, [isActive]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return t('breathingInhale');
      case 'hold':
        return t('breathingHold');
      case 'exhale':
        return t('breathingExhale');
      default:
        return t('breathingSub');
    }
  };

  const getCircleScaleClass = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-125 border-emerald-400 bg-emerald-500/20 shadow-2xl shadow-emerald-500/30';
      case 'hold':
        return 'scale-125 border-purple-400 bg-purple-500/20 shadow-2xl shadow-purple-500/30';
      case 'exhale':
        return 'scale-90 border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10';
      default:
        return 'scale-100 border-slate-700 bg-slate-900/60';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center shadow-xl backdrop-blur space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
          {t('breathingTitle')}
        </h3>
        <p className="text-xs text-slate-400">
          {t('breathingSub')}
        </p>
      </div>

      {/* Animated Breathing Orb */}
      <div className="py-6 flex flex-col items-center justify-center">
        <div
          className={`relative h-44 w-44 rounded-full border-2 transition-all duration-[4000ms] ease-in-out flex flex-col items-center justify-center ${getCircleScaleClass()}`}
        >
          <span className="text-3xl font-extrabold text-white">
            {isActive ? countdown : '🧘'}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mt-1">
            {phase === 'idle' ? 'Vòng Thở' : phase}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold text-cyan-300">
          {getPhaseText()}
        </p>
        {cycleCount > 0 && (
          <span className="mt-1 text-[11px] text-slate-500">
            Cycles Completed: <strong>{cycleCount}</strong>
          </span>
        )}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => {
          setIsActive(!isActive);
          if (isActive) setCycleCount(0);
        }}
        className={`rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md ${
          isActive
            ? 'bg-rose-500 text-slate-950 hover:bg-rose-400'
            : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-95'
        }`}
      >
        {isActive ? '⏹️ Pause Breathing' : '▶️ Start 4-7-8 Breathing'}
      </button>
    </div>
  );
};
