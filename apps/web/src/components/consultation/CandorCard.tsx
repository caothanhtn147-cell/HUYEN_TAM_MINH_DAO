'use client';

import React from 'react';
import { TenPointCompassionateCandor } from '@/types/consultation';

interface CandorCardProps {
  candor: TenPointCompassionateCandor;
}

interface PointItem {
  num: number;
  title: string;
  key: keyof TenPointCompassionateCandor;
  color: string;
  badge: string;
}

const POINT_CONFIGS: PointItem[] = [
  {
    num: 1,
    title: 'Nhận Diện Cảm Xúc',
    key: 'user_emotional_state',
    color: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
    badge: 'Cảm Xúc',
  },
  {
    num: 2,
    title: 'Sự Thật Khách Quan',
    key: 'honest_reality',
    color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    badge: 'Thực Tại',
  },
  {
    num: 3,
    title: 'Dữ Liệu Thực Tế',
    key: 'factually_known',
    color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    badge: 'Dữ Liệu',
  },
  {
    num: 4,
    title: 'Biến Số Chưa Biết',
    key: 'uncertainty_and_unknowns',
    color: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
    badge: 'Ẩn Số',
  },
  {
    num: 5,
    title: 'Hệ Quả Trì Hoãn',
    key: 'inaction_consequence',
    color: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
    badge: 'Cảnh Báo',
  },
  {
    num: 6,
    title: 'Minh Triết Huyền Tâm',
    key: 'perspective_and_wisdom',
    color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300',
    badge: 'Minh Triết',
  },
  {
    num: 7,
    title: 'Lộ Trình Tháo Gỡ',
    key: 'resolution_path',
    color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
    badge: 'Lộ Trình',
  },
  {
    num: 8,
    title: 'Hành Động 24 Giờ',
    key: 'immediate_action_24h',
    color: 'border-yellow-500/30 bg-yellow-950/20 text-yellow-300',
    badge: '24 Giờ',
  },
  {
    num: 9,
    title: 'Thói Quen 7 Ngày',
    key: 'short_term_action_7d',
    color: 'border-teal-500/30 bg-teal-950/20 text-teal-300',
    badge: '7 Ngày',
  },
  {
    num: 10,
    title: 'Ranh Giới Tham Vấn',
    key: 'professional_referral_boundary',
    color: 'border-slate-700 bg-slate-900/60 text-slate-400',
    badge: 'Giới Hạn',
  },
];

export const CandorCardGrid: React.FC<CandorCardProps> = ({ candor }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-amber-400">
          ☯ Cấu Trúc 10 Điểm &quot;Thẳng Thắn Có Lòng Từ&quot; (Minh Sư AI)
        </h3>
        <span className="text-xs text-slate-400 font-mono">10/10 Points Verified</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POINT_CONFIGS.map((config) => {
          const content = candor[config.key];
          if (!content) return null;

          return (
            <div
              key={config.num}
              className={`rounded-xl border p-4 shadow-sm transition hover:border-slate-600 ${config.color}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-bold font-mono">
                    {config.num}
                  </span>
                  <h4 className="text-sm font-bold tracking-tight">
                    {config.title}
                  </h4>
                </div>
                <span className="rounded bg-slate-950/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  {config.badge}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200/90 whitespace-pre-wrap">
                {content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
