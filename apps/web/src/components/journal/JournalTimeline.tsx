'use client';

import React from 'react';
import { JournalEntry } from '@/types/journal';

interface JournalTimelineProps {
  entries: JournalEntry[];
  onDelete: (id: string) => Promise<boolean>;
  isLoading: boolean;
}

const moodBadgeMap: Record<string, { label: string; badge: string }> = {
  calm: { label: '🟢 Điềm Tĩnh', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  seeking: { label: '🟡 Đang Tìm Hướng', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  grateful: { label: '🌸 Biết Ơn', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  anxious: { label: '🔴 Căng Thẳng', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  reflective: { label: '🟣 Chiêm Nghiệm', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
};

const moduleLabels: Record<string, string> = {
  tarot: '🃏 Bài Tarot',
  iching: '☯️ Kinh Dịch',
  astrology: '🏛️ Bát Tự & Tử Vi',
  minh_kien: '🔮 Consultation Stream',
  general: '📝 Nhật Ký Tự Quan Sát',
};

export const JournalTimeline: React.FC<JournalTimelineProps> = ({
  entries,
  onDelete,
  isLoading,
}) => {
  if (isLoading && entries.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs">
        ⏳ Đang tải dòng thời gian nhật ký...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs space-y-1">
        <p className="font-bold text-slate-400">Chưa có nhật ký tự soi chiếu nào.</p>
        <p>Hãy dùng biểu mẫu phía trên để ghi chép lại cảm nhận & nhận thức của bạn.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const mood = moodBadgeMap[entry.mood_tag] || {
          label: entry.mood_tag,
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
        };
        const modLabel = moduleLabels[entry.source_module] || entry.source_module;

        return (
          <div
            key={entry.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur space-y-3 transition hover:border-slate-700"
          >
            {/* Header Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${mood.badge}`}
                >
                  {mood.label}
                </span>
                <span className="rounded-md bg-slate-950 px-2 py-0.5 text-[11px] font-semibold text-slate-400 border border-slate-800">
                  {modLabel}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-500">
                  {new Date(entry.created_at).toLocaleString('vi-VN')}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(entry.id)}
                  className="text-xs font-bold text-slate-500 hover:text-rose-400 transition"
                  title="Xóa nhật ký này"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Title & Content */}
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-50">
                {entry.title}
              </h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>
            </div>

            {/* Insights Tags */}
            {entry.insights && entry.insights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.insights.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-950 px-2 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
