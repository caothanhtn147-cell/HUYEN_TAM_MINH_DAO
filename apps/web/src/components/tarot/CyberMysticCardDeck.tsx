"use client";

import React, { useState } from "react";
import { Sparkles, Eye, RefreshCw, ShieldCheck, Crown, Flame, Moon, Sun } from "lucide-react";

export interface CardItem {
  id: string;
  name: string;
  arcana: string;
  meaning: string;
  keywords: string[];
  element: string;
  artGlow: string;
  badgeColor: string;
}

const SAMPLE_CARDS: CardItem[] = [
  {
    id: "0",
    name: "0 - The Fool (Kẻ Khờ)",
    arcana: "Major Arcana",
    meaning: "Khởi đầu mới thuần khiết, tự do vô lo, dấn thân vào hành trình định mệnh với niềm tin tuyệt đối.",
    keywords: ["Khởi Đầu", "Tự Do", "Tiềm Năng"],
    element: "Khí (Air)",
    artGlow: "from-amber-400/30 via-cyan-500/20 to-purple-600/40",
    badgeColor: "text-cyan-300 border-cyan-500/30 bg-cyan-950/40",
  },
  {
    id: "1",
    name: "I - The Magician (Nhà Phù Thủy)",
    arcana: "Major Arcana",
    meaning: "Năng lực kiến tạo thượng thừa, làm chủ 4 nguyên tố, biến ý tưởng thành hiện thực rực rỡ.",
    keywords: ["Kiến Tạo", "Ý Chí", "Tập Trung"],
    element: "Hỏa (Fire)",
    artGlow: "from-amber-400/40 via-red-500/30 to-purple-900/50",
    badgeColor: "text-amber-300 border-amber-500/40 bg-amber-950/40",
  },
  {
    id: "2",
    name: "II - The High Priestess (Nữ Tư Tế)",
    arcana: "Major Arcana",
    meaning: "Trực giác nhạy bén nhìn thấu vũ trụ, tri thức ẩn sâu, sự tĩnh lặng nhìn thấu nội tâm.",
    keywords: ["Trực Giác", "Tĩnh Lặng", "Bí Ẩn"],
    element: "Thủy (Water)",
    artGlow: "from-indigo-400/30 via-purple-600/30 to-zinc-950",
    badgeColor: "text-purple-300 border-purple-500/30 bg-purple-950/40",
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
    const rotateX = (y / (rect.height / 2)) * -14;
    const rotateY = (x / (rect.width / 2)) * 14;
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
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-950/70 border border-amber-500/30 backdrop-blur-2xl shadow-2xl shadow-purple-950/40 space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" /> 8K Cyber-Mystic Art Deck
          </div>
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-purple-400">
            Thánh Trận Bài 3D Cyber-Mystic & Kinh Dịch 8K
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Mặt bài render 8K ma mị • Ánh sáng Specular Sweep 3D Tilt nghiêng theo tay rê
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 px-3.5 py-2 rounded-full border border-amber-500/30 shadow-lg">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span className="font-bold">8K Specular Gold Engine Active</span>
        </div>
      </div>

      {/* 3D Interactive Card Grid */}
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
              className="group relative h-96 w-full cursor-pointer perspective-1000 select-none"
            >
              <div
                className={`relative h-full w-full rounded-2xl transition-transform duration-300 ease-out transform-style-3d shadow-2xl shadow-amber-950/40 ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{
                  transform: isFlipped
                    ? "rotateY(180deg)"
                    : `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                }}
              >
                {/* Specular Glass Gloss Sweep Overlay (Layer 1) */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-amber-300/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                {/* CARD BACK (Mặt Sau 8K Cyber-Mystic) */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-zinc-950 via-purple-950 to-black p-5 border-2 border-amber-400/40 flex flex-col items-center justify-between backface-hidden overflow-hidden shadow-inner">
                  {/* Background Aura Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-purple-600/10 to-transparent opacity-80" />

                  <div className="w-full flex justify-between items-center text-[10px] text-amber-400/80 font-mono relative z-10">
                    <span className="flex items-center gap-1 font-bold"><Crown className="h-3 w-3" /> 8K CYBER-MYSTIC</span>
                    <span>78 ARCANA</span>
                  </div>

                  {/* Sacred Geometry 3D Mandala Core */}
                  <div className="relative z-10 my-auto flex flex-col items-center gap-3 text-center">
                    <div className="relative h-20 w-20 rounded-full border-2 border-amber-400/60 flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-purple-900/40 shadow-2xl shadow-amber-500/30">
                      <div className="absolute inset-0 rounded-full border border-amber-300/40 animate-spin-slow" />
                      <Sparkles className="h-10 w-10 text-amber-300 animate-pulse" />
                    </div>
                    <span className="text-xs font-extrabold tracking-wider text-amber-200 uppercase bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                      Lật Bài Khai Sáng
                    </span>
                  </div>

                  <div className="w-full text-center text-[10px] text-amber-400/70 tracking-widest uppercase font-bold relative z-10">
                    HUYỀN TÂM MINH ĐẠO • 8K ART
                  </div>
                </div>

                {/* CARD FRONT (Mặt Trước 8K Cyber-Mystic Art) */}
                <div className={`absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br ${card.artGlow} p-6 border-2 border-amber-400/70 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl shadow-amber-500/40 overflow-hidden`}>
                  {/* Dual-Layer Cinema Glow Light Background */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/20 blur-2xl rounded-full pointer-events-none" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                      {card.arcana}
                    </span>
                    <span className="text-xs font-mono text-amber-300 flex items-center gap-1 font-bold">
                      <Flame className="h-3.5 w-3.5 text-amber-400" /> {card.element}
                    </span>
                  </div>

                  {/* Art Core Title & Meaning */}
                  <div className="space-y-3 my-auto relative z-10">
                    <h4 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-400">
                      {card.name}
                    </h4>
                    <p className="text-xs text-zinc-200 leading-relaxed line-clamp-4 font-serif italic">
                      "{card.meaning}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 relative z-10">
                    {card.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="text-[10px] bg-amber-500/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold"
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
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-zinc-950 to-amber-950/40 border border-amber-500/40 animate-fadeIn flex items-center justify-between shadow-2xl">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-400" /> Đã Khai Mở: {activeCard.name} ({activeCard.element})
            </span>
            <p className="text-xs text-zinc-300">{activeCard.meaning}</p>
          </div>
          <button
            onClick={() => { setFlippedIndex(null); setActiveCard(null); }}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-amber-300 font-bold flex items-center gap-1.5 border border-amber-500/30 active:scale-95 transition shadow-lg"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Đặt Lại Trận
          </button>
        </div>
      )}
    </div>
  );
};

export default CyberMysticCardDeck;
