'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  ArrowLeft,
  Compass,
  Sparkles,
  ChevronDown,
  Layers,
  Crown,
  KeyRound,
  Check,
} from 'lucide-react';

interface StageItem {
  stage: string;
  name: string;
  href: string;
  desc: string;
  badge: string;
}

const STAGES: StageItem[] = [
  {
    stage: 'ẢI 1',
    name: 'Minh Kiến Điện',
    href: '/minh-kien',
    desc: 'Soi sáng tâm trí bằng triết học thực tiễn',
    badge: '10-Point Candor',
  },
  {
    stage: 'ẢI 2',
    name: 'Huyền Bài Trận',
    href: '/tarot',
    desc: '78 Thánh trận Tarot 3D lật bài nghệ thuật',
    badge: '78 Thần Thẻ',
  },
  {
    stage: 'ẢI 3',
    name: 'Dịch Kinh Đài',
    href: '/iching',
    desc: 'Gieo đồng tiền Thái Cực 3D & 64 Quẻ',
    badge: '64 Quẻ Thần Toán',
  },
  {
    stage: 'ẢI 4',
    name: 'Tinh Tú Cung',
    href: '/astrology',
    desc: 'Lá số 12 Cung Tử Vi & Tứ Trụ Bát Tự',
    badge: 'Ngũ Hành Bát Tự',
  },
  {
    stage: 'ẢI 5',
    name: 'Dưỡng Đạo Viện',
    href: '/duong-dao',
    desc: 'Chuông xoay 432Hz & Nhịp thở 4-7-8',
    badge: '432Hz & Nam Dược',
  },
];

export const UniversalNavigationBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setRole, topUpCredits } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [keySuccess, setKeySuccess] = useState(false);

  // Shortcut key listener: Ctrl + Shift + S for Sovereign Master Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setShowKeyModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUnlockSovereign = () => {
    const trimmed = secretInput.trim().toUpperCase();
    if (trimmed === 'JCT-MASTER-KEY' || trimmed === 'JCT2026' || trimmed === 'SUPHU') {
      setRole('sovereign_admin');
      topUpCredits(999999);
      setKeySuccess(true);
      setTimeout(() => {
        setShowKeyModal(false);
        setKeySuccess(false);
        setSecretInput('');
      }, 1200);
    } else {
      alert('Khẩu lệnh không chính xác. Mật viện chỉ dành cho Tổng Tư Lệnh Sư Phụ JCT.');
    }
  };

  const currentStage = STAGES.find((s) => s.href === pathname);
  const isHomePage = pathname === '/';

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-6">
          {/* Left: Back / Portal Return */}
          <div className="flex items-center gap-2">
            {!isHomePage ? (
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 active:scale-95 shadow-md shadow-amber-500/10 cursor-pointer"
                title="Quay lại Cổng Thần Đạo Càn Khôn"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Về Thần Trận</span>
                <span className="sm:hidden">Về</span>
              </button>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black text-sm">
                  ☯
                </div>
                <span className="hidden sm:inline font-cinzel tracking-widest text-slate-100">
                  HUYỀN TÂM MINH ĐẠO
                </span>
              </Link>
            )}

            {/* Current Stage Indicator */}
            {currentStage && (
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/20">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span className="font-bold text-amber-400">{currentStage.stage}:</span>
                <span className="text-slate-200">{currentStage.name}</span>
              </div>
            )}
          </div>

          {/* Center: Stage Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500/40 hover:text-amber-300 transition cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline">Chuyển Cửa Ải (5 Trạm)</span>
              <span className="md:hidden">Ải Càn Khôn</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 rounded-2xl border border-amber-500/30 bg-slate-950 p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400/90 border-b border-slate-800 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" /> Bản Đồ 5 Trạm Khai Sáng Càn Khôn
                </div>
                {STAGES.map((stg) => {
                  const isActive = pathname === stg.href;
                  return (
                    <Link
                      key={stg.href}
                      href={stg.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-start justify-between p-2.5 rounded-xl transition ${
                        isActive
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                          : 'hover:bg-slate-900 text-slate-300 hover:text-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            {stg.stage}
                          </span>
                          <span className="text-xs font-bold text-slate-100">{stg.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{stg.desc}</p>
                      </div>
                      <span className="text-[10px] text-amber-400 font-medium">
                        {stg.badge}
                      </span>
                    </Link>
                  );
                })}

                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between px-2 text-[11px]">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-slate-400 hover:text-amber-300 transition py-1"
                  >
                    📊 Nhật ký cá nhân
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-amber-400 hover:text-amber-300 font-bold transition py-1"
                  >
                    🛡️ Quản trị Mật Viện
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: User Status & Language Switcher */}
          <div className="flex items-center gap-2">
            {/* Sovereign Key Indicator / Trigger */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                user.isMasterAdmin
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-amber-500/40 hover:text-amber-300'
              }`}
              title={
                user.isMasterAdmin
                  ? 'Tổng Tư Lệnh Sư Phụ JCT (Toàn Quyền Vô Hạn)'
                  : 'Nhấn để mở Cổng Mật Viện Sovereign (Ctrl + Shift + S)'
              }
            >
              {user.isMasterAdmin ? (
                <>
                  <Crown className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sư Phụ JCT</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Mật Lệnh</span>
                </>
              )}
            </button>

            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Sovereign Master Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-900/95 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Crown className="h-5 w-5" />
                <h3 className="font-cinzel text-base uppercase">CỔNG MẬT VIỆN SOVEREIGN</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Dành riêng cho <strong className="text-amber-300">Tổng Tư Lệnh Sư Phụ JCT</strong>. Nhập mật mã hoặc khẩu lệnh tối cao để mở khóa 100% quyền năng, không giới hạn Linh Điểm:
            </p>

            {keySuccess ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center text-emerald-300 space-y-2">
                <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                  <Check className="h-5 w-5 text-emerald-400" />
                  <span>XÁC NHẬN: TỔNG TƯ LỆNH SƯ PHỤ JCT</span>
                </div>
                <p className="text-xs text-slate-300">
                  Toàn quyền truy cập Mật Viện & Vô hạn Linh Điểm đã được kích hoạt thành công!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlockSovereign()}
                  placeholder="Nhập Mật Mã Sư Phụ (Gợi ý: JCT-MASTER-KEY)..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  autoFocus
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-mono">Phím tắt: Ctrl + Shift + S</span>
                  <button
                    onClick={handleUnlockSovereign}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
                  >
                    <span>Mở Khóa Toàn Quyền</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UniversalNavigationBar;
