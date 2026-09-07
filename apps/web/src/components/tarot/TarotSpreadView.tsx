'use client';

import React, { useState } from 'react';
import { useTarotDraw } from '@/hooks/useTarotDraw';
import { SpreadType } from '@/types/tarot';
import { TarotCardView } from './TarotCardView';
import { SocialShareCard } from '../common/SocialShareCard';
import { UserFeedbackModal } from '../common/UserFeedbackModal';

const SAMPLE_INTENTIONS = [
  'Thông điệp soi chiếu tâm lý cho tôi trong ngày hôm nay.',
  'Góc nhìn giúp tôi giải tỏa áp lực và bế tắc công việc hiện tại.',
  'Bài học tâm lý tôi cần học qua trải nghiệm mối quan hệ này.',
  'Làm sao để tôi đưa ra quyết định tài chính sáng suốt?',
];

export const TarotSpreadView: React.FC = () => {
  const [spreadType, setSpreadType] = useState<SpreadType>('three_card');
  const [intention, setIntention] = useState<string>('');
  const { isLoading, drawData, errorMessage, drawCards, resetDraw } =
    useTarotDraw();

  const cardCount = spreadType === 'single' ? 1 : 3;

  const handleDraw = async () => {
    await drawCards(cardCount, intention);
  };

  const getCardLabel = (index: number): string => {
    if (spreadType === 'single') return 'Thông Điệp Soi Chiếu';
    if (index === 0) return 'Quá Khứ • Nền Tảng';
    if (index === 1) return 'Hiện Tại • Thực Tại';
    return 'Góc Nhìn • Hướng Tiến';
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Spread Setup Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-amber-400">
              🔮 Rút Bài Tarot — Gương Soi Tâm Lý
            </h2>
            <p className="text-xs text-slate-400">
              Triết lý Huyền Tâm: Không tiên đoán định mệnh, tự soi chiếu nhận thức
            </p>
          </div>

          {/* Spread Selector Buttons */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => {
                setSpreadType('single');
                resetDraw();
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                spreadType === 'single'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1 Lá (Hôm Nay)
            </button>
            <button
              type="button"
              onClick={() => {
                setSpreadType('three_card');
                resetDraw();
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                spreadType === 'three_card'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3 Lá (Quá Khứ - Hiện Tại - Hướng Tiến)
            </button>
          </div>
        </div>

        {/* Intention Input */}
        <div className="space-y-2">
          <label
            htmlFor="tarot-intention"
            className="block text-xs font-bold uppercase tracking-wider text-slate-300"
          >
            💭 Ý Nguyện / Câu Hỏi Tự Soi Chiếu
          </label>
          <input
            id="tarot-intention"
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Nhập tâm nguyện hoặc câu hỏi bạn muốn tự chiêm nghiệm..."
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
          />
        </div>

        {/* Sample Intentions */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400">
            💡 Gợi ý tâm nguyện mẫu:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_INTENTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIntention(item)}
                disabled={isLoading}
                className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition text-left cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetDraw}
            disabled={!drawData && !isLoading}
            className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            🔄 Rút lại từ đầu
          </button>

          <button
            type="button"
            onClick={handleDraw}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-400 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            {isLoading ? (
              <span>⏳ Đang Xáo Bài & Rút Năng Lượng...</span>
            ) : (
              <span>🔮 Rút {cardCount} Lá Bài Tarot</span>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Drawn Cards Display */}
      {drawData && drawData.cards.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Kết Quả Trải Bài Tarot • Session #{drawData.draw_id.slice(0, 8)}
              </span>
              {drawData.intention && (
                <p className="text-xs italic text-slate-300">
                  &quot;{drawData.intention}&quot;
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <UserFeedbackModal moduleName="tarot" />
              <SocialShareCard
                moduleName="TAROT SOI CHIẾU"
                title={drawData.cards[0]?.name_vi || 'Trải Bài Tarot'}
                subtitle={
                  drawData.intention
                    ? `Tâm nguyện: "${drawData.intention}"`
                    : `Trải bài ${drawData.cards.length} lá nhận thức`
                }
                insights={drawData.cards.map(
                  (c) =>
                    `${c.name_vi} (${c.orientation === 'reversed' ? 'Bài Ngược' : 'Bài Xuôi'}): ${c.meaning_vi.slice(0, 80)}...`
                )}
              />
            </div>
          </div>

          {/* Cards Grid Layout */}
          <div className="flex flex-wrap items-stretch justify-center gap-6">
            {drawData.cards.map((card, idx) => (
              <TarotCardView
                key={idx}
                card={card}
                label={getCardLabel(idx)}
                autoFlip={true}
              />
            ))}
          </div>

          {/* Psychological Mirror Disclaimer Footer */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center text-xs leading-relaxed text-slate-400 space-y-1">
            <p className="font-semibold text-amber-400/90">
              💡 [Thông Báo Ranh Giới An Toàn]:
            </p>
            <p>
              Các biểu tượng bài Tarot đóng vai trò làm gương soi tâm lý và gợi mở góc nhìn triết học tự quan sát.
              Mọi kết quả không phải là thần toán hay dự đoán định mệnh cố định. Kết quả cuộc sống hoàn toàn nằm ở quyết định và hành động thực tế của bạn.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
