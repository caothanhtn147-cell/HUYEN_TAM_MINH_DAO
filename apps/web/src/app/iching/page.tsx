import React from 'react';
import { IChingCoinTossView } from '@/components/iching/IChingCoinTossView';

export const metadata = {
  title: 'Kinh Dịch Gieo Quẻ Online | HUYỀN TÂM MINH ĐẠO',
  description:
    'Gieo quẻ 3 đồng xu Kinh Dịch online làm gương soi chuyển dịch tự nhiên và tự soi chiếu nhận thức tâm lý theo nguyên lý Huyền Tâm Minh Đạo.',
};

export default function IChingPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 py-4">
          <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/20">
            Hệ Thống Biểu Tượng & Gương Soi Tự Nhiên
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50 font-cinzel">
            GIEO QUẺ KINH DỊCH CHIÊM NGHIỆM
          </h1>
          <p className="text-xs md:text-sm text-slate-400 italic">
            &quot;Dụng Dịch soi tâm — Hiểu luật chuyển dịch — Tự tại thích ứng vạn biến&quot;
          </p>
        </div>

        {/* I Ching Coin Toss View */}
        <IChingCoinTossView />
      </div>
    </main>
  );
}
