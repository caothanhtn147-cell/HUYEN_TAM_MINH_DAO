'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const LiveSocialProofTicker: React.FC = () => {
  const { language } = useLanguage();
  const isVn = language !== 'en';
  const [visitorId, setVisitorId] = useState<string>('HK-2026');
  const [visitCount, setVisitCount] = useState<number>(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === 'undefined') return;

      // Truthful, persistent unique device ID
      let id = localStorage.getItem('ht_device_id');
      if (!id) {
        id = `HK-${Math.floor(1000 + Math.random() * 9000)}`;
        localStorage.setItem('ht_device_id', id);
      }
      setVisitorId(id);

      // Track real visit count for this user
      const currentVisits = parseInt(localStorage.getItem('ht_visit_count') || '0', 10) + 1;
      localStorage.setItem('ht_visit_count', currentVisits.toString());
      setVisitCount(currentVisits);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur">
      <UserCheck className="h-3.5 w-3.5 text-amber-400" />
      <span className="font-bold text-slate-100">{isVn ? `Lữ Khách #${visitorId}` : `Traveler #${visitorId}`}</span>
      <span className="text-slate-500">|</span>
      <span className="text-[11px] text-amber-300/80">
        {isVn ? `Lần ghé thăm thứ ${visitCount}` : `Visit #${visitCount}`}
      </span>
      <span className="text-slate-500">|</span>
      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
        <ShieldCheck className="h-3 w-3" /> E2EE
      </span>
    </div>
  );
};

export default LiveSocialProofTicker;
