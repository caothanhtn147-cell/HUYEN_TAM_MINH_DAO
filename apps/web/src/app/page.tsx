'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { StarfieldCanvas } from '@/components/common/StarfieldCanvas';
import { CustomCursor } from '@/components/common/CustomCursor';
import { OnboardingTourModal } from '@/components/common/OnboardingTourModal';
import { BiometricEntropyGauge } from '@/components/common/BiometricEntropyGauge';

// 5 Puzzle Pieces Components
import { AmbientSoundscapePlayer } from '@/components/audio/AmbientSoundscapePlayer';
import { CyberMysticCardDeck } from '@/components/tarot/CyberMysticCardDeck';
import { SocialStoryExporterModal } from '@/components/social/SocialStoryExporterModal';
import { VietQRCheckoutModal } from '@/components/checkout/VietQRCheckoutModal';
import { DailyWisdomPushNotifier } from '@/components/notifications/DailyWisdomPushNotifier';

import { Sparkles, Share2, Crown, Bell } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Magnetic Glow Custom Cursor */}
      <CustomCursor />

      {/* 30-Second New User Onboarding Tour Modal */}
      <OnboardingTourModal />

      {/* 528Hz / 432Hz Ambient Soundscape Player */}
      <AmbientSoundscapePlayer />

      {/* Interactive Particle Starfield Background */}
      <StarfieldCanvas />

      {/* 9:16 Story Canvas Exporter Modal */}
      <SocialStoryExporterModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        title="LỜI KHUYÊN MINH KIẾN HÔM NAY"
        subtitle="Huyền Tâm Minh Đạo • Quẻ Ngày Mới"
        quote="Tâm tĩnh thì trí sáng. Mọi giông bão ngoài kia chỉ là phép thử để trui rèn bản lĩnh và sự bình an nội tại."
        authorOrType="Kinh Dịch Minh Triết"
      />

      {/* VietQR Napas247 VIP Checkout Modal */}
      <VietQRCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        initialPlan="month"
      />

      {/* Ambient Cinema Glow Light Backgrounds */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-amber-500/20 via-purple-500/10 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />

      {/* Live System Ticker Badge Header */}
      <div className="relative z-50 w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-slate-950/80 px-4 py-1.5 backdrop-blur text-[11px] font-mono text-amber-300/90 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">CLOUDFLARE EDGE: ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span>LATENCY: 0.01ms</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>🔒 W3C WEBCRYPTO E2EE VAULT</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold">HTTPS://HUYENTAM.APP</span>
        </div>
      </div>

      {/* Floating Titanium Glass Header */}
      <header className="relative z-50 w-full max-w-5xl flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 border border-amber-300">
            ☯
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wider text-slate-100 uppercase">
              {t('brandName')}
            </h2>
            <p className="text-[11px] text-amber-400/90 font-mono">
              JCT Software Studio • Global Edition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Hạt Minh Triết Credit Badge */}
          <div 
            onClick={() => setIsCheckoutModalOpen(true)}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition"
            title="Số dư Hạt Minh Triết"
          >
            <span>💎 100 Hạt</span>
          </div>

          {/* Quick Action Trigger Buttons for Story & VIP Checkout */}
          <button
            onClick={() => setIsStoryModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-300 text-xs font-semibold transition"
            title="Xuất Story 9:16"
          >
            <Share2 className="h-3.5 w-3.5" /> Story 9:16
          </button>

          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <Crown className="h-3.5 w-3.5" /> VIP 29K Cà Phê
          </button>

          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Wisdom Mandala Section */}
      <section className="relative z-10 my-8 max-w-4xl text-center space-y-6">
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-amber-400/40 bg-gradient-to-b from-amber-500/20 via-slate-900 to-purple-900/30 text-amber-400 text-5xl shadow-2xl cinema-glow-gold">
          <div className="absolute inset-0 rounded-full border border-amber-300/40 animate-spin-slow" />
          <span className="animate-pulse-glow inline-block">🔮</span>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest backdrop-blur">
            <span>✨ 2026 Sovereign International Edition</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
            {t('brandName')}
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-400/90 font-mono font-bold">
            International Identity: {t('brandNameEn')}
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 backdrop-blur-xl shadow-2xl space-y-2">
          <p className="text-lg sm:text-xl italic text-amber-200 font-serif tracking-wide">
            {t('slogan')}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('sloganSubtitle')}
          </p>
        </div>

        {/* Biometric Hardware Entropy Gauge & Morning Push Schedule */}
        <div className="mx-auto max-w-2xl space-y-3">
          <BiometricEntropyGauge />
          <DailyWisdomPushNotifier />
        </div>
      </section>

      {/* 3D Cyber-Mystic Tarot & Kinh Dịch Interactive Card Deck */}
      <section className="relative z-10 w-full max-w-5xl my-6">
        <CyberMysticCardDeck />
      </section>

      {/* Bento Grid Layout - 5 Trụ Cột Triết Học & Quản Trị */}
      <section className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {/* Card 1: Minh Kiện AI Chat */}
        <a
          href="/minh-kien"
          className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-slate-900/90 cinema-glow-gold shadow-2xl"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-2xl group-hover:scale-110 transition shadow-inner">
                🤖
              </div>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                LIVE AI STREAM
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition">
              {t('navMinhKien')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {language === 'en'
                ? 'AI psychological reflection assistant answering life questions through applied philosophy.'
                : 'Trợ lý AI soi chiếu nhận thức tâm lý, giải đáp triết học và khai sáng góc nhìn đời sống.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-amber-400 border-t border-slate-800/80 pt-3">
            <span>{t('minhKienTitle')}</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </a>

        {/* Card 2: Rút Bài Tarot 3D */}
        <a
          href="/tarot"
          className="group relative flex flex-col justify-between rounded-3xl border border-purple-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-400 hover:bg-slate-900/90 cinema-glow-purple shadow-2xl"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 text-2xl group-hover:scale-110 transition shadow-inner">
                🎴
              </div>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                3D FLIP CARDS
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-400 transition">
              {t('navTarot')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {language === 'en'
                ? 'Sacred 78-card Tarot deck with 3D flip physics, time spread & psychological mirror.'
                : 'Thánh trận 78 lá bài Tarot hiệu ứng 3D lật bài sinh động, luận giải 3 quẻ Thời Gian & Tâm Trí.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-purple-400 border-t border-slate-800/80 pt-3">
            <span>{t('tarotTitle')}</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </a>

        {/* Card 3: Gieo Quẻ Kinh Dịch */}
        <a
          href="/iching"
          className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:bg-slate-900/90 cinema-glow-emerald shadow-2xl"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-2xl group-hover:scale-110 transition shadow-inner">
                ☯
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                3D COIN TOSS
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition">
              {t('navIChing')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {language === 'en'
                ? '3D ancient bronze coin flip simulation, 64 hexagrams & changing line direction.'
                : 'Mô phỏng gieo 3 đồng xu Thái Cực 3D, luận giải 64 Quẻ Thần Toán & Hào Động định hướng.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-emerald-400 border-t border-slate-800/80 pt-3">
            <span>{t('ichingTitle')}</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </a>

        {/* Card 4: Lá Số Bát Tự & Tử Vi */}
        <a
          href="/astrology"
          className="group relative flex flex-col justify-between rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:bg-slate-900/90 cinema-glow-cyan shadow-2xl"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-2xl group-hover:scale-110 transition shadow-inner">
                🏛️
              </div>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                BAZI & TU VI
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition">
              {t('navAstrology')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {language === 'en'
                ? '12-Palace Tu Vi Star Wheel, Four Pillars Bazi & Five Elements Pentagon balance.'
                : 'Lập bản đồ 12 Cung Tử Vi, phân tích Âm Dương Ngũ Hành & Cận chi tiết mệnh số.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-cyan-400 border-t border-slate-800/80 pt-3">
            <span>{t('astrologyTitle')}</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </a>

        {/* Card 5: Dưỡng Đạo & Giấc Ngủ */}
        <a
          href="/duong-dao"
          className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:bg-slate-900/90 cinema-glow-emerald shadow-2xl"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-2xl group-hover:scale-110 transition shadow-inner">
                🌿
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                432HZ AUDIO & 4-7-8
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition">
              {t('navDuongDao')}
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              {language === 'en'
                ? '432Hz harmonic meditation wave, 4-7-8 bio-breathing circle & sleep rhythm guide.'
                : 'Nhật ký theo dõi năng lượng tâm trí (Mind Mood Matrix) & âm thanh thiền định 432Hz.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-bold text-emerald-400 border-t border-slate-800/80 pt-3">
            <span>{t('duongDaoTitle')}</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </a>

        {/* Card 6: Dashboard & Admin Governance */}
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="group flex-1 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-slate-900/70 p-4 backdrop-blur-xl transition hover:border-amber-400 hover:bg-slate-900/90 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition">
                  {t('navDashboard')}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {language === 'en' ? 'Mind logs & reflection history' : 'Lịch sử & Nhật ký cá nhân'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition">→</span>
          </a>

          <a
            href="/admin"
            className="group flex-1 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-slate-900/70 p-4 backdrop-blur-xl transition hover:border-rose-400 hover:bg-slate-900/90 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-400 transition">
                  {t('navAdmin')}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {language === 'en' ? 'Governance & Audit Log vault' : 'Quản trị & Nhật ký Audit Log'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 group-hover:translate-x-1 transition">→</span>
          </a>
        </div>
      </section>

      {/* Footer Sovereign */}
      <footer className="relative z-10 w-full max-w-5xl border-t border-slate-800/80 pt-6 mt-10 text-center space-y-2">
        <p className="text-xs text-slate-400 font-medium max-w-3xl mx-auto">
          {t('footerDisclaimer')}
        </p>
        <p className="text-[11px] text-slate-500 font-mono">
          © 2026 HUYỀN TÂM MINH ĐẠO | Official Domain: <span className="text-amber-400 font-semibold">https://huyentam.app</span> | Built by JCT Software Studio
        </p>
      </footer>
    </main>
  );
}
