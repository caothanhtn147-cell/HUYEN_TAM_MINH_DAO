'use client';

import React, { useState } from 'react';
import { DuongDaoArticle } from '@/types/duong_dao';

interface DuongDaoArticleCardProps {
  article: DuongDaoArticle;
}

const categoryLabels: Record<string, { label: string; badge: string }> = {
  SLEEP_HYGIENE: {
    label: '🌙 Vệ Sinh Giấc Ngủ',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  },
  DAILY_RHYTHMS: {
    label: '🕰️ Nhịp Sinh Học',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  SEASONAL_WELLNESS: {
    label: '🌿 24 Tiết Khí',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  TRADITIONAL_HERITAGE: {
    label: '📜 Di Sản Nam Dược',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
};

export const DuongDaoArticleCard: React.FC<DuongDaoArticleCardProps> = ({
  article,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const cat = categoryLabels[article.category] || {
    label: article.category,
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-4 transition hover:border-slate-700">
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${cat.badge}`}
        >
          {cat.label}
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          {new Date(article.created_at).toLocaleDateString('vi-VN')}
        </span>
      </div>

      {/* Title & Summary */}
      <div className="space-y-1">
        <h3 className="text-lg md:text-xl font-extrabold text-slate-50 tracking-tight">
          {article.title_vi}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {article.summary_vi}
        </p>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-950 px-2 py-0.5 text-[11px] font-semibold text-slate-400 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="pt-4 border-t border-slate-800/80 space-y-4 text-xs md:text-sm text-slate-200 leading-relaxed">
          {/* Main Content */}
          <div className="whitespace-pre-line bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            {article.content_vi}
          </div>

          {/* Historical Context */}
          {article.historical_context_vi && (
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                📜 Bối Cảnh Lịch Sử & Y Học Cổ Truyền
              </h4>
              <p className="text-xs text-purple-100 font-medium italic">
                {article.historical_context_vi}
              </p>
            </div>
          )}

          {/* Educational Disclaimer */}
          <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-3 text-[11px] text-amber-200/90 leading-relaxed italic">
            {article.educational_disclaimer_vi}
          </div>
        </div>
      )}

      {/* Expand / Collapse Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer flex items-center gap-1"
        >
          {isExpanded ? '📖 Thu gọn bài viết' : '📖 Đọc toàn bộ nội dung giáo dục'}
        </button>
      </div>
    </div>
  );
};
