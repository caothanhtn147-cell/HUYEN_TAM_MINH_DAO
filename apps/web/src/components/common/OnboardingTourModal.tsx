'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Compass, Layers, ShieldCheck } from 'lucide-react';

export const OnboardingTourModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('app_onboarded_v1');
    }
    return false;
  });
  const [step, setStep] = useState<number>(1);
  const { language } = useLanguage();

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_onboarded_v1', 'true');
    }
  };

  if (!isOpen) return null;

  const tourSteps = [
    {
      title:
        language === 'en'
          ? 'Welcome to HuyenTam Wisdom'
          : 'Chào Mừng Đến Với Huyền Tâm Minh Đạo',
      content:
        language === 'en'
          ? 'A sovereign philosophical platform combining applied wisdom, 3D Tarot, 3D I Ching & Bazi astrology for self-reflection.'
          : 'Nền tảng triết học ứng dụng & biểu tượng soi chiếu nhận thức tâm lý giúp bạn thấu hiểu chính mình và sống tự tại hơn.',
      icon: <Compass className="h-8 w-8 text-amber-400" />,
      badge: 'CÀN KHÔN MINH ĐẠO',
    },
    {
      title:
        language === 'en'
          ? '5-Stage Quest Matrix'
          : 'Bản Đồ 5 Trạm Khai Sáng Càn Khôn',
      content:
        language === 'en'
          ? 'Journey through 5 sacred chambers: Minh Kien AI, 78 Renaissance Tarot, I Ching Bronze Coins, Tu Vi Palaces & Restorative Zen.'
          : 'Vượt qua 5 cửa ải tâm thức: Minh Kiến Điện, Huyền Bài Trận, Dịch Kinh Đài, Tinh Tú Cung & Dưỡng Đạo Viện.',
      icon: <Layers className="h-8 w-8 text-purple-400" />,
      badge: 'MA TRẬN VƯỢT ẢI',
    },
    {
      title:
        language === 'en'
          ? 'Autonomous Edge & Privacy'
          : 'Động Cơ Tự Chủ & Bảo Mật Tuyệt Đối',
      content:
        language === 'en'
          ? 'Hardware-grade W3C WebCrypto encryption, 100% offline client-side wisdom engine & 432Hz Tibetan singing bowls.'
          : 'Bảo mật mật mã học W3C WebCrypto API cấp phần cứng, bộ não triết học tự chủ 100% không lỗi server & chuông xoay Tây Tạng 432Hz.',
      icon: <ShieldCheck className="h-8 w-8 text-emerald-400" />,
      badge: 'AN TOÀN BẢO VẬT',
    },
  ];

  const currentTour = tourSteps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-5 text-center relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-200 cursor-pointer p-1 rounded-lg hover:bg-slate-800 transition"
        >
          ✕
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-amber-500/40 shadow-inner">
          {currentTour.icon}
        </div>

        <div className="space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {currentTour.badge}
          </span>
          <h3 className="text-lg font-bold text-amber-300 font-cinzel">
            {currentTour.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
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
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 hover:from-amber-400 hover:to-amber-500 cursor-pointer shadow-md transition active:scale-95"
            >
              {language === 'en' ? 'Next →' : 'Tiếp Theo →'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 hover:from-emerald-400 hover:to-emerald-500 cursor-pointer shadow-md transition active:scale-95"
            >
              {language === 'en' ? 'Begin Journey ✦' : 'Bắt Đầu ✦'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTourModal;
