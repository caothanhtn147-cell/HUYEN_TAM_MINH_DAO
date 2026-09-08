'use client';

import React, { useEffect, useState } from 'react';
import { useDuongDao } from '@/hooks/useDuongDao';
import { DuongDaoCategory } from '@/types/duong_dao';
import { SleepHygieneCalculator } from './SleepHygieneCalculator';
import { DuongDaoArticleCard } from './DuongDaoArticleCard';
import { SoundWaveVisualizer } from '../common/SoundWaveVisualizer';
import { BreathingGuideCircle } from '../common/BreathingGuideCircle';

export const DuongDaoView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    DuongDaoCategory | 'ALL'
  >('ALL');

  const {
    isLoading,
    articles,
    sleepGuide,
    errorMessage,
    fetchArticles,
    calculateSleepGuide,
  } = useDuongDao();

  useEffect(() => {
    fetchArticles(
      selectedCategory === 'ALL' ? undefined : (selectedCategory as DuongDaoCategory)
    );
  }, [fetchArticles, selectedCategory]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* 432Hz Sound Generator */}
      <SoundWaveVisualizer />

      {/* 4-7-8 Bio Breathing Guide */}
      <BreathingGuideCircle />

      {/* Interactive Sleep Hygiene Calculator Widget */}
      <SleepHygieneCalculator
        onCalculate={calculateSleepGuide}
        isLoading={isLoading}
        guideResult={sleepGuide}
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
        {[
          { id: 'ALL', label: '📚 Tất Cả Bài Viết' },
          { id: 'SLEEP_HYGIENE', label: '🌙 Vệ Sinh Giấc Ngủ' },
          { id: 'DAILY_RHYTHMS', label: '🕰️ Nhịp Sinh Học' },
          { id: 'SEASONAL_WELLNESS', label: '🌿 24 Tiết Khí' },
          { id: 'TRADITIONAL_HERITAGE', label: '📜 Di Sản Nam Dược' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedCategory(item.id as DuongDaoCategory | 'ALL')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer border ${
              selectedCategory === item.id
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/5'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        {isLoading && articles.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            ⏳ Đang tải thư viện bài viết Dưỡng Đạo...
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Chưa có bài viết trong danh mục này.
          </div>
        ) : (
          articles.map((article) => (
            <DuongDaoArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
};
