'use client';

import React, { useEffect } from 'react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import { SystemMetricsOverview } from './SystemMetricsOverview';
import { AuditLogViewer } from './AuditLogViewer';

export const AdminDashboardView: React.FC = () => {
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

  const handleAddTestLog = async () => {
    await addAuditLog({
      action: 'ADMIN_MANUAL_AUDIT_CHECK',
      module: 'system',
      severity: 'info',
      details: {
        operator: 'Sư Phụ JCT',
        note: 'Kiểm tra thủ công từ Admin Governance Dashboard',
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-2xl font-black text-amber-200 tracking-tight">
              Quản Trị Bảng Điều Khiển & Giám Sát Hệ Thống
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Trung tâm kiểm soát toàn diện Huyền Tâm Minh Đạo: Theo dõi Uptime, AI Router Provider status, chỉ số tư vấn và nhật ký an toàn Safety Audit Logs.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          ADMIN GOVERNANCE ACTIVE
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl p-4 flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button
            onClick={fetchMetrics}
            className="underline text-rose-300 hover:text-white font-semibold"
          >
            Thử lại
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
