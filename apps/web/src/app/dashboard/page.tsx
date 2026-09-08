import React from 'react';
import { DashboardView } from '@/components/journal/DashboardView';

export const metadata = {
  title: 'Dashboard Nhật Ký Tự Soi Chiếu | HUYỀN TÂM MINH ĐẠO',
  description:
    'Bảng điều khiển cá nhân lưu giữ lịch sử chiêm nghiệm Tarot, Kinh Dịch, Bát Tự, Tử Vi và Nhật ký tự soi chiếu theo nguyên lý Huyền Tâm Minh Đạo.',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 py-4">
          <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
            Bảng Điều Khiển Cá Nhân & Nhật Ký
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50 font-cinzel">
            NHẬT KÝ TỰ SOI CHIẾU & LỊCH SỬ CHIÊM NGHIỆM
          </h1>
          <p className="text-xs md:text-sm text-slate-400 italic">
            &quot;Quan sát tâm trí — Ghi chép bài học — Tự chuyển hóa bản thân mỗi ngày&quot;
          </p>
        </div>

        {/* Dashboard View Component */}
        <DashboardView />
      </div>
    </main>
  );
}
