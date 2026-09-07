'use client';

import React, { useState } from 'react';
import { useAstrologyChart } from '@/hooks/useAstrologyChart';
import { BirthDataForm } from './BirthDataForm';
import { BaTuChartView } from './BaTuChartView';
import { TuViPalaceView } from './TuViPalaceView';
import { BirthDataInput } from '@/types/astrology';
import { SocialShareCard } from '../common/SocialShareCard';

export const AstrologyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'batu' | 'tuvi' | 'synthesis'>(
    'batu'
  );

  const {
    isLoading,
    batuChart,
    tuviChart,
    fullAnalysis,
    errorMessage,
    generateFullAnalysis,
    resetChart,
  } = useAstrologyChart();

  const handleFormSubmit = async (data: BirthDataInput) => {
    await generateFullAnalysis(data);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Birth Data Input Form */}
      <BirthDataForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {/* Error Notification */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Results Container */}
      {fullAnalysis && batuChart && tuviChart && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur">
            <button
              type="button"
              onClick={() => setActiveTab('batu')}
              className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'batu'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏛️ Lá Số Bát Tự (Tứ Trụ & Ngũ Hành)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tuvi')}
              className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'tuvi'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌌 Lá Số Tử Vi (12 Cung Số)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('synthesis')}
              className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'synthesis'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ☯️ Phân Tích Tổng Học (Huyền Tâm)
            </button>
          </div>

          {/* Reset Action & Share */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SocialShareCard
              moduleName="LÁ SỐ BÁT TỰ & TỬ VI"
              title={batuChart.birth_data?.name || 'Lá Số Soi Chiếu'}
              subtitle={`Tứ Trụ: ${batuChart.year_pillar.combined_name} • ${batuChart.month_pillar.combined_name} • ${batuChart.day_pillar.combined_name} • ${batuChart.hour_pillar.combined_name}`}
              insights={[
                `Nhật Chủ: ${batuChart.day_master}`,
                `Ngũ Hành Vượng: ${batuChart.five_elements_balance.dominant_element} (Khuyết: ${batuChart.five_elements_balance.lacking_element})`,
                `Cung Mệnh Tử Vi tại ${tuviChart.menh_palace_branch} (${tuviChart.cuc_name})`,
                `Cung Thân tại ${tuviChart.than_palace_branch}`,
              ]}
            />

            <button
              type="button"
              onClick={resetChart}
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              🔄 Lập lá số khác
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'batu' && <BaTuChartView chart={batuChart} />}
          {activeTab === 'tuvi' && <TuViPalaceView chart={tuviChart} />}
          {activeTab === 'synthesis' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-emerald-400">
                  ☯️ Tổng Học Soi Chiếu Nhận Thức Bát Tự & Tử Vi
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Triết lý Huyền Tâm Minh Đạo: Thấy rõ cấu trúc tự nhiên để tự tại làm chủ cuộc đời
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  📜 Tổng Quan Bản Thể & Lời Khuyên Ứng Xử
                </h4>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                  {fullAnalysis.overall_synthesis_vi}
                </p>
              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    🏛️ Điểm Cốt Lõi Bát Tự
                  </h4>
                  <p className="text-xs text-slate-300">
                    • Nhật Chủ: <strong>{batuChart.day_master}</strong>
                  </p>
                  <p className="text-xs text-slate-300">
                    • Vượng: <strong>{batuChart.five_elements_balance.dominant_element}</strong> ({batuChart.five_elements_balance.wood_percentage}%)
                  </p>
                  <p className="text-xs text-slate-300">
                    • Nhược: <strong>{batuChart.five_elements_balance.lacking_element}</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    🌌 Điểm Cốt Lõi Tử Vi
                  </h4>
                  <p className="text-xs text-slate-300">
                    • Cung Mệnh: <strong>{tuviChart.menh_palace_branch}</strong>
                  </p>
                  <p className="text-xs text-slate-300">
                    • Cung Thân: <strong>{tuviChart.than_palace_branch}</strong>
                  </p>
                  <p className="text-xs text-slate-300">
                    • Cục: <strong>{tuviChart.cuc_name}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
