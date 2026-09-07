'use client';

import { useState, useCallback } from 'react';
import {
  DuongDaoArticle,
  DuongDaoCategory,
  SleepHygieneGuideInput,
  SleepHygieneGuideResponse,
} from '@/types/duong_dao';

interface UseDuongDaoReturn {
  isLoading: boolean;
  articles: DuongDaoArticle[];
  sleepGuide: SleepHygieneGuideResponse | null;
  errorMessage: string | null;
  fetchArticles: (category?: DuongDaoCategory) => Promise<void>;
  calculateSleepGuide: (
    input: SleepHygieneGuideInput
  ) => Promise<SleepHygieneGuideResponse | null>;
}

export function useDuongDao(
  apiBaseUrl: string = 'http://127.0.0.1:8000/api/v1'
): UseDuongDaoReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<DuongDaoArticle[]>([]);
  const [sleepGuide, setSleepGuide] =
    useState<SleepHygieneGuideResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchArticles = useCallback(
    async (category?: DuongDaoCategory) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const url = category
          ? `${apiBaseUrl}/duong-dao/articles?category=${category}`
          : `${apiBaseUrl}/duong-dao/articles`;

        const res = await fetch(url);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.detail || 'Không thể tải danh sách bài viết.');
        }

        const data: DuongDaoArticle[] = await res.json();
        setArticles(data);
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

  const calculateSleepGuide = useCallback(
    async (
      input: SleepHygieneGuideInput
    ): Promise<SleepHygieneGuideResponse | null> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`${apiBaseUrl}/duong-dao/sleep-guide`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(
            errJson.detail || 'Không thể tính toán gợi ý giấc ngủ.'
          );
        }

        const data: SleepHygieneGuideResponse = await res.json();
        setSleepGuide(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
        setErrorMessage(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  return {
    isLoading,
    articles,
    sleepGuide,
    errorMessage,
    fetchArticles,
    calculateSleepGuide,
  };
}
