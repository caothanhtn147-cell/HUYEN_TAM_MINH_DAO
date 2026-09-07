'use client';

import { useState, useCallback } from 'react';
import { TarotDrawResponse } from '@/types/tarot';

interface UseTarotDrawReturn {
  isLoading: boolean;
  drawData: TarotDrawResponse | null;
  errorMessage: string | null;
  drawCards: (count: number, intention?: string) => Promise<void>;
  resetDraw: () => void;
}

export function useTarotDraw(
  apiBaseUrl: string = 'http://127.0.0.1:8000/api/v1'
): UseTarotDrawReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [drawData, setDrawData] = useState<TarotDrawResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetDraw = useCallback(() => {
    setIsLoading(false);
    setDrawData(null);
    setErrorMessage(null);
  }, []);

  const drawCards = useCallback(
    async (count: number = 1, intention?: string) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`${apiBaseUrl}/tarot/draw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            count,
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
          return;
        }

        const data: TarotDrawResponse = await res.json();
        setDrawData(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không xác định khi rút bài Tarot.';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  return {
    isLoading,
    drawData,
    errorMessage,
    drawCards,
    resetDraw,
  };
}
