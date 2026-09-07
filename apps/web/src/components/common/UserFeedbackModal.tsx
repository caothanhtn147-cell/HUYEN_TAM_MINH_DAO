'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface UserFeedbackModalProps {
  moduleName: string;
}

export const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({ moduleName }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [rating, setRating] = useState<'useful' | 'suggestion' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating && !feedbackText) return;

    try {
      // Send feedback to Admin Audit Log API
      await fetch('http://127.0.0.1:8000/api/v1/admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'USER_FEEDBACK_SUBMITTED',
          module: moduleName.toLowerCase(),
          severity: 'info',
          details: {
            rating,
            feedback_text: feedbackText,
            submitted_at: new Date().toISOString(),
            language,
          },
        }),
      }).catch(() => {});
    } catch {
      // Ignore background errors
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setFeedbackText('');
      setRating(null);
    }, 2000);
  };

  return (
    <>
      {/* Trigger Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setRating('useful');
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 font-medium transition cursor-pointer"
        >
          <span>👍</span>
          <span>{language === 'en' ? 'Insightful' : 'Thấu Cảm & Hữu Ích'}</span>
        </button>

        <button
          onClick={() => {
            setRating('suggestion');
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 font-medium transition cursor-pointer"
        >
          <span>💡</span>
          <span>{language === 'en' ? 'Suggest Feature' : 'Góp Ý & Đề Xuất'}</span>
        </button>
      </div>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-sm font-bold"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <span>💬</span>
              <span>
                {language === 'en' ? 'User Feedback' : 'Góp Ý & Soi Chiếu Ý Kiến'}
              </span>
            </h3>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <span className="text-3xl">🎉</span>
                <p className="text-sm font-bold text-emerald-400">
                  {language === 'en'
                    ? 'Thank you for your feedback!'
                    : 'Cảm ơn Sư Phụ / Bạn đã đóng góp ý kiến!'}
                </p>
                <p className="text-xs text-slate-400">
                  {language === 'en'
                    ? 'Your suggestion has been sent to our Admin team.'
                    : 'Ý kiến của bạn đã được chuyển tới Admin Governance.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    {language === 'en'
                      ? 'What feature would you like us to add or improve?'
                      : 'Bạn muốn chúng tôi thêm tính năng hay cải tiến điều gì?'}
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'e.g. Dream interpretation, Work Fengshui, Daily notification...'
                        : 'Ví dụ: Thêm giải mã giấc mơ, Phong thủy bàn làm việc, Nhắc nhở hàng ngày...'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
                  >
                    {language === 'en' ? 'Cancel' : 'Hủy'}
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-amber-500/20"
                  >
                    {language === 'en' ? 'Submit Feedback' : 'Gửi Góp Ý'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
