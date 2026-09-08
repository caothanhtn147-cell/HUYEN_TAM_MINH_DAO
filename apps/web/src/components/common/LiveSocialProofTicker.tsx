"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LiveToast {
  id: number;
  messageVn: string;
  messageEn: string;
  location: string;
  timeAgoVn: string;
  timeAgoEn: string;
}

const NOTIFICATIONS: Omit<LiveToast, "id">[] = [
  { messageVn: "vừa gieo quẻ Kinh Dịch 'Thuần Càn'", messageEn: "just cast I Ching hexagram 'Pure Qian'", location: "Hà Nội 🇻🇳", timeAgoVn: "12 giây trước", timeAgoEn: "12s ago" },
  { messageVn: "vừa nạp Gói VIP Cốc Cà Phê 29K", messageEn: "just unlocked VIP Coffee Tier ($2.99)", location: "TP. Hồ Chí Minh 🇻🇳", timeAgoVn: "25 giây trước", timeAgoEn: "25s ago" },
  { messageVn: "vừa rút quẻ Tarot 'The Star'", messageEn: "just drew Tarot card 'The Star'", location: "California 🇺🇸", timeAgoVn: "40 giây trước", timeAgoEn: "40s ago" },
  { messageVn: "vừa kích hoạt 20 Hạt Minh Triết", messageEn: "just activated 20 Wisdom Credits", location: "Đà Nẵng 🇻🇳", timeAgoVn: "1 phút trước", timeAgoEn: "1m ago" },
  { messageVn: "vừa mở khóa Lá Số Tử Vi 12 Cung", messageEn: "just unlocked 12-Palace Tu Vi Chart", location: "Tokyo 🇯🇵", timeAgoVn: "2 phút trước", timeAgoEn: "2m ago" },
];

export const LiveSocialProofTicker: React.FC = () => {
  const { language } = useLanguage();
  const isVn = language !== "en";
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
        <span className="font-bold text-amber-300">{onlineCount.toLocaleString(isVn ? "vi-VN" : "en-US")}</span>
        <span className="text-zinc-400 text-[10px]">{isVn ? "Đang Trực Tuyến" : "Online Users"}</span>
      </div>

      {/* Floating Live Social Toast Notification */}
      {currentToast && (
        <div className="fixed bottom-6 left-6 z-40 max-w-xs p-3 rounded-2xl bg-zinc-950/85 border border-amber-500/30 backdrop-blur-xl shadow-2xl animate-fadeIn space-y-1">
          <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono">
            <span className="flex items-center gap-1 font-bold">
              <Sparkles className="h-3 w-3 text-amber-300" /> LIVE ACTIVITY
            </span>
            <span className="text-zinc-400">{isVn ? currentToast.timeAgoVn : currentToast.timeAgoEn}</span>
          </div>
          <p className="text-xs text-zinc-200 line-clamp-2">
            {isVn ? (
              <>Một công dân tại <span className="font-bold text-amber-300">{currentToast.location}</span> {currentToast.messageVn}</>
            ) : (
              <>A user in <span className="font-bold text-amber-300">{currentToast.location}</span> {currentToast.messageEn}</>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default LiveSocialProofTicker;
