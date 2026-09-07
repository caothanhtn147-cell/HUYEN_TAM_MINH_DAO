'use client';

import { useState, useCallback } from 'react';
import {
  JournalEntry,
  JournalEntryCreate,
  ConsultationHistoryItem,
} from '@/types/journal';

interface UseJournalReturn {
  isLoading: boolean;
  journalEntries: JournalEntry[];
  historyTimeline: ConsultationHistoryItem[];
  errorMessage: string | null;
  fetchEntries: (sourceModule?: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
  createEntry: (data: JournalEntryCreate) => Promise<JournalEntry | null>;
  deleteEntry: (id: string) => Promise<boolean>;
}

export function useJournal(
  apiBaseUrl: string = 'http://127.0.0.1:8000/api/v1'
): UseJournalReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [historyTimeline, setHistoryTimeline] = useState<
    ConsultationHistoryItem[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  const fetchEntries = useCallback(
    async (sourceModule?: string) => {
      setIsLoading(true);
      setErrorMessage(null);

      const token = getAuthToken();
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      try {
        const url = sourceModule
          ? `${apiBaseUrl}/journal/entries?source_module=${sourceModule}`
          : `${apiBaseUrl}/journal/entries`;

        const res = await fetch(url, { headers });
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.detail || 'Không thể tải danh sách nhật ký.');
        }

        const data: JournalEntry[] = await res.json();
        setJournalEntries(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const token = getAuthToken();
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    try {
      const res = await fetch(`${apiBaseUrl}/journal/consultation-history`, {
        headers,
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Không thể tải lịch sử chiêm nghiệm.');
      }

      const data: ConsultationHistoryItem[] = await res.json();
      setHistoryTimeline(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  const createEntry = useCallback(
    async (data: JournalEntryCreate): Promise<JournalEntry | null> => {
      setIsLoading(true);
      setErrorMessage(null);

      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(`${apiBaseUrl}/journal/entries`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.detail || 'Không thể lưu nhật ký.');
        }

        const newEntry: JournalEntry = await res.json();
        setJournalEntries((prev) => [newEntry, ...prev]);
        return newEntry;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu nhật ký.';
        setErrorMessage(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  const deleteEntry = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setErrorMessage(null);

      const token = getAuthToken();
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      try {
        const res = await fetch(`${apiBaseUrl}/journal/entries/${id}`, {
          method: 'DELETE',
          headers,
        });

        if (!res.ok) {
          throw new Error('Không thể xóa nhật ký.');
        }

        setJournalEntries((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa nhật ký.';
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
    journalEntries,
    historyTimeline,
    errorMessage,
    fetchEntries,
    fetchHistory,
    createEntry,
    deleteEntry,
  };
}
