"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Eye, RefreshCw, ShieldCheck } from "lucide-react";

export interface CardItem {
  id: string;
  name: string;
  arcana: string;
  meaning: string;
  keywords: string[];
  imageUrl?: string;
}

const SAMPLE_CARDS: CardItem[] = [
  {
    id: "0",
    name: "0 - The Fool (Kẻ Khờ)",
    arcana: "Major Arcana",
    meaning: "Khởi đầu mới, tự do vô lo, dấn thân vào hành trình định mệnh với tâm hồn thuần khiết.",
    keywords: ["Khởi Đầu", "Tự Do", "Tiềm Năng"],
  },
  {
    id: "1",
    name: "I - The Magician (Nhà Phù Thủy)",
    arcana: "Major Arcana",
    meaning: "Năng lực kiến tạo, làm chủ 4 nguyên tố, biến ý tưởng thành hiện thực rực rỡ.",
    keywords: ["Kiến Tạo", "Ý Chí", "Tập Trung"],
  },
  {
    id: "2",
    name: "II - The High Priestess (Nữ Tư Tế)",
    arcana: "Major Arcana",
    meaning: "Trực giác nhạy bén, tri thức ẩn sâu, sự tĩnh lặng nhìn thấu nội tâm.",
    keywords: ["Trực Giác", "Tĩnh Lặng", "Bí Ẩn"],
  },
];

export const CyberMysticCardDeck: React.FC = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<CardItem | null>(null);
  const [tilt, setTilt] = useState<{ [key: number]: { x: number; y: number } }>({});

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / (rect.height / 2)) * -12;
    const rotateY = (x / (rect.width / 2)) * 12;
    setTilt((prev) => ({ ...prev, [idx]: { x: rotateX, y: rotateY } }));
  };

  const handleMouseLeaveCard = (idx: number) => {
    setTilt((prev) => ({ ...prev, [idx]: { x: 0, y: 0 } }));
  };

  const handleCardClick = (index: number, card: CardItem) => {
    if (flippedIndex === index) {
      setFlippedIndex(null);
      setActiveCard(null);
    } else {
      setFlippedIndex(index);
      setActiveCard(card);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-3xl bg-zinc-950/60 border border-amber-500/30 backdrop-blur-2xl shadow-2xl shadow-purple-950/40">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber-500/20">
        <div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-purple-400 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400 animate-spin-slow" />
            Bộ Bài 3D Cyber-Mystic Tarot & Kinh Dịch
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Chạm vào lá bài để mở hiệu ứng lật 3D & nghiêng bóng kính lấp lánh
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5" /> Specular Gloss 3D Tilt
        </div>
      </div>

      {/* 3D Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_CARDS.map((card, idx) => {
          const isFlipped = flippedIndex === idx;
          const cardTilt = tilt[idx] || { x: 0, y: 0 };
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx, card)}
              onMouseMove={(e) => handleMouseMoveCard(e, idx)}
              onMouseLeave={() => handleMouseLeaveCard(idx)}
              className="group relative h-80 w-full cursor-pointer perspective-1000 select-none"
            >
              <div
                className={`relative h-full w-full rounded-2xl transition-transform duration-300 ease-out transform-style-3d shadow-2xl shadow-amber-950/30 ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{
                  transform: isFlipped
                    ? "rotateY(180deg)"
                    : `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                }}
              >
                {/* Specular Glass Gloss Sweep Overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* CARD BACK (Mặt Sau 3D Glass) */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-950 p-4 border-2 border-amber-500/40 flex flex-col items-center justify-between backface-hidden overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent opacity-60" />
                  <div className="w-full flex justify-between items-center text-[10px] text-amber-400/80 font-mono">
                    <span>CYBER-MYSTIC</span>
                    <span>78 ARCANA</span>
                  </div>
                  <div className="my-auto flex flex-col items-center gap-2 text-center">
                    <div className="h-16 w-16 rounded-full border-2 border-amber-400/50 flex items-center justify-center bg-amber-500/20 shadow-lg shadow-amber-500/20 animate-pulse">
                      <Sparkles className="h-8 w-8 text-amber-300" />
                    </div>
                    <span className="text-xs font-semibold text-amber-200">Lật Bài Giải Quẻ</span>
                  </div>
                  <div className="w-full text-center text-[9px] text-zinc-400 tracking-widest uppercase font-bold">
                    HUYỀN TÂM MINH ĐẠO
                  </div>
                </div>

                {/* CARD FRONT (Mặt Trước 3D Glass) */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-purple-950 p-5 border-2 border-amber-400/60 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl shadow-amber-500/30">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-amber-300">{card.arcana}</span>
                    <Eye className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="space-y-2 my-auto">
                    <h4 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                      {card.name}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                      {card.meaning}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeCard && (
        <div className="mt-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 animate-fadeIn flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-400">Đã chọn: {activeCard.name}</span>
            <p className="text-xs text-zinc-300">{activeCard.meaning}</p>
          </div>
          <button
            onClick={() => { setFlippedIndex(null); setActiveCard(null); }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1 border border-zinc-700 active:scale-95 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Đặt lại
          </button>
        </div>
      )}
    </div>
  );
};

export default CyberMysticCardDeck;
