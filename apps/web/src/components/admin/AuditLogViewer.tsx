'use client';

import React, { useState } from 'react';
import { SystemAuditLog } from '@/types/admin';

interface AuditLogViewerProps {
  logs: SystemAuditLog[];
  isLoading: boolean;
  onFilterChange: (severity?: string, module?: string) => void;
  onAddTestLog: () => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs,
  isLoading,
  onFilterChange,
  onAddTestLog,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSeverity(val);
    onFilterChange(val, selectedModule);
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedModule(val);
    onFilterChange(selectedSeverity, val);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'safety_alert':
        return (
          <span className="px-2 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
            🚨 SAFETY ALERT
          </span>
        );
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded">
            🔥 CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
            ⚠️ WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
            ℹ️ INFO
          </span>
        );
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('vi-VN');
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <span>📜</span> Nhật Ký Kiểm Toán & An Toàn (Audit Logs)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ghi nhận mọi sự kiện hệ thống, chuyển đổi AI Router và cảnh báo từ Safety Guard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSeverity}
            onChange={handleSeverityChange}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Mức độ: Tất cả</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="safety_alert">Safety Alert</option>
          </select>

          <select
            value={selectedModule}
            onChange={handleModuleChange}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Mô-đun: Tất cả</option>
            <option value="consultation">Minh Kiến Chat</option>
            <option value="tarot">Tarot</option>
            <option value="iching">Kinh Dịch</option>
            <option value="astrology">Tử Vi / Bát Tự</option>
            <option value="duong_dao">Dưỡng Đạo</option>
            <option value="system">System Core</option>
          </select>

          <button
            onClick={onAddTestLog}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-medium text-slate-200 transition-colors"
          >
            ➕ Thêm Log Thử Nghệ
          </button>
        </div>
      </div>

      {/* Logs Table / List */}
      {isLoading && logs.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Đang tải nhật ký kiểm toán...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
          Chưa có ghi nhận nhật ký kiểm toán phù hợp.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                <th className="py-3 px-4">Mức Độ</th>
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Mô-Đun</th>
                <th className="py-3 px-4">Hành Động</th>
                <th className="py-3 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">{getSeverityBadge(log.severity)}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-300">
                      {log.module}
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          setExpandedLogId(
                            expandedLogId === log.id ? null : log.id
                          )
                        }
                        className="text-amber-400 hover:underline font-mono text-[11px]"
                      >
                        {expandedLogId === log.id ? 'Thu gọn' : 'Xem JSON'}
                      </button>
                    </td>
                  </tr>
                  {expandedLogId === log.id && (
                    <tr className="bg-slate-950/80">
                      <td colSpan={5} className="p-4 border-t border-slate-800/80">
                        <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
