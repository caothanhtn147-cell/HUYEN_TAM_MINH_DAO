'use client';

import React, { useState } from 'react';
import { useIChingToss } from '@/hooks/useIChingToss';
import { IChingLineView } from './IChingLineView';
import { IChingHexagramCardView } from './IChingHexagramCardView';
import { CoinTossLine } from '@/types/iching';
import { SocialShareCard } from '../common/SocialShareCard';
import { UserFeedbackModal } from '../common/UserFeedbackModal';
import { Coin3D } from './Coin3D';
import { PerspectiveMatrixSelector, PerspectiveMode } from '../common/PerspectiveMatrixSelector';

const SAMPLE_INTENTIONS = [
  'Hướng đi sáng suốt và điềm tĩnh cho sự nghiệp hiện tại.',
  'Bài học ứng xử và sự bao dung trong mối quan hệ cá nhân.',
  'Làm sao để tôi vượt qua cảm giác bế tắc và thiếu định hướng?',
  'Nguyên lý duy trì sự cân bằng giữa hành động và tĩnh lặng.',
];

export const IChingCoinTossView: React.FC = () => {
  const [intention, setIntention] = useState<string>('');
  const [interactiveMode, setInteractiveMode] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 to 6
  const [stepTosses, setStepTosses] = useState<CoinTossLine[]>([]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [perspective, setPerspective] = useState<PerspectiveMode>('JCT_GOVERNANCE');

  const { isLoading, tossData, errorMessage, executeToss, resetToss } =
    useIChingToss();

  // Reset full state
  const handleReset = () => {
    resetToss();
    setCurrentStep(0);
    setStepTosses([]);
    setIsFlipping(false);
  };

  // Instant Full Toss
  const handleInstantToss = async () => {
    handleReset();
    const result = await executeToss(intention);
    if (result) {
      setCurrentStep(6);
      setStepTosses(result.tosses);
    }
  };

  // Step-by-step interactive toss (simulating coin flips client-side until 6th toss calls API or syncs)
  const handleStepToss = async () => {
    if (currentStep >= 6 || isFlipping) return;

    setIsFlipping(true);

    // If starting step 1, trigger background API fetch or simulate step
    if (currentStep === 0 && !tossData) {
      const result = await executeToss(intention);
      if (!result) {
        setIsFlipping(false);
        return;
      }
      // Add delay for realistic coin flip animation
      setTimeout(() => {
        setStepTosses([result.tosses[0]]);
        setCurrentStep(1);
        setIsFlipping(false);
      }, 500);
      return;
    }

    // Advance step from pre-fetched tossData
    if (tossData && currentStep < 6) {
      setTimeout(() => {
        const nextStep = currentStep + 1;
        setStepTosses(tossData.tosses.slice(0, nextStep));
        setCurrentStep(nextStep);
        setIsFlipping(false);
      }, 500);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Controls Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-amber-400">
              ☯️ Gieo Quẻ Kinh Dịch — 3 Đồng Xu 6 Hào
            </h2>
            <p className="text-xs text-slate-400">
              Triết lý Huyền Tâm Minh Đạo: Gương soi chuyển dịch tự nhiên & trí tuệ sống
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => {
                setInteractiveMode(true);
                handleReset();
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                interactiveMode
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🎲 Gieo Từng Hào (6 Lần)
            </button>
            <button
              type="button"
              onClick={() => {
                setInteractiveMode(false);
                handleReset();
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                !interactiveMode
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚡ Gieo Nhanh Toàn Bộ
            </button>
          </div>
        </div>

        {/* Intention Input */}
        <div className="space-y-2">
          <label
            htmlFor="iching-intention"
            className="block text-xs font-bold uppercase tracking-wider text-slate-300"
          >
            💭 Ý Nguyện / Tâm Sự Cần Soi Chiếu
          </label>
          <input
            id="iching-intention"
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Nhập tâm sự hoặc vấn đề bạn muốn xin góc nhìn Kinh Dịch..."
            disabled={isLoading || isFlipping || currentStep > 0}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
          />
        </div>

        {/* Sample Intentions */}
        {currentStep === 0 && (
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
        )}

        {/* 3D Coin Toss Animation */}
        <Coin3D
          isFlipping={isFlipping}
          values={
            stepTosses.length > 0
              ? [
                  stepTosses[stepTosses.length - 1].coin1,
                  stepTosses[stepTosses.length - 1].coin2,
                  stepTosses[stepTosses.length - 1].coin3,
                ]
              : [3, 3, 2]
          }
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={currentStep === 0 && !tossData && !isLoading}
            className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            🔄 Gieo Lại Từ Đầu
          </button>

          {interactiveMode ? (
            <button
              type="button"
              onClick={handleStepToss}
              disabled={isLoading || isFlipping || currentStep >= 6}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-400 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {isFlipping ? (
                <span className="animate-pulse">🪙 Đang Xoay 3 Đồng Xu...</span>
              ) : currentStep === 0 ? (
                <span>🪙 Gieo Hào 1 (Bắt Đầu)</span>
              ) : currentStep < 6 ? (
                <span>🪙 Gieo Hào {currentStep + 1} / 6</span>
              ) : (
                <span>✅ Hoàn Tất 6 Hào</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleInstantToss}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-400 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {isLoading ? (
                <span>⏳ Đang Khởi Tạo Quẻ...</span>
              ) : (
                <span>☯️ Gieo Trọn Bộ 6 Hào</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 5-Perspective Matrix Selector */}
      <PerspectiveMatrixSelector
        currentPerspective={perspective}
        onChangePerspective={setPerspective}
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Live Interactive Coin Toss Progress (Lines built bottom-up) */}
      {interactiveMode && stepTosses.length > 0 && currentStep < 6 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-amber-400">
              🪙 Tiến Trình Gieo Hào ({stepTosses.length} / 6 Hào)
            </h3>
            <span className="text-xs text-slate-400">
              Gieo từ Hào 1 (dưới) lên Hào 6 (trên)
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            {/* Display tossed lines in reverse order (Line 6 top to Line 1 bottom) */}
            {[6, 5, 4, 3, 2, 1].map((lineNum) => {
              const toss = stepTosses.find((t) => t.line_number === lineNum);
              if (!toss) {
                return (
                  <div
                    key={lineNum}
                    className="flex items-center gap-3 opacity-30 my-1"
                  >
                    <span className="w-14 text-xs font-mono text-slate-500 text-right">
                      Hào {lineNum}
                    </span>
                    <div className="flex-1 h-7 rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-[11px] text-slate-600">
                      Chờ gieo...
                    </div>
                  </div>
                );
              }

              return (
                <IChingLineView
                  key={lineNum}
                  lineNumber={toss.line_number}
                  lineValue={toss.line_value}
                  lineType={toss.line_type}
                  isChanging={toss.is_changing}
                  showDetails={true}
                  tossDetails={toss}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Reading Results (Hexagram Cards) */}
      {tossData && (currentStep === 6 || !interactiveMode) && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ☯️ Kết Quả Quẻ Kinh Dịch Soi Chiếu
              </span>
              {tossData.intention && (
                <p className="text-xs text-slate-300 italic">
                  Ý nguyện: &quot;{tossData.intention}&quot;
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <UserFeedbackModal moduleName="iching" />
              <SocialShareCard
                moduleName="QUẺ KINH DỊCH"
                title={tossData.primary_hexagram.name_vi}
                subtitle={
                  tossData.transformed_hexagram
                    ? `Biến Quẻ: ${tossData.transformed_hexagram.name_vi}`
                    : 'Quẻ Thuần (Không Hào Động)'
                }
                insights={[
                  `Lời quẻ: ${tossData.primary_hexagram.judgement_vi.slice(0, 90)}...`,
                  `Chiêm nghiệm: ${tossData.primary_hexagram.wisdom_reflection_vi.slice(0, 90)}...`,
                ]}
              />
            </div>
          </div>

          {/* Hexagram Cards Grid / Stack */}
          <div className="grid grid-cols-1 gap-6">
            {/* Primary Hexagram */}
            <IChingHexagramCardView
              hexagram={tossData.primary_hexagram}
              titleBadge="Quẻ Gốc (Chủ Quẻ Thực Tại)"
              isTransformed={false}
              changingLineNumbers={tossData.changing_line_numbers}
            />

            {/* Transformed Hexagram (if changing lines present) */}
            {tossData.transformed_hexagram && (
              <IChingHexagramCardView
                hexagram={tossData.transformed_hexagram}
                titleBadge="Quẻ Biến (Xu Hướng Chuyển Dịch)"
                isTransformed={true}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
