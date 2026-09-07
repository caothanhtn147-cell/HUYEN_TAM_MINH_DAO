'use client';

import React, { useState } from 'react';
import { useMinhKienStream } from '@/hooks/useMinhKienStream';
import { CandorCardGrid } from './CandorCard';
import { WalletIndicator } from './WalletIndicator';

const SAMPLE_PROMPTS = [
  'Tôi cảm thấy lo lắng và bế tắc trong định hướng sự nghiệp.',
  'Gia đình tôi thường xuyên bất hòa về quan điểm sống.',
  'Tôi có nên đưa ra quyết định thay đổi công việc ngay bây giờ?',
  'Áp lực tài chính hiện tại khiến tôi kiệt quệ và mất ngủ.',
];

export const StreamView: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number>(50); // Demo default balance
  const {
    status,
    streamText,
    responsePayload,
    errorMessage,
    startConsultation,
    resetStream,
  } = useMinhKienStream();

  const handleConsult = async (queryText: string) => {
    if (!queryText.trim() || status === 'connecting' || status === 'streaming') return;

    if (userBalance < 10) {
      alert('Số dư Linh Điểm không đủ (Yêu cầu tối thiểu 10 Linh Điểm). Vui lòng nạp thêm.');
      return;
    }

    await startConsultation(queryText.trim(), 'mock');
    // Deduct 10 credits locally for UI state update
    setUserBalance((prev) => Math.max(0, prev - 10));
  };

  const handleTopUp = () => {
    const added = 50;
    setUserBalance((prev) => prev + added);
    alert(`Nạp thành công +${added} Linh Điểm! (Số dư mới: ${userBalance + added})`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Wallet Balance Header */}
      <WalletIndicator balance={userBalance} sessionCost={10} onTopUpClick={handleTopUp} />

      {/* Main Consultation Input Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="consultation-input" className="text-sm font-bold text-slate-200">
            💬 Trăn Trở & Câu Hỏi Chiêm Nghiệm Của Bạn
          </label>
          <span className="text-xs text-amber-400 font-medium">
            Phân Tích Bằng Minh Sư AI (10-Point Candor)
          </span>
        </div>

        <textarea
          id="consultation-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập trăn trở, bế tắc hoặc thắc mắc của bạn về sự nghiệp, tình cảm, tài chính hay cuộc sống..."
          rows={4}
          disabled={status === 'connecting' || status === 'streaming'}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
        />

        {/* Sample Prompt Suggestions */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400">
            💡 Gợi ý câu hỏi mẫu:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                }}
                disabled={status === 'connecting' || status === 'streaming'}
                className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition active:scale-95 text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetStream}
            disabled={status === 'idle'}
            className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            🔄 Xóa phiên
          </button>

          <button
            type="button"
            onClick={() => handleConsult(query)}
            disabled={!query.trim() || status === 'connecting' || status === 'streaming'}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-400 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            {status === 'connecting' ? (
              <span>⏳ Đang Kết Nối Minh Sư AI...</span>
            ) : status === 'streaming' ? (
              <span>⚡ Đang Phân Tích...</span>
            ) : (
              <span>☯ Chiêm Nghiệm Quẻ Minh Kiến (-10 Linh Điểm)</span>
            )}
          </button>
        </div>
      </div>

      {/* Error / Insufficient Balance Alert */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 font-medium space-y-1">
          <p className="font-bold">⚠️ Thông Báo Lỗi System:</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Emergency Crisis Alert Banner */}
      {status === 'crisis_alert' && responsePayload?.hotline_contacts && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-5 text-amber-200 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
            <span>⚠️</span>
            <span>CẢNH BÁO KHỦNG HOẢNG TÂM LÝ & ĐƯỜNG DÂY NÓNG HỖ TRỢ KHẨN CẤP</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hệ thống phát hiện nội dung cần sự can thiệp y tế/tâm lý chuyên nghiệp. Minh Sư AI không thay thế chuyên gia khẩn cấp.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {responsePayload.hotline_contacts.map((contact, idx) => (
              <div key={idx} className="rounded-lg border border-amber-500/20 bg-slate-950 p-3 text-xs">
                <p className="font-bold text-amber-300">{contact.name}</p>
                <p className="text-lg font-extrabold text-amber-400 font-mono my-0.5">{contact.number}</p>
                <p className="text-[11px] text-slate-400">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Response Content */}
      {streamText && (
        <div className="space-y-6">
          {/* Structured 10-Point Candor Cards if parsed */}
          {responsePayload?.structured_candor ? (
            <CandorCardGrid candor={responsePayload.structured_candor} />
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-sm font-bold text-amber-400">
                ☯ Lời Khuyên Từ Minh Sư AI ({responsePayload?.provider || 'AI Engine'} - {responsePayload?.model || 'v1'})
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {streamText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
