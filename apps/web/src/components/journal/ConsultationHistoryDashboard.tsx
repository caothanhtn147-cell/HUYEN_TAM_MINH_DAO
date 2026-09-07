'use client';

import React from 'react';
import { ConsultationHistoryItem } from '@/types/journal';

interface ConsultationHistoryDashboardProps {
  history: ConsultationHistoryItem[];
  isLoading: boolean;
}

const moduleBadges: Record<string, { label: string; badge: string; icon: string }> = {
  tarot: {
    label: 'Rút Bài Tarot',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    icon: '🃏',
  },
  iching: {
    label: 'Gieo Quẻ Kinh Dịch',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    icon: '☯️',
  },
  astrology: {
    label: 'Lá Số Bát Tự & Tử Vi',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    icon: '🏛️',
  },
  minh_kien: {
    label: 'Minh Kiến Stream',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    icon: '🔮',
  },
};

export const ConsultationHistoryDashboard: React.FC<
  ConsultationHistoryDashboardProps
> = ({ history, isLoading }) => {
  if (isLoading && history.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        ⏳ Đang tải lịch sử chiêm nghiệm...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs space-y-2">
        <p className="font-bold text-slate-400">Chưa có lịch sử chiêm nghiệm nào.</p>
        <p>Thực hiện rút bài Tarot, gieo quẻ Kinh Dịch hoặc lập lá số Bát Tự để lưu lại hành trình tự soi chiếu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-amber-400">
          📜 Lịch Sử Chiêm Nghiệm & Gương Soi Tâm Lý
        </h3>
        <span className="text-xs text-slate-400">{history.length} sự kiện</span>
      </div>

      <div className="space-y-3">
        {history.map((item) => {
          const mod = moduleBadges[item.module_type] || {
            label: item.module_type,
            badge: 'bg-slate-800 text-slate-300 border-slate-700',
            icon: '✨',
          };

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur space-y-2.5 transition hover:border-slate-700"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold border ${mod.badge}`}
                >
                  {mod.icon} {mod.label}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {new Date(item.timestamp).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100">
                  {item.title_vi}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary_vi}
                </p>
              </div>

              <div className="text-[11px] font-mono text-slate-500 pt-1">
                Mã tham chiếu: <span className="text-slate-400">{item.reference_id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
