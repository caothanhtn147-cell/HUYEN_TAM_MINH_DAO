"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, Users, ShieldCheck } from "lucide-react";

interface LiveToast {
  id: number;
  message: string;
  location: string;
  timeAgo: string;
}

const NOTIFICATIONS: Omit<LiveToast, "id">[] = [
  { message: "vừa gieo quẻ Kinh Dịch 'Thuần Càn'", location: "Hà Nội 🇻🇳", timeAgo: "12 giây trước" },
  { message: "vừa nạp Gói VIP Cốc Cà Phê 29K", location: "TP. Hồ Chí Minh 🇻🇳", timeAgo: "25 giây trước" },
  { message: "vừa rút quẻ Tarot 'The Star'", location: "California 🇺🇸", timeAgo: "40 giây trước" },
  { message: "vừa kích hoạt 20 Hạt Minh Triết", location: "Đà Nẵng 🇻🇳", timeAgo: "1 phút trước" },
  { message: "vừa mở khóa Lá Số Tử Vi 12 Cung", location: "Tokyo 🇯🇵", timeAgo: "2 phút trước" },
];

export const LiveSocialProofTicker: React.FC = () => {
  const [currentToast, setCurrentToast] = useState<LiveToast | null>(null);
  const [onlineCount, setOnlineCount] = useState(4892);

  useEffect(() => {
    // Random fluctuation in online user count
    const countInterval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 5 - 2));
    }, 4000);

    // Dynamic toast notification rotator
    let idx = 0;
    const toastInterval = setInterval(() => {
      const notif = NOTIFICATIONS[idx % NOTIFICATIONS.length];
      setCurrentToast({ ...notif, id: Date.now() });
      idx++;
    }, 7000);

    return () => {
      clearInterval(countInterval);
      clearInterval(toastInterval);
    };
  }, []);

  return (
    <>
      {/* Live Active Online Counter Bar */}
      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-amber-300">{onlineCount.toLocaleString("vi-VN")}</span>
        <span className="text-zinc-400 text-[10px]">Đang Trực Tuyến</span>
      </div>

      {/* Floating Live Social Toast Notification */}
      {currentToast && (
        <div className="fixed bottom-6 left-6 z-40 max-w-xs p-3 rounded-2xl bg-zinc-950/85 border border-amber-500/30 backdrop-blur-xl shadow-2xl animate-fadeIn space-y-1">
          <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono">
            <span className="flex items-center gap-1 font-bold">
              <Sparkles className="h-3 w-3 text-amber-300" /> LIVE ACTIVITY
            </span>
            <span className="text-zinc-400">{currentToast.timeAgo}</span>
          </div>
          <p className="text-xs text-zinc-200 line-clamp-2">
            Một công dân tại <span className="font-bold text-amber-300">{currentToast.location}</span> {currentToast.message}
          </p>
        </div>
      )}
    </>
  );
};

export default LiveSocialProofTicker;
