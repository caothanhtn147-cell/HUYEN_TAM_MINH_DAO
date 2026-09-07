'use client';

import { useState, useCallback } from 'react';
import {
  BirthDataInput,
  BaTuChartResponse,
  TuViChartResponse,
  FullAstrologyAnalysisResponse,
} from '@/types/astrology';

interface UseAstrologyChartReturn {
  isLoading: boolean;
  batuChart: BaTuChartResponse | null;
  tuviChart: TuViChartResponse | null;
  fullAnalysis: FullAstrologyAnalysisResponse | null;
  errorMessage: string | null;
  generateFullAnalysis: (
    birthData: BirthDataInput
  ) => Promise<FullAstrologyAnalysisResponse | null>;
  resetChart: () => void;
}

export function useAstrologyChart(
  apiBaseUrl: string = 'http://127.0.0.1:8000/api/v1'
): UseAstrologyChartReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [batuChart, setBatuChart] = useState<BaTuChartResponse | null>(null);
  const [tuviChart, setTuviChart] = useState<TuViChartResponse | null>(null);
  const [fullAnalysis, setFullAnalysis] =
    useState<FullAstrologyAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetChart = useCallback(() => {
    setIsLoading(false);
    setBatuChart(null);
    setTuviChart(null);
    setFullAnalysis(null);
    setErrorMessage(null);
  }, []);

  const generateFullAnalysis = useCallback(
    async (
      birthData: BirthDataInput
    ): Promise<FullAstrologyAnalysisResponse | null> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`${apiBaseUrl}/astrology/full-analysis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(birthData),
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

        const data: FullAstrologyAnalysisResponse = await res.json();
        setFullAnalysis(data);
        setBatuChart(data.batu_chart);
        setTuviChart(data.tuvi_chart);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không xác định khi lập lá số Bát Tự & Tử Vi.';
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
    batuChart,
    tuviChart,
    fullAnalysis,
    errorMessage,
    generateFullAnalysis,
    resetChart,
  };
}
