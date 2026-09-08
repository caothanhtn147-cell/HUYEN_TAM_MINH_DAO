'use client';

import React, { useState } from 'react';
import { useMinhKienStream } from '@/hooks/useMinhKienStream';
import { useAuth } from '@/context/AuthContext';
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
  const { user, deductCredits, topUpCredits } = useAuth();
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

    if (!user.isMasterAdmin && user.credits < 10) {
      alert('Số dư Linh Điểm không đủ (Yêu cầu tối thiểu 10 Linh Điểm). Vui lòng nhấn nút Nạp Linh Điểm.');
      return;
    }

    // Deduct credits if not Master Admin
    if (!user.isMasterAdmin) {
      deductCredits(10);
    }

    await startConsultation(queryText.trim(), 'mock');
  };

  const handleTopUp = () => {
    topUpCredits(50);
    alert('Nạp thành công +50 Linh Điểm! Bạn đã sẵn sàng chiêm nghiệm.');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Wallet Balance Header */}
      <WalletIndicator
        balance={user.isMasterAdmin ? 999999 : user.credits}
        sessionCost={10}
        onTopUpClick={handleTopUp}
      />

      {/* Main Consultation Input Panel */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="consultation-input" className="text-sm font-bold text-slate-200">
            💬 Trăn Trở & Câu Hỏi Chiêm Nghiệm Của Bạn
          </label>
          <span className="text-xs text-amber-400 font-semibold">
            Minh Sư AI • 10-Point Compassionate Candor
          </span>
        </div>

        <textarea
          id="consultation-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập trăn trở, bế tắc hoặc thắc mắc của bạn về sự nghiệp, tình cảm, tài chính hay cuộc sống..."
          rows={4}
          disabled={status === 'connecting' || status === 'streaming'}
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
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
                onClick={() => setQuery(prompt)}
                disabled={status === 'connecting' || status === 'streaming'}
                className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition active:scale-95 text-left cursor-pointer"
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
            className="rounded-xl border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
          >
            🔄 Xóa phiên
          </button>

          <button
            type="button"
            onClick={() => handleConsult(query)}
            disabled={!query.trim() || status === 'connecting' || status === 'streaming'}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:from-amber-400 hover:to-amber-500 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {status === 'connecting' ? (
              <span>⏳ Đang Kết Nối Minh Sư AI...</span>
            ) : status === 'streaming' ? (
              <span>⚡ Đang Luận Giải...</span>
            ) : (
              <span>☯ Chiêm Nghiệm Quẻ Minh Kiến ({user.isMasterAdmin ? 'Sư Phụ Free' : '-10 Linh Điểm'})</span>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 font-medium space-y-1">
          <p className="font-bold">⚠️ Thông Báo Lỗi System:</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Emergency Crisis Alert Banner */}
      {status === 'crisis_alert' && responsePayload?.hotline_contacts && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-5 text-amber-200 space-y-3 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
            <span>⚠️</span>
            <span>CẢNH BÁO KHỦNG HOẢNG TÂM LÝ & ĐƯỜNG DÂY NÓNG HỖ TRỢ KHẨN CẤP</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hệ thống nhận thấy trăn trở của bạn cần sự can thiệp y tế/tâm lý chuyên nghiệp từ con người thực sự. Minh Sư AI không thay thế chuyên gia khẩn cấp.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {responsePayload.hotline_contacts.map((contact, idx) => (
              <div key={idx} className="rounded-xl border border-amber-500/20 bg-slate-950 p-3 text-xs">
                <p className="font-bold text-amber-300">{contact.name}</p>
                <p className="text-lg font-extrabold text-amber-400 font-mono my-0.5">{contact.number}</p>
                <p className="text-[11px] text-slate-400">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streaming or Completed Response Content */}
      {streamText && (
        <div className="space-y-6 animate-fadeIn">
          {/* Live streaming text view */}
          <div className="rounded-3xl border border-amber-500/30 bg-slate-900/75 p-6 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <span>☯</span>
                <span>Lời Khuyên Từ Minh Sư AI ({responsePayload?.model || 'Autonomous Client Engine'})</span>
              </h3>
              {status === 'streaming' && (
                <span className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Đang truyền thụ tri thức...</span>
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {streamText}
            </div>
          </div>

          {/* Structured 10-Point Candor Cards once completed */}
          {status === 'completed' && responsePayload?.structured_candor && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  ✦ BẢNG PHÂN TÍCH 10 ĐIỂM THẲNG THẮN CÓ LÒNG TỪ
                </span>
              </div>
              <CandorCardGrid candor={responsePayload.structured_candor} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamView;
