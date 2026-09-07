import React from 'react';
import { StreamView } from '@/components/consultation/StreamView';

export const metadata = {
  title: 'Minh Kiến Consultation | HUYỀN TÂM MINH ĐẠO',
  description:
    'Phiên tư vấn chiêm nghiệm Minh Kiến bằng Trí tuệ Nhân tạo (Minh Sư AI) với cấu trúc 10 điểm Thẳng Thắn Có Lòng Từ.',
};

export default function MinhKienPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 py-4">
          <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
            Hệ Thống Chiêm Nghiệm Triết Học & Tâm Lý
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50">
            QUẺ MINH KIẾN — TƯ VẤN MINH SƯ AI
          </h1>
          <p className="text-xs md:text-sm text-slate-400 italic">
            &quot;Thấy rõ sự thật – Hiểu mình – Sống tốt hơn&quot;
          </p>
        </div>

        {/* Interactive Stream Consultation View */}
        <StreamView />
      </div>
    </main>
  );
}
