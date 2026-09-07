import React from 'react';
import { DuongDaoView } from '@/components/duong-dao/DuongDaoView';

export const metadata = {
  title: 'Dưỡng Đạo — Vệ Sinh Giấc Ngủ & Nhịp Sinh Học | HUYỀN TÂM MINH ĐẠO',
  description:
    'Mô-đun giáo dục Dưỡng Đạo về vệ sinh giấc ngủ, nhịp sinh học tự nhiên, 24 tiết khí và di sản y học cổ truyền Nam Y theo nguyên lý Huyền Tâm Minh Đạo.',
};

export default function DuongDaoPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 py-4">
          <span className="inline-block rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
            Mô-đun Giáo Dục Sức Khỏe & Nhịp Sinh Học
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50">
            DƯỠNG ĐẠO — NGHỆ THUẬT SỐNG THUẬN TỰ NHIÊN
          </h1>
          <p className="text-xs md:text-sm text-slate-400 italic">
            &quot;Dưỡng thân bằng nếp sống — Dưỡng tâm bằng sự tỉnh giác — Tự tại thích ứng tự nhiên&quot;
          </p>
        </div>

        {/* Duong Dao Interactive View */}
        <DuongDaoView />
      </div>
    </main>
  );
}
