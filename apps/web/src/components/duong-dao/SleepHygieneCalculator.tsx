'use client';

import React, { useState } from 'react';
import { SleepHygieneGuideInput, SleepHygieneGuideResponse } from '@/types/duong_dao';

interface SleepHygieneCalculatorProps {
  onCalculate: (input: SleepHygieneGuideInput) => Promise<SleepHygieneGuideResponse | null>;
  isLoading: boolean;
  guideResult: SleepHygieneGuideResponse | null;
}

export const SleepHygieneCalculator: React.FC<SleepHygieneCalculatorProps> = ({
  onCalculate,
  isLoading,
  guideResult,
}) => {
  const [targetHours, setTargetHours] = useState<number>(8.0);
  const [bedtimeHour, setBedtimeHour] = useState<number>(23);
  const [blueLight, setBlueLight] = useState<boolean>(true);
  const [caffeine, setCaffeine] = useState<boolean>(false);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCalculate({
      target_sleep_hours: Number(targetHours),
      bedtime_hour: Number(bedtimeHour),
      blue_light_exposure: blueLight,
      caffeine_after_3pm: caffeine,
      evening_stress_level: stressLevel,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-6">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-emerald-400">
            🌙 Đánh Giá Thói Quen Giấc Ngủ & Nhịp Sinh Học
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tự kiểm tra chỉ số tối ưu vệ sinh giấc ngủ & nhịp sinh học tự nhiên
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Hours */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              ⏰ Số giờ ngủ mong muốn mỗi đêm
            </label>
            <input
              type="number"
              step={0.5}
              min={4}
              max={12}
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Bedtime Hour */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              🛌 Giờ thường đi ngủ (0-23h)
            </label>
            <input
              type="number"
              min={0}
              max={23}
              value={bedtimeHour}
              onChange={(e) => setBedtimeHour(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setBlueLight(!blueLight)}
            className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
              blueLight
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-950 text-slate-400'
            }`}
          >
            <span>📱 Dùng điện thoại / máy tính trước khi ngủ</span>
            <span>{blueLight ? 'Có' : 'Không'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCaffeine(!caffeine)}
            className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
              caffeine
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                : 'border-slate-800 bg-slate-950 text-slate-400'
            }`}
          >
            <span>☕ Dùng cà phê / trà đậm sau 15h</span>
            <span>{caffeine ? 'Có' : 'Không'}</span>
          </button>
        </div>

        {/* Evening Stress Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            🧠 Mức độ áp lực / suy nghĩ buổi tối
          </label>
          <div className="flex gap-2">
            {[
              { id: 'low', label: '🟢 Thả lỏng nhẹ nhàng' },
              { id: 'medium', label: '🟡 Vừa phải' },
              { id: 'high', label: '🔴 Áp lực cao' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStressLevel(item.id as 'low' | 'medium' | 'high')}
                className={`flex-1 rounded-xl py-2 text-xs font-bold border transition cursor-pointer ${
                  stressLevel === item.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            {isLoading ? '⏳ Đang Tính Toán...' : '✨ Đánh Giá Chỉ Số Vệ Sinh Giấc Ngủ'}
          </button>
        </div>
      </form>

      {/* Guide Results Display */}
      {guideResult && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <h3 className="text-sm font-bold text-emerald-300">
              📊 Chỉ Số Vệ Sinh Giấc Ngủ Của Bạn
            </h3>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-extrabold text-emerald-400 border border-emerald-500/40">
              {guideResult.sleep_score} / 100 Điểm
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-200">
            <div>
              <h4 className="font-bold text-amber-300 mb-1">
                💡 Khuyên rèn luyện thói quen ban đêm:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {guideResult.habit_recommendations_vi.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-emerald-300 mb-1">
                🌿 Gợi ý nhịp sinh học 12 canh giờ:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {guideResult.daily_rhythm_tips_vi.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mandatory Educational Disclaimer */}
          <div className="rounded-lg border border-amber-500/30 bg-slate-950 p-3 text-[11px] text-amber-200/90 leading-relaxed italic">
            {guideResult.educational_disclaimer_vi}
          </div>
        </div>
      )}
    </div>
  );
};
