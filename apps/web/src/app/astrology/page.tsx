import React from 'react';
import { AstrologyView } from '@/components/astrology/AstrologyView';

export const metadata = {
  title: 'Lập Lá Số Bát Tự & Tử Vi Online | HUYỀN TÂM MINH ĐẠO',
  description:
    'Lập lá số Bát Tự Tứ Trụ và Tử Vi 12 Cung online làm gương soi nhận thức tâm lý, phân bổ Ngũ Hành và gợi mở tự quan sát theo nguyên lý Huyền Tâm Minh Đạo.',
};

export default function AstrologyPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 py-4">
          <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
            Hệ Thống Biểu Tượng & Cấu Trúc Bản Thể
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50 font-cinzel">
            LẬP LÁ SỐ BÁT TỰ & TỬ VI SOI CHIẾU
          </h1>
          <p className="text-xs md:text-sm text-slate-400 italic">
            &quot;Thấu hiểu Tứ Trụ Ngũ Hành — Nhận diện 12 Cung Số — Tự tại làm chủ bản thể&quot;
          </p>
        </div>

        {/* Interactive Astrology View */}
        <AstrologyView />
      </div>
    </main>
  );
}
