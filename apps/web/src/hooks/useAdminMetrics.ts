'use client';

import { useState, useCallback } from 'react';
import { SystemHealthMetrics, SystemAuditLog } from '@/types/admin';

interface UseAdminMetricsReturn {
  isLoading: boolean;
  healthMetrics: SystemHealthMetrics | null;
  auditLogs: SystemAuditLog[];
  errorMessage: string | null;
  fetchMetrics: () => Promise<void>;
  fetchAuditLogs: (severity?: string, module?: string) => Promise<void>;
  addAuditLog: (logData: {
    action: string;
    module: string;
    severity: string;
    details?: Record<string, unknown>;
  }) => Promise<boolean>;
}

export function useAdminMetrics(
  apiBaseUrl: string = 'http://127.0.0.1:8000/api/v1'
): UseAdminMetricsReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [healthMetrics, setHealthMetrics] = useState<SystemHealthMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const token = getAuthToken();
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    try {
      const res = await fetch(`${apiBaseUrl}/admin/health-metrics`, { headers });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Không thể tải chỉ số giám sát hệ thống.');
      }
      const data: SystemHealthMetrics = await res.json();
      setHealthMetrics(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  const fetchAuditLogs = useCallback(
    async (severity?: string, module?: string) => {
      setIsLoading(true);
      setErrorMessage(null);

      const token = getAuthToken();
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      try {
        const params = new URLSearchParams();
        if (severity && severity !== 'all') params.append('severity', severity);
        if (module && module !== 'all') params.append('module', module);

        const url = `${apiBaseUrl}/admin/audit-logs?${params.toString()}`;
        const res = await fetch(url, { headers });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.detail || 'Không thể tải nhật ký kiểm toán hệ thống.');
        }

        const data: SystemAuditLog[] = await res.json();
        setAuditLogs(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  const addAuditLog = useCallback(
    async (logData: {
      action: string;
      module: string;
      severity: string;
      details?: Record<string, unknown>;
    }): Promise<boolean> => {
      setIsLoading(true);
      setErrorMessage(null);

      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(`${apiBaseUrl}/admin/audit-logs`, {
          method: 'POST',
          headers,
          body: JSON.stringify(logData),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.detail || 'Không thể tạo nhật ký kiểm toán.');
        }

        const newLog: SystemAuditLog = await res.json();
        setAuditLogs((prev) => [newLog, ...prev]);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi khi lưu audit log.';
        setErrorMessage(msg);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  return {
    isLoading,
    healthMetrics,
    auditLogs,
    errorMessage,
    fetchMetrics,
    fetchAuditLogs,
    addAuditLog,
  };
}
