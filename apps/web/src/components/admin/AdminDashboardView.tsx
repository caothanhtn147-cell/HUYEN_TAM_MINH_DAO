'use client';

import React, { useEffect, useState } from 'react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SystemMetricsOverview } from './SystemMetricsOverview';
import { AuditLogViewer } from './AuditLogViewer';
import { Crown, DollarSign, Wallet, ShieldCheck, Check, Sparkles, RefreshCw, Layers } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [revenueVn] = useState(18550000);
  const [revenueUsd] = useState(420.0);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const {
    isLoading,
    healthMetrics,
    auditLogs,
    errorMessage,
    fetchMetrics,
    fetchAuditLogs,
    addAuditLog,
  } = useAdminMetrics();

  useEffect(() => {
    fetchMetrics();
    fetchAuditLogs();
  }, [fetchMetrics, fetchAuditLogs]);

  const handleWithdraw = () => {
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 4000);
  };

  const handleAddTestLog = async () => {
    await addAuditLog({
      action: 'ADMIN_MANUAL_AUDIT_CHECK',
      module: 'system',
      severity: 'info',
      details: {
        operator: user.name,
        note: 'Kiểm tra thủ công từ Sovereign Admin Governance Vault',
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Sovereign Master Admin Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-zinc-950 to-purple-950/80 p-6 border-2 border-amber-400/50 shadow-2xl shadow-amber-500/20">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-black text-2xl shadow-xl shadow-amber-500/30 border-2 border-amber-300">
              👑
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Crown className="h-3.5 w-3.5" /> Sovereign Admin Master Key Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-400">
                KÍCH CHÀO SƯ PHỤ JCT — TỔNG TƯ LỆNH VIBE CODING
              </h1>
              <p className="text-xs text-zinc-300 mt-1">
                Hệ thống Quản trị Doanh thu P2P • Kiểm soát Chỉ số Vận hành Edge CDN 0đ Server • Két sắt Audit Log
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-4 py-2 rounded-xl shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold">POWERED BY JCT VIBE-ENGINEERING</span>
          </div>
        </div>
      </div>

      {/* Sovereign Revenue Vault Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-zinc-900/80 p-5 border border-amber-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              <Wallet className="h-4 w-4" /> Ngân Khố Doanh Thu VNĐ
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Napas247 P2P</span>
          </div>
          <div className="text-3xl font-black text-amber-300 tracking-tight">
            {revenueVn.toLocaleString('vi-VN')} VNĐ
          </div>
          <p className="text-[11px] text-zinc-400">Tiền nạp Hạt Minh Triết & VIP Cốc Cà Phê cá nhân</p>
        </div>

        <div className="rounded-2xl bg-zinc-900/80 p-5 border border-purple-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 font-semibold text-purple-400">
              <DollarSign className="h-4 w-4" /> Ngân Khố Quốc Tế (USD)
            </span>
            <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Crypto & Stripe</span>
          </div>
          <div className="text-3xl font-black text-purple-300 tracking-tight">
            ${revenueUsd.toFixed(2)} USD
          </div>
          <p className="text-[11px] text-zinc-400">Khách quốc tế thanh toán gói $2.99 / $14.99</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-purple-950/40 p-5 border border-amber-400/40 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Rút Tiền Về Ví Cá Nhân
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Lệnh chuyển dòng tiền tích lũy về ví Sư Phụ 1-Click</p>
          </div>

          <button
            onClick={handleWithdraw}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {withdrawSuccess ? (
              <>
                <Check className="h-4 w-4 text-zinc-950" /> Đã Phát Lệnh Chuyển Về Ví Sư Phụ!
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" /> 💸 RÚT TIỀN VỀ VÍ SƯ PHỤ JCT
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert (Only if explicit error) */}
      {errorMessage && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl p-4 flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button
            onClick={fetchMetrics}
            className="underline text-rose-300 hover:text-white font-semibold"
          >
            {t('btnReset')}
          </button>
        </div>
      )}

      {/* Overview Metrics */}
      <SystemMetricsOverview
        metrics={healthMetrics}
        isLoading={isLoading}
        onRefresh={() => {
          fetchMetrics();
          fetchAuditLogs();
        }}
      />

      {/* Audit Log Viewer */}
      <AuditLogViewer
        logs={auditLogs}
        isLoading={isLoading}
        onFilterChange={(sev, mod) => fetchAuditLogs(sev, mod)}
        onAddTestLog={handleAddTestLog}
      />
    </div>
  );
};

export default AdminDashboardView;
