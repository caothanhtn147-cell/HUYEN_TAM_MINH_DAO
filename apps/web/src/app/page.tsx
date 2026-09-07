'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur">
        {/* Language Switcher Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <span className="rounded-full bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
            JCT Software Studio
          </span>
          <LanguageSwitcher />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          {t('brandName')}
        </h1>
        <p className="text-sm font-medium text-slate-400">
          International Name: {t('brandNameEn')}
        </p>
        <p className="text-base italic text-amber-200/90 font-serif">
          {t('slogan')}
        </p>
        <div className="border-t border-slate-800 pt-6 text-xs leading-relaxed text-slate-400 space-y-4">
          <p>{t('sloganSubtitle')}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="/minh-kien"
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
            >
              {t('navMinhKien')}
            </a>
            <a
              href="/tarot"
              className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition"
            >
              {t('navTarot')}
            </a>
            <a
              href="/iching"
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              {t('navIChing')}
            </a>
            <a
              href="/astrology"
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              {t('navAstrology')}
            </a>
            <a
              href="/duong-dao"
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              {t('navDuongDao')}
            </a>
            <a
              href="/dashboard"
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
            >
              {t('navDashboard')}
            </a>
            <a
              href="/admin"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition"
            >
              {t('navAdmin')}
            </a>
          </div>
          <p className="text-slate-500 text-[11px] pt-2">
            {t('footerDisclaimer')}
          </p>
        </div>
      </div>
    </main>
  );
}
