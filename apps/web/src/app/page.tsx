'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden">
      {/* Ambient Cinema Glow Light Backgrounds */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-amber-500/15 via-purple-500/10 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      {/* Floating Glass Header */}
      <header className="relative z-50 w-full max-w-5xl flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-lg shadow-inner">
            ☯
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
              {t('brandName')}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              JCT Software Studio
            </p>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Hero Wisdom Section */}
      <section className="relative z-10 my-10 max-w-4xl text-center space-y-6">
        {/* Wisdom Mandala Symbol */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-4xl shadow-2xl cinema-glow-gold animate-pulse-glow">
          <span className="animate-spin-slow inline-block">🔮</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          {t('brandName')}
        </h1>
        <p className="text-sm uppercase tracking-widest text-amber-400/90 font-semibold">
          International Name: {t('brandNameEn')}
        </p>

        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 backdrop-blur-md">
          <p className="text-lg italic text-amber-200 font-medium tracking-wide">
            "{t('slogan')}"
          </p>
          <p className="text-xs text-slate-400 mt-2 font-normal">
            {t('sloganSubtitle')}
          </p>
        </div>
      </section>

      {/* Bento Grid Layout - 5 Trụ Cột Triết Học & Quản Trị */}
      <section className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
        {/* Card 1: Minh Kiện AI Chat */}
        <a
          href="/minh-kien"
          className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/20 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:bg-slate-900/80 cinema-glow-gold"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xl group-hover:scale-110 transition">
              🤖
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition">
              {t('navMinhKien')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Trợ lý AI soi chiếu nhận thức tâm lý, giải đáp triết học và khai sáng góc nhìn đời sống.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition">
            Khám phá Minh Kiện →
          </div>
        </a>

        {/* Card 2: Rút Bài Tarot 3D */}
        <a
          href="/tarot"
          className="group relative flex flex-col justify-between rounded-3xl border border-purple-500/20 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/50 hover:bg-slate-900/80 cinema-glow-purple"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xl group-hover:scale-110 transition">
              🎴
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition">
              {t('navTarot')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Thánh trận 78 lá bài Tarot hiệu ứng 3D lật bài sinh động, luận giải 3 quẻ Thời Gian & Tâm Trí.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition">
            Rút bài ngay →
          </div>
        </a>

        {/* Card 3: Gieo Quẻ Kinh Dịch */}
        <a
          href="/iching"
          className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-slate-900/80 cinema-glow-emerald"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xl group-hover:scale-110 transition">
              ☯
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition">
              {t('navIChing')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Mô phỏng gieo 3 đồng xu Thái Cực 3D, luận giải 64 Quẻ Thần Toán & Hào Động định hướng.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition">
            Gieo quẻ Kinh Dịch →
          </div>
        </a>

        {/* Card 4: Lá Số Bát Tự & Tử Vi */}
        <a
          href="/astrology"
          className="group relative flex flex-col justify-between rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:bg-slate-900/80 cinema-glow-cyan"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xl group-hover:scale-110 transition">
              🌌
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition">
              {t('navAstrology')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Lập bản đồ 12 Cung Tử Vi, phân tích Âm Dương Ngũ Hành & Cận chi tiết mệnh số.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition">
            Lập lá số ngay →
          </div>
        </a>

        {/* Card 5: Dưỡng Đạo & Giấc Ngủ */}
        <a
          href="/duong-dao"
          className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-slate-900/80 cinema-glow-emerald"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xl group-hover:scale-110 transition">
              🍃
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition">
              {t('navDuongDao')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Nhật ký theo dõi năng lượng tâm trí (Mind Mood Matrix) & âm thanh thiền định 432Hz.
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition">
            Dưỡng đạo tâm trí →
          </div>
        </a>

        {/* Card 6: Dashboard & Admin Governance */}
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="group flex-1 flex items-center justify-between rounded-2xl border border-amber-500/20 bg-slate-900/60 p-4 backdrop-blur-xl transition hover:border-amber-500/50 hover:bg-slate-900/80"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📊</span>
              <div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition">
                  {t('navDashboard')}
                </h4>
                <p className="text-[11px] text-slate-400">Lịch sử & Nhật ký cá nhân</p>
              </div>
            </div>
            <span className="text-xs text-amber-400">→</span>
          </a>

          <a
            href="/admin"
            className="group flex-1 flex items-center justify-between rounded-2xl border border-rose-500/20 bg-slate-900/60 p-4 backdrop-blur-xl transition hover:border-rose-500/50 hover:bg-slate-900/80"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-400 transition">
                  {t('navAdmin')}
                </h4>
                <p className="text-[11px] text-slate-400">Quản trị & Nhật ký Audit Log</p>
              </div>
            </div>
            <span className="text-xs text-rose-400">→</span>
          </a>
        </div>
      </section>

      {/* Footer Sovereign */}
      <footer className="relative z-10 w-full max-w-5xl border-t border-slate-800/80 pt-6 mt-10 text-center space-y-2">
        <p className="text-xs text-slate-400 font-medium">
          {t('footerDisclaimer')}
        </p>
        <p className="text-[11px] text-slate-600">
          © 2026 HUYỀN TÂM MINH ĐẠO | Official Domain: <span className="text-amber-400 font-semibold">https://huyentam.app</span>
        </p>
      </footer>
    </main>
  );
}

