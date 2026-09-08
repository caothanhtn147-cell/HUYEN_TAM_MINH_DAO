'use client';

import React from 'react';
import { BaTuChartResponse, PillarDetail } from '@/types/astrology';
import { FiveElementsPentagon } from '../common/FiveElementsPentagon';

interface BaTuChartViewProps {
  chart: BaTuChartResponse;
}

const getElementColor = (element: string): { bg: string; text: string; border: string; bar: string } => {
  switch (element) {
    case 'Mộc':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', bar: 'bg-emerald-500' };
    case 'Hỏa':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', bar: 'bg-rose-500' };
    case 'Thổ':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', bar: 'bg-amber-500' };
    case 'Kim':
      return { bg: 'bg-slate-300/10', text: 'text-slate-200', border: 'border-slate-400/30', bar: 'bg-slate-300' };
    case 'Thủy':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', bar: 'bg-cyan-500' };
    default:
      return { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700', bar: 'bg-slate-500' };
  }
};

const renderPillarCard = (title: string, pillar: PillarDetail, isDayMaster: boolean = false) => {
  const stemStyle = getElementColor(pillar.stem_element);
  const branchStyle = getElementColor(pillar.branch_element);

  return (
    <div
      className={`rounded-xl border p-4 space-y-2 relative overflow-hidden transition ${
        isDayMaster
          ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/5'
          : 'border-slate-800 bg-slate-950/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {isDayMaster && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/40">
            ⭐ Nhật Chủ
          </span>
        )}
      </div>

      <div className="text-center py-2 space-y-1">
        <div className="text-2xl font-black tracking-tight text-slate-50">
          {pillar.combined_name}
        </div>
        <div className="flex justify-center gap-2 text-[11px] font-semibold">
          <span className={`px-2 py-0.5 rounded border ${stemStyle.bg} ${stemStyle.text} ${stemStyle.border}`}>
            Can: {pillar.stem} ({pillar.stem_element})
          </span>
          <span className={`px-2 py-0.5 rounded border ${branchStyle.bg} ${branchStyle.text} ${branchStyle.border}`}>
            Chi: {pillar.branch} ({pillar.branch_element})
          </span>
        </div>
      </div>
    </div>
  );
};

export const BaTuChartView: React.FC<BaTuChartViewProps> = ({ chart }) => {
  const { five_elements_balance: fe } = chart;

  const elementsList = [
    { name: 'Mộc', pct: fe.wood_percentage, color: getElementColor('Mộc') },
    { name: 'Hỏa', pct: fe.fire_percentage, color: getElementColor('Hỏa') },
    { name: 'Thổ', pct: fe.earth_percentage, color: getElementColor('Thổ') },
    { name: 'Kim', pct: fe.metal_percentage, color: getElementColor('Kim') },
    { name: 'Thủy', pct: fe.water_percentage, color: getElementColor('Thủy') },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
            🏛️ Lá Số Bát Tự (Tứ Trụ Mệnh Lý)
          </span>
          <p className="text-xs text-slate-400 mt-1">
            {chart.lunar_date_str}
          </p>
        </div>
        <div className="text-right text-xs font-semibold text-amber-300">
          Nhật Chủ Bản Thể: <strong className="text-slate-100">{chart.day_master}</strong>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {renderPillarCard('Trụ Năm', chart.year_pillar)}
        {renderPillarCard('Trụ Tháng', chart.month_pillar)}
        {renderPillarCard('Trụ Ngày (Bản Thể)', chart.day_pillar, true)}
        {renderPillarCard('Trụ Giờ', chart.hour_pillar)}
      </div>

      {/* Five Elements Pentagon Component */}
      <FiveElementsPentagon data={fe} />

      {/* Philosophical Reflections */}
      {chart.philosophical_reflections.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <span>🧠 Gợi Mở Tự Soi Chiếu (Huyền Tâm Minh Đạo)</span>
          </h4>
          <ul className="space-y-1 text-xs text-amber-100 font-medium list-disc list-inside">
            {chart.philosophical_reflections.map((ref, idx) => (
              <li key={idx} className="leading-relaxed">
                {ref}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
