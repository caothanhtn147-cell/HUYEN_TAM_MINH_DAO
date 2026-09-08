'use client';

import React from 'react';

interface FiveElementsData {
  wood_percentage: number;
  fire_percentage: number;
  earth_percentage: number;
  metal_percentage: number;
  water_percentage: number;
  dominant_element: string;
  lacking_element: string;
}

interface FiveElementsPentagonProps {
  data: FiveElementsData;
}

export const FiveElementsPentagon: React.FC<FiveElementsPentagonProps> = ({
  data,
}) => {
  const elements = [
    { name: 'Mộc (Wood)', value: data.wood_percentage, color: '#10b981', symbol: '🪵' },
    { name: 'Hỏa (Fire)', value: data.fire_percentage, color: '#ef4444', symbol: '🔥' },
    { name: 'Thổ (Earth)', value: data.earth_percentage, color: '#f59e0b', symbol: '⛰️' },
    { name: 'Kim (Metal)', value: data.metal_percentage, color: '#e2e8f0', symbol: '⚔️' },
    { name: 'Thủy (Water)', value: data.water_percentage, color: '#06b6d4', symbol: '🌊' },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
            ☯️ Biểu Đồ Cân Bằng Ngũ Hành (Five Elements Radar)
          </h3>
          <p className="text-xs text-slate-400">
            Tỷ lệ Năng Lượng Ngũ Hành Tứ Trụ: Kim • Mộc • Thủy • Hỏa • Thổ
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-400 border border-emerald-500/30">
            Vượng: {data.dominant_element}
          </span>
          <span className="rounded bg-amber-500/10 px-2.5 py-1 font-bold text-amber-400 border border-amber-500/30">
            Nhược/Khuyết: {data.lacking_element}
          </span>
        </div>
      </div>

      {/* Five Elements Progress Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
        {elements.map((el) => (
          <div
            key={el.name}
            className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2 text-center"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1" style={{ color: el.color }}>
                {el.symbol} {el.name.split(' ')[0]}
              </span>
              <span className="font-mono text-slate-300">{el.value}%</span>
            </div>

            {/* Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.max(5, el.value)}%`,
                  backgroundColor: el.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cycle Explanation Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <span className="font-bold text-slate-200">🌿 Vòng Tương Sinh: </span>
          <span>Mộc sinh Hỏa ➔ Hỏa sinh Thổ ➔ Thổ sinh Kim ➔ Kim sinh Thủy ➔ Thủy sinh Mộc</span>
        </div>
        <div className="text-right font-mono text-[11px] text-amber-400/90">
          Chỉ số cân bằng năng lượng thực địa
        </div>
      </div>
    </div>
  );
};
