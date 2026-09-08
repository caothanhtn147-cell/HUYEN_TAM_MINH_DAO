'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const OnboardingTourModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenTour = localStorage.getItem('app_onboarded_v1');
      if (!hasSeenTour) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_onboarded_v1', 'true');
    }
  };

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: language === 'en' ? '🔮 Welcome to HuyenTam Wisdom' : '🔮 Chào Mừng Đến Với Huyền Tâm Minh Đạo',
      content: language === 'en'
        ? 'A sovereign platform combining applied philosophy, 3D Tarot, 3D I Ching & Bazi astrology for self-reflection.'
        : 'Nền tảng triết học ứng dụng & biểu tượng soi chiếu nhận thức tâm lý giúp bạn hiểu mình và sống tự tại hơn.',
      icon: '☯️',
    },
    {
      title: language === 'en' ? '👑 5-Perspective Wisdom Matrix' : '👑 Ma Trận Soi Chiếu 5 Vị Thế',
      content: language === 'en'
        ? 'Switch insights seamlessly between Mass Public, Mysticism, Cognitive Science, Enterprise & JCT Master matrix.'
        : 'Soi chiếu mọi quẻ bói và bài học tâm lý dưới 5 lăng kính: Đại Chúng, Cổ Học, Tâm Lý Nhận Thức, Enterprise & JCT Master.',
      icon: '👑',
    },
    {
      title: language === 'en' ? '🔒 100% Privacy & WebCrypto' : '🔒 Bảo Mật 100% W3C WebCrypto',
      content: language === 'en'
        ? 'Zero backend dependency, E2EE client vault & 432Hz ambient harmonic audio for deep meditation.'
        : 'Mã hóa W3C WebCrypto API cấp phần cứng, lưu trữ E2EE cục bộ & âm thanh sóng nền 432Hz dưỡng đạo.',
      icon: '🌊',
    },
  ];

  const currentTour = tourSteps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-5 text-center relative animate-pulse-glow">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          ✕
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-3xl shadow-inner">
          {currentTour.icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-amber-300">
            {currentTour.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {currentTour.content}
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1.5 pt-2">
          {tourSteps.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all ${
                step === idx + 1 ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
          >
            {language === 'en' ? 'Skip Tour' : 'Bỏ Qua'}
          </button>

          {step < tourSteps.length ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md"
            >
              {language === 'en' ? 'Next →' : 'Tiếp Theo →'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-md"
            >
              {language === 'en' ? 'Start Exploring ✨' : 'Khám Phá Phay ✨'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
