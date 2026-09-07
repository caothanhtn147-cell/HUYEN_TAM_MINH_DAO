'use client';

import { useState, useCallback } from 'react';
import { IChingTossResponse, IChingHexagramItem } from '@/types/iching';

interface UseIChingTossReturn {
  isLoading: boolean;
  tossData: IChingTossResponse | null;
  errorMessage: string | null;
  catalog: IChingHexagramItem[];
  executeToss: (intention?: string) => Promise<IChingTossResponse | null>;
  fetchCatalog: () => Promise<void>;
  resetToss: () => void;
}

export function useIChingToss(
  apiBaseUrl: string = 'http://127.0.0.1:8000/api/v1'
): UseIChingTossReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tossData, setTossData] = useState<IChingTossResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<IChingHexagramItem[]>([]);

  const resetToss = useCallback(() => {
    setIsLoading(false);
    setTossData(null);
    setErrorMessage(null);
  }, []);

  const executeToss = useCallback(
    async (intention?: string): Promise<IChingTossResponse | null> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`${apiBaseUrl}/iching/toss`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            intention: intention?.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          const message =
            errJson.detail ||
            `Lỗi kết nối máy chủ (${res.status}): ${res.statusText}`;
          setErrorMessage(message);
          setIsLoading(false);
          return null;
        }

        const data: IChingTossResponse = await res.json();
        setTossData(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không xác định khi gieo quẻ Kinh Dịch.';
        setErrorMessage(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  const fetchCatalog = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/iching/hexagrams`);
      if (res.ok) {
        const data: IChingHexagramItem[] = await res.json();
        setCatalog(data);
      }
    } catch {
      // Non-blocking catalog fetch
    }
  }, [apiBaseUrl]);

  return {
    isLoading,
    tossData,
    errorMessage,
    catalog,
    executeToss,
    fetchCatalog,
    resetToss,
  };
}
