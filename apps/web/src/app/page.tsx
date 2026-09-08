'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { StarfieldCanvas } from '@/components/common/StarfieldCanvas';
import { OnboardingTourModal } from '@/components/common/OnboardingTourModal';
import { BiometricEntropyGauge } from '@/components/common/BiometricEntropyGauge';

// 5 Puzzle Pieces Components
import { AmbientSoundscapePlayer } from '@/components/audio/AmbientSoundscapePlayer';
import { CyberMysticCardDeck } from '@/components/tarot/CyberMysticCardDeck';
import { SocialStoryExporterModal } from '@/components/social/SocialStoryExporterModal';
import { VietQRCheckoutModal } from '@/components/checkout/VietQRCheckoutModal';
import { DailyWisdomPushNotifier } from '@/components/notifications/DailyWisdomPushNotifier';
import { LiveSocialProofTicker } from '@/components/common/LiveSocialProofTicker';

import {
  Share2,
  Crown,
  Sparkles,
  Compass,
  BookOpen,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* 30-Second New User Onboarding Tour Modal */}
      <OnboardingTourModal />

      {/* 528Hz / 432Hz Tibetan Bowl & Ambient Soundscape Player */}
      <AmbientSoundscapePlayer />

      {/* Interactive Particle Starfield Background */}
      <StarfieldCanvas />

      {/* 9:16 Story Canvas Exporter Modal */}
      <SocialStoryExporterModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        title={t('socialStoryTitle')}
        subtitle={t('socialStorySub')}
        quote={t('socialStoryQuote')}
        authorOrType={t('socialStoryAuthor')}
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

      {/* Live System Truthful Ticker Header */}
      <div className="relative z-20 w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-500/20 bg-slate-950/85 px-4 py-2 backdrop-blur text-[11px] font-mono text-amber-300/90 mb-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-bold">CLOUDFLARE EDGE: ACTIVE</span>
          <span className="text-slate-700">|</span>
          <LiveSocialProofTicker />
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>🔒 W3C WEBCRYPTO E2EE</span>
          <span className="text-slate-700">|</span>
          <span className="text-amber-400 font-bold">HTTPS://HUYENTAM.APP</span>
        </div>
      </div>

      {/* Floating Titanium Glass Header */}
      <header className="relative z-20 w-full max-w-5xl flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/25 border border-amber-300">
            ☯
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-wider text-slate-100 uppercase font-cinzel">
              {t('brandName')}
            </h2>
            <p className="text-[11px] text-amber-400/90 font-mono">
              JCT Software Studio • International Edition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Linh Điểm / Sovereign Credit Badge */}
          <div
            onClick={() => setIsCheckoutModalOpen(true)}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition"
            title="Số dư Linh Điểm Chiêm Nghiệm"
          >
            {user.isMasterAdmin ? (
              <span className="text-amber-400">👑 Vô Hạn Linh Điểm</span>
            ) : (
              <span>⚡ {user.credits} Linh Điểm</span>
            )}
          </div>

          {/* Quick Action Trigger Buttons */}
          <button
            type="button"
            onClick={() => setIsStoryModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-300 text-xs font-semibold transition cursor-pointer"
            title={t('btnShareStory')}
          >
            <Share2 className="h-3.5 w-3.5" /> Story 9:16
          </button>

          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer"
          >
            <Crown className="h-3.5 w-3.5" /> {t('vipBtnText')}
          </button>
        </div>
      </header>

      {/* Hero Wisdom Celestial Mandala Section */}
      <section className="relative z-10 my-10 max-w-4xl text-center space-y-6">
        {/* Sacred Taiji Celestial Emblem (Replaces cartoon emoji) */}
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-amber-400/50 bg-gradient-to-b from-amber-500/25 via-slate-900 to-amber-950/40 shadow-2xl cinema-glow-gold">
          <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/30 animate-spin-slow" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-950/90 border border-amber-400/50 text-amber-400 shadow-inner">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-400 to-amber-600 drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)] select-none">
              ☯
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>2026 Sovereign International Edition</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-50 sm:text-6xl lg:text-7xl font-cinzel">
            {t('brandName')}
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-400/90 font-mono font-bold">
            International Identity: {t('brandNameEn')}
          </p>
        </div>

        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-500/30 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-2.5">
          <p className="text-xl sm:text-2xl font-bold text-amber-200 tracking-wide font-cinzel">
            {t('slogan')}
          </p>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
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

      {/* Ma Trận Càn Khôn 5 Trạm Khai Sáng (Spiritual Quest Matrix) */}
      <section className="relative z-10 w-full max-w-5xl my-8 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg md:text-xl font-bold text-slate-100 font-cinzel uppercase tracking-wider">
              Bản Đồ 5 Trạm Khai Sáng Càn Khôn
            </h2>
          </div>
          <span className="text-xs text-amber-400/90 font-mono hidden sm:inline">
            Hành trình chuyển hóa từ U Mê đến Tỉnh Thức
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Trạm 1: Minh Kiến Điện */}
          <Link
            href="/minh-kien"
            className="group relative flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-slate-900/90 cinema-glow-gold shadow-2xl overflow-hidden"
          >
            {/* Real Photographic Background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
              alt="Ải 1: Minh Kiến Điện"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700 pointer-events-none"
            />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300 border border-amber-500/40 font-mono">
                  ẢI 1
                </span>
                <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20 font-mono">
                  0.01s ENGINE
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition font-cinzel">
                {t('navMinhKien')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {language === 'en'
                  ? 'Autonomous philosophical reflection engine resolving life dilemmas with 10-point compassionate candor.'
                  : 'Gỡ rối bế tắc tâm lý & định hướng đời sống bằng 10 điểm Thẳng Thắn Có Lòng Từ.'}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-amber-400 border-t border-slate-800/80 pt-3 relative z-10">
              <span>Bước Vào Minh Kiến Điện</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Trạm 2: Huyền Bài Trận */}
          <Link
            href="/tarot"
            className="group relative flex flex-col justify-between rounded-3xl border border-purple-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-400 hover:bg-slate-900/90 cinema-glow-purple shadow-2xl overflow-hidden"
          >
            {/* Real Photographic Background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop"
              alt="Ải 2: Huyền Bài Trận"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700 pointer-events-none"
            />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-[11px] font-bold text-purple-300 border border-purple-500/40 font-mono">
                  ẢI 2
                </span>
                <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-purple-400 border border-purple-500/20 font-mono">
                  3D FLIP CARDS
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-400 transition font-cinzel">
                {t('navTarot')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {language === 'en'
                  ? '78 classical Tarot archetypes with 3D flip physics, time spread & psychological mirror.'
                  : 'Thánh trận 78 lá bài Tarot hiệu ứng 3D lật bài nghệ thuật, soi chiếu thời vận quá khứ – hiện tại – tương lai.'}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-purple-400 border-t border-slate-800/80 pt-3 relative z-10">
              <span>Khai Mở Huyền Bài Trận</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Trạm 3: Dịch Kinh Đài */}
          <Link
            href="/iching"
            className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:bg-slate-900/90 cinema-glow-emerald shadow-2xl overflow-hidden"
          >
            {/* Real Photographic Background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop"
              alt="Ải 3: Dịch Kinh Đài"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700 pointer-events-none"
            />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/40 font-mono">
                  ẢI 3
                </span>
                <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 font-mono">
                  3D BRONZE COINS
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition font-cinzel">
                {t('navIChing')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {language === 'en'
                  ? '3D ancient bronze coin flip simulation, 64 hexagrams & changing line direction.'
                  : 'Gieo 3 đồng tiền cổ Thái Cực 3D, giải mã 64 Quẻ Thần Toán & Hào Động định hướng hành động.'}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-emerald-400 border-t border-slate-800/80 pt-3 relative z-10">
              <span>Đăng Lên Dịch Kinh Đài</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Trạm 4: Tinh Tú Cung */}
          <Link
            href="/astrology"
            className="group relative flex flex-col justify-between rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:bg-slate-900/90 cinema-glow-cyan shadow-2xl overflow-hidden"
          >
            {/* Real Photographic Background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop"
              alt="Ải 4: Tinh Tú Cung"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700 pointer-events-none"
            />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[11px] font-bold text-cyan-300 border border-cyan-500/40 font-mono">
                  ẢI 4
                </span>
                <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20 font-mono">
                  12 CUNG TỬ VI
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition font-cinzel">
                {t('navAstrology')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {language === 'en'
                  ? '12-Palace Tu Vi Star Wheel, Four Pillars Bazi & Five Elements balance.'
                  : 'Bản đồ 12 Cung Tử Vi, Tứ Trụ Bát Tự & Âm Dương Ngũ Hành định vị bản thể số mệnh.'}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-cyan-400 border-t border-slate-800/80 pt-3 relative z-10">
              <span>Bước Vào Tinh Tú Cung</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Trạm 5: Dưỡng Đạo Viện */}
          <Link
            href="/duong-dao"
            className="group relative flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-6 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:bg-slate-900/90 cinema-glow-emerald shadow-2xl overflow-hidden"
          >
            {/* Real Photographic Background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
              alt="Ải 5: Dưỡng Đạo Viện"
              className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700 pointer-events-none"
            />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/40 font-mono">
                  ẢI 5
                </span>
                <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 font-mono">
                  432HZ & 4-7-8
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition font-cinzel">
                {t('navDuongDao')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                {language === 'en'
                  ? 'Tibetan singing bowls, 432Hz meditation frequencies & 4-7-8 bio-breathing for restorative calm.'
                  : 'Chuông xoay Tây Tạng 432Hz, nhịp thở 4-7-8 & dược trà Nam Dược dưỡng tâm an giấc.'}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-emerald-400 border-t border-slate-800/80 pt-3 relative z-10">
              <span>An Trú Dưỡng Đạo Viện</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Phân Hệ Quản Trị & Mật Viện */}
          <div className="flex flex-col gap-3 justify-between">
            <Link
              href="/dashboard"
              className="group flex-1 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-slate-900/70 p-4 backdrop-blur-xl transition hover:border-amber-400 hover:bg-slate-900/90 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition font-cinzel">
                    {t('navDashboard')}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {language === 'en' ? 'Mind logs & personal reflection journey' : 'Lịch sử & Nhật ký cá nhân'}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin"
              className="group flex-1 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-slate-900/70 p-4 backdrop-blur-xl transition hover:border-rose-400 hover:bg-slate-900/90 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-400 transition font-cinzel">
                    {t('navAdmin')}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {language === 'en' ? 'Sovereign Master Key & Governance' : 'Quản trị Mật Viện Sovereign'}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-rose-400 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Sovereign */}
      <footer className="relative z-10 w-full max-w-5xl border-t border-slate-800/80 pt-6 mt-10 text-center space-y-2">
        <p className="text-xs text-slate-400 font-medium max-w-3xl mx-auto">
          {t('footerDisclaimer')}
        </p>
        <p className="text-[11px] text-slate-500 font-mono">
          © 2026 HUYỀN TÂM MINH ĐẠO | Official Domain:{' '}
          <span className="text-amber-400 font-semibold">https://huyentam.app</span> | Built by JCT
          Software Studio
        </p>
      </footer>
    </main>
  );
}
