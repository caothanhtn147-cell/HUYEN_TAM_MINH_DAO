'use client';

import React, { useState } from 'react';
import { BirthDataInput } from '@/types/astrology';

interface BirthDataFormProps {
  onSubmit: (data: BirthDataInput) => void;
  isLoading: boolean;
}

export const BirthDataForm: React.FC<BirthDataFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState<string>('Nguyễn Văn Minh');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthYear, setBirthYear] = useState<number>(1995);
  const [birthMonth, setBirthMonth] = useState<number>(5);
  const [birthDay, setBirthDay] = useState<number>(15);
  const [birthHour, setBirthHour] = useState<number>(8);
  const [birthMinute, setBirthMinute] = useState<number>(30);
  const [isLunar, setIsLunar] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim() || undefined,
      gender,
      birth_year: Number(birthYear),
      birth_month: Number(birthMonth),
      birth_day: Number(birthDay),
      birth_hour: Number(birthHour),
      birth_minute: Number(birthMinute),
      time_zone: 7.0,
      is_lunar: isLunar,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur space-y-5"
    >
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-amber-400">
          📜 Khởi Tạo Thông Tin Ngày Giờ Sinh
        </h2>
        <span className="text-xs text-slate-400 font-mono">Múi giờ UTC+7</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            👤 Họ Và Tên (Không bắt buộc)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên..."
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Gender Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            ☯️ Giới Tính (Xác định Cục & Chiều Thuận/Nghịch)
          </label>
          <div className="flex gap-2">
            {[
              { id: 'male', label: '👨 Nam' },
              { id: 'female', label: '👩 Nữ' },
              { id: 'other', label: '✨ Khác' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGender(item.id as 'male' | 'female' | 'other')}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer border ${
                  gender === item.id
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Inputs */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            📅 Ngày / Tháng / Năm Sinh
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min={1}
              max={31}
              value={birthDay}
              onChange={(e) => setBirthDay(Number(e.target.value))}
              placeholder="Ngày"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-center text-slate-100 focus:border-amber-500 focus:outline-none"
            />
            <input
              type="number"
              min={1}
              max={12}
              value={birthMonth}
              onChange={(e) => setBirthMonth(Number(e.target.value))}
              placeholder="Tháng"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-center text-slate-100 focus:border-amber-500 focus:outline-none"
            />
            <input
              type="number"
              min={1900}
              max={2100}
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              placeholder="Năm"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-center text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Hour & Minute Inputs */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            ⏰ Giờ & Phút Sinh (Xác định Trụ Giờ & Cung Thân)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              max={23}
              value={birthHour}
              onChange={(e) => setBirthHour(Number(e.target.value))}
              placeholder="Giờ (0-23)"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-center text-slate-100 focus:border-amber-500 focus:outline-none"
            />
            <input
              type="number"
              min={0}
              max={59}
              value={birthMinute}
              onChange={(e) => setBirthMinute(Number(e.target.value))}
              placeholder="Phút (0-59)"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-center text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Calendar System Toggle & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLunar(!isLunar)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
              isLunar
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isLunar ? '🌙 Lịch Âm' : '☀️ Lịch Dương (Dương Lịch Standard)'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-400 active:scale-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-amber-500/10"
        >
          {isLoading ? (
            <span>⏳ Đang Lập Lá Số & Phân Tích...</span>
          ) : (
            <span>🔮 Lập Lá Số Bát Tự & Tử Vi</span>
          )}
        </button>
      </div>
    </form>
  );
};
