"use client";

import React, { useState, useEffect } from "react";
import { Bell, BellOff, Check, Sparkles } from "lucide-react";

export const DailyWisdomPushNotifier: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setSupported(true);
      if (Notification.permission === "granted") {
        setSubscribed(true);
      }
    }
  }, []);

  const handleTogglePush = async () => {
    if (!supported) return;

    if (!subscribed) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setSubscribed(true);
        new Notification("HUYỀN TÂM MINH ĐẠO", {
          body: "Đã bật nhắc nhở quẻ ngày mới 6h00 sáng mỗi ngày. Chúc bạn luôn bình an & trí tuệ!",
          icon: "/icon-192x192.png",
        });
      }
    } else {
      setSubscribed(false);
    }
  };

  if (!supported) return null;

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/60 border border-amber-500/20 backdrop-blur-xl shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Bell className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" /> Quẻ Ngày Mới 6h00 Sáng
          </h4>
          <p className="text-[10px] text-zinc-400">Nhận lời khuyên bình an trực tiếp mỗi buổi sáng</p>
        </div>
      </div>

      <button
        onClick={handleTogglePush}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
          subscribed
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            : "bg-amber-500 hover:bg-amber-400 text-zinc-950 border-transparent shadow-md shadow-amber-500/20"
        }`}
      >
        {subscribed ? (
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> Đã Bật Nhắc
          </span>
        ) : (
          "Bật Nhắc Nhở"
        )}
      </button>
    </div>
  );
};

export default DailyWisdomPushNotifier;
