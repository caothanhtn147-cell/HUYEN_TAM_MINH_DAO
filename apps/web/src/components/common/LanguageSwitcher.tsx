'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1 shadow-inner">
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          language === 'vi'
            ? 'bg-amber-500 text-slate-950 shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        🇻🇳 VIE
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-amber-500 text-slate-950 shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        🇺🇸 ENG
      </button>
    </div>
  );
};
