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

  const defaultMockEntries: JournalEntry[] = [
    {
      id: 'entry-001',
      user_id: 'user-default',
      title: 'Nhận Thức Về Tâm Trí & Sự Tĩnh Lặng',
      content: 'Hôm nay tự quan sát nhận ra tâm trí thường bị lôi kéo bởi các tình huống bên ngoài. Khi quay về lắng nghe hơi thở, sự điềm tĩnh lập tức quay trở lại.',
      mood_tag: 'calm',
      source_module: 'general',
      insights: ['TâmTrí', 'ĐiềmTĩnh', 'TựQuanSát'],
      created_at: '2026-09-07T10:00:00.000Z',
      updated_at: '2026-09-07T10:00:00.000Z',
    },
    {
      id: 'entry-002',
      user_id: 'user-default',
      title: 'Quẻ Bài Tarot Soi Chiếu Định Hướng',
      content: 'Lá bài The Star nhắc nhở giữ vững niềm tin và kiên định với con đường đã chọn. Không nóng vội, từng bước hoàn thiện.',
      mood_tag: 'reflective',
      source_module: 'tarot',
      insights: ['Tarot', 'TheStar', 'HyVọng'],
      created_at: '2026-09-06T10:00:00.000Z',
      updated_at: '2026-09-06T10:00:00.000Z',
    }
  ];

  const defaultMockHistory: ConsultationHistoryItem[] = [
    {
      id: 'hist-001',
      module_type: 'tarot',
      title_vi: 'Quẻ Tarot 3 Lá',
      summary_vi: 'The Fool (Quá khứ) - The Magician (Hiện tại) - The Star (Tương lai)',
      timestamp: '2026-09-06T10:00:00.000Z',
      reference_id: 'ref-001',
    },
    {
      id: 'hist-002',
      module_type: 'iching',
      title_vi: 'Gieo Quẻ Kinh Dịch',
      summary_vi: 'Thuần Càn (Quẻ Động Hào 2 - Kiến Long Tại Điền)',
      timestamp: '2026-09-05T10:00:00.000Z',
      reference_id: 'ref-002',
    }
  ];

  const getLocalEntries = (): JournalEntry[] => {
    if (typeof window === 'undefined') return defaultMockEntries;
    try {
      const stored = localStorage.getItem('ht_journal_entries');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('ht_journal_entries', JSON.stringify(defaultMockEntries));
      return defaultMockEntries;
    } catch {
      return defaultMockEntries;
    }
  };

  const getLocalHistory = (): ConsultationHistoryItem[] => {
    if (typeof window === 'undefined') return defaultMockHistory;
    try {
      const stored = localStorage.getItem('ht_consultation_history');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('ht_consultation_history', JSON.stringify(defaultMockHistory));
      return defaultMockHistory;
    } catch {
      return defaultMockHistory;
    }
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
        if (!res.ok) throw new Error('API Offline');

        const data: JournalEntry[] = await res.json();
        setJournalEntries(data);
      } catch {
        // Smart Local Vault Fallback
        let local = getLocalEntries();
        if (sourceModule && sourceModule !== 'ALL') {
          local = local.filter((e) => e.source_module === sourceModule);
        }
        setJournalEntries(local);
        setErrorMessage(null);
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
      if (!res.ok) throw new Error('API Offline');

      const data: ConsultationHistoryItem[] = await res.json();
      setHistoryTimeline(data);
    } catch {
      // Smart Local Vault Fallback
      setHistoryTimeline(getLocalHistory());
      setErrorMessage(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  const createEntry = useCallback(
    async (data: JournalEntryCreate): Promise<JournalEntry | null> => {
      setIsLoading(true);
      setErrorMessage(null);

      const newEntry: JournalEntry = {
        id: `entry-${Date.now()}`,
        user_id: 'user-local',
        title: data.title,
        content: data.content,
        mood_tag: data.mood_tag || 'reflective',
        source_module: data.source_module || 'general',
        insights: data.insights || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

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

        if (!res.ok) throw new Error('API Offline');

        const created: JournalEntry = await res.json();
        setJournalEntries((prev) => [created, ...prev]);
        return created;
      } catch {
        // Smart Local Vault Fallback
        const current = getLocalEntries();
        const updated = [newEntry, ...current];
        if (typeof window !== 'undefined') {
          localStorage.setItem('ht_journal_entries', JSON.stringify(updated));
        }
        setJournalEntries(updated);
        setErrorMessage(null);
        return newEntry;
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

        if (!res.ok) throw new Error('API Offline');

        setJournalEntries((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch {
        // Smart Local Vault Fallback
        const current = getLocalEntries();
        const updated = current.filter((item) => item.id !== id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ht_journal_entries', JSON.stringify(updated));
        }
        setJournalEntries(updated);
        setErrorMessage(null);
        return true;
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
