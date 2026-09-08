'use client';

import React, { useState } from 'react';
import { JournalEntryCreate } from '@/types/journal';
import { useLanguage } from '@/context/LanguageContext';

interface JournalEditorProps {
  onSave: (data: JournalEntryCreate) => Promise<unknown>;
  isLoading: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  onSave,
  isLoading,
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [moodTag, setMoodTag] = useState<string>('reflective');
  const [sourceModule, setSourceModule] = useState<string>('general');
  const [insightTag, setInsightTag] = useState<string>('');
  const [insights, setInsights] = useState<string[]>(['insight']);

  const moodOptions = [
    { id: 'calm', label: t('dashMoodPeace') },
    { id: 'seeking', label: t('dashMoodSeeking') },
    { id: 'grateful', label: t('dashMoodGratitude') },
    { id: 'anxious', label: t('dashMoodStress') },
    { id: 'reflective', label: t('dashMoodReflect') },
  ];

  const handleAddInsight = () => {
    if (insightTag.trim() && !insights.includes(insightTag.trim())) {
      setInsights([...insights, insightTag.trim()]);
      setInsightTag('');
    }
  };

  const handleRemoveInsight = (tag: string) => {
    setInsights(insights.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await onSave({
      title: title.trim(),
      content: content.trim(),
      mood_tag: moodTag,
      source_module: sourceModule,
      insights,
    });

    setTitle('');
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-4"
    >
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-amber-400">
          {t('dashJournalHeader')}
        </h3>
        <span className="text-xs text-slate-400">{t('dashJournalSub')}</span>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          📌 {t('dashJournalHeader')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('dashInputTitlePlaceholder')}
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          📝 {t('dashJournalSub')}
        </label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('dashInputContentPlaceholder')}
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
        />
      </div>

      {/* Mood Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          {t('dashMoodLabel')}
        </label>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMoodTag(item.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                moodTag === item.id
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Source Module Selection & Insights Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Module */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            {t('dashSourceModuleLabel')}
          </label>
          <select
            value={sourceModule}
            onChange={(e) => setSourceModule(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="general">{t('dashSourceGeneral')}</option>
            <option value="tarot">Tarot</option>
            <option value="iching">I Ching</option>
            <option value="astrology">Astrology</option>
            <option value="minh_kien">Minh Kiến AI</option>
          </select>
        </div>

        {/* Insights Tags */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            {t('dashKeywordsLabel')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={insightTag}
              onChange={(e) => setInsightTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInsight();
                }
              }}
              placeholder={t('dashKeywordsPlaceholder')}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddInsight}
              className="rounded-xl border border-slate-800 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              {t('dashBtnAddKeyword')}
            </button>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {insights.map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-950 px-2 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30 flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveInsight(tag)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading || !title.trim() || !content.trim()}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-400 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-amber-500/10"
        >
          {isLoading ? '⏳...' : t('dashBtnSaveJournal')}
        </button>
      </div>
    </form>
  );
};
