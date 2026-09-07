'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const SafetyDisclaimerBanner: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center text-xs leading-relaxed text-slate-400 space-y-1 my-6">
      <p className="font-semibold text-amber-400/90 flex items-center justify-center gap-1.5">
        <span>🛡️</span>
        <span>
          {language === 'en'
            ? 'Safety & Ethical Disclaimer Boundary:'
            : 'Thông Báo Ranh Giới An Toàn & Miễn Trừ Trách Nhiệm:'}
        </span>
      </p>
      <p>
        {language === 'en'
          ? 'All spiritual symbols, Tarot cards, I Ching hexagrams, and Bazi/Tu Vi charts serve as psychological reflection mirrors for self-observation. They do not constitute fatalistic fortune-telling, medical diagnoses, or financial advice. Your decisions and actions shape your real life.'
          : 'Các biểu tượng Tarot, Kinh Dịch, Bát Tự, Tử Vi và Dưỡng Đạo đóng vai trò làm gương soi tâm lý và gợi mở góc nhìn triết học tự quan sát. Không phải thần toán hay dự đoán định mệnh cố định, và không thay thế chẩn đoán y tế chuyên khoa. Quyết định cuộc sống nằm ở bạn.'}
      </p>
    </div>
  );
};
