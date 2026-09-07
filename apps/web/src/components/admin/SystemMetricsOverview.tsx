'use client';

import React from 'react';
import { SystemHealthMetrics } from '@/types/admin';

interface SystemMetricsOverviewProps {
  metrics: SystemHealthMetrics | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const SystemMetricsOverview: React.FC<SystemMetricsOverviewProps> = ({
  metrics,
  isLoading,
  onRefresh,
}) => {
  if (!metrics) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        {isLoading ? 'Đang tải thông số kỹ thuật...' : 'Chưa có thông số giám sát.'}
      </div>
    );
  }

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🟢 {status.toUpperCase()}
          </span>
        );
      case 'degraded':
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
            🟡 {status.toUpperCase()}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
            🔴 {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Status & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-amber-500/20 rounded-xl p-5 shadow-lg shadow-amber-950/20">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <span className="text-2xl">🛡️</span>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-amber-200">
                Hệ Thống Giám Sát Admin & Safety Audit
              </h2>
              {getStatusBadge(metrics.api_status)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Thời gian Uptime: <span className="font-mono text-amber-400">{formatUptime(metrics.uptime_seconds)}</span> | PostgreSQL:{' '}
              {metrics.database_connected ? '🟢 Kết nối' : '🔴 Mất kết nối'} | Redis:{' '}
              {metrics.redis_connected ? '🟢 Kết nối' : '🔴 Mất kết nối'}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 text-xs font-semibold bg-amber-600/80 hover:bg-amber-500 text-slate-950 rounded-lg transition-all duration-200 shadow-md shadow-amber-900/30 disabled:opacity-50"
        >
          {isLoading ? 'Đang cập nhật...' : '🔄 Tải lại chỉ số'}
        </button>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Active Users</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
            {metrics.active_users_count}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Minh Kiến Chats</p>
          <p className="text-2xl font-bold text-amber-300 mt-1 font-mono">
            {metrics.total_consultations_count}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Tarot Draws</p>
          <p className="text-2xl font-bold text-purple-400 mt-1 font-mono">
            {metrics.total_tarot_draws_count}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">I Ching Tosses</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1 font-mono">
            {metrics.total_iching_tosses_count}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400">Astrology Charts</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1 font-mono">
            {metrics.total_astrology_charts_count}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-rose-900/40 rounded-xl p-4 text-center">
          <p className="text-xs text-rose-400">Safety Alerts</p>
          <p className="text-2xl font-bold text-rose-400 mt-1 font-mono">
            {metrics.safety_alerts_count}
          </p>
        </div>
      </div>

      {/* AI Router Provider Health Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <span>⚡</span> Trạng Thái AI Providers & Multi-LLM Router
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(metrics.ai_providers_status).map(([provider, status]) => (
            <div
              key={provider}
              className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg"
            >
              <span className="text-xs font-semibold capitalize text-slate-300">
                {provider}
              </span>
              {getStatusBadge(status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
