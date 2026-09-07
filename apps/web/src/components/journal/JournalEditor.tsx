'use client';

import React, { useState } from 'react';
import { JournalEntryCreate } from '@/types/journal';

interface JournalEditorProps {
  onSave: (data: JournalEntryCreate) => Promise<unknown>;
  isLoading: boolean;
}

const moodOptions = [
  { id: 'calm', label: '🟢 Điềm Tĩnh', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  { id: 'seeking', label: '🟡 Đang Tìm Hướng', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  { id: 'grateful', label: '🌸 Biết Ơn', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  { id: 'anxious', label: '🔴 Căng Thẳng', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  { id: 'reflective', label: '🟣 Chiêm Nghiệm', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
];

export const JournalEditor: React.FC<JournalEditorProps> = ({
  onSave,
  isLoading,
}) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [moodTag, setMoodTag] = useState<string>('reflective');
  const [sourceModule, setSourceModule] = useState<string>('general');
  const [insightTag, setInsightTag] = useState<string>('');
  const [insights, setInsights] = useState<string[]>(['nhận thức']);

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
          ✍️ Viết Nhật Ký Tự Soi Chiếu (Self-Reflection Journal)
        </h3>
        <span className="text-xs text-slate-400">Ghi chép tâm trí & bài học sống</span>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          📌 Tiêu Đề Nhật Ký / Bài Học Soi Chiếu
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề hoặc bài học chiêm nghiệm..."
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          📝 Nội Dung Chiêm Nghiệm & Cảm Nhận Thật
        </label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết ra những suy nghĩ, góc nhìn mới và cách bạn chuyển hóa cảm xúc..."
          disabled={isLoading}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none resize-none"
        />
      </div>

      {/* Mood Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          🎭 Trạng Thái Cảm Xúc Lúc Viết
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
            🔗 Gắn Lồng Mô-đun Nguồn (Không bắt buộc)
          </label>
          <select
            value={sourceModule}
            onChange={(e) => setSourceModule(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="general">Tự Quan Sát Chung (General)</option>
            <option value="tarot">Lá Bài Tarot (Tarot Draw)</option>
            <option value="iching">Quẻ Kinh Dịch (I Ching Toss)</option>
            <option value="astrology">Bát Tự / Tử Vi (Astrology Chart)</option>
            <option value="minh_kien">Minh Kiến Consultation</option>
          </select>
        </div>

        {/* Insights Tags */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            🏷️ Từ Khóa Nhận Thức (Insights)
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
              placeholder="Nhập từ khóa và nhấn Thêm..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddInsight}
              className="rounded-xl border border-slate-800 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              + Thêm
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
          {isLoading ? '⏳ Đang Lưu...' : '💾 Lưu Nhật Ký Soi Chiếu'}
        </button>
      </div>
    </form>
  );
};
