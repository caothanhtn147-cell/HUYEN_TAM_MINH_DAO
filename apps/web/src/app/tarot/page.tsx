import React from 'react';
import { TarotSpreadView } from '@/components/tarot/TarotSpreadView';

export const metadata = {
  title: 'Tarot Card Draw | HUYỀN TÂM MINH ĐẠO',
  description:
    'Rút bài Tarot online làm gương soi tâm lý và gợi mở góc nhìn triết học tự quan sát theo nguyên lý Huyền Tâm Minh Đạo.',
};

export default function TarotPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 py-4">
          <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
            Hệ Thống Biểu Tượng & Gương Soi Tâm Lý
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50">
            RÚT BÀI TAROT CHIÊM NGHIỆM
          </h1>
          <p className="text-xs md:text-sm text-slate-400 italic">
            &quot;Dùng biểu tượng soi tâm trí – Hiểu nguyên lý – Tự làm chủ đời mình&quot;
          </p>
        </div>

        {/* Tarot Spread View */}
        <TarotSpreadView />
      </div>
    </main>
  );
}
