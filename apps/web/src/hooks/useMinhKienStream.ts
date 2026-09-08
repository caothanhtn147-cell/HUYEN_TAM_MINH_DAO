'use client';

import { useState, useCallback, useRef } from 'react';
import {
  MinhKienConsultationResponse,
  StreamStatus,
} from '@/types/consultation';
import { ClientWisdomEngine } from '@/lib/ClientWisdomEngine';

interface UseMinhKienStreamReturn {
  status: StreamStatus;
  streamText: string;
  responsePayload: MinhKienConsultationResponse | null;
  errorMessage: string | null;
  startConsultation: (userQuery: string, provider?: string) => Promise<void>;
  resetStream: () => void;
}

export function useMinhKienStream(
  apiBaseUrl: string = 'http://127.0.0.1:8000/api/v1'
): UseMinhKienStreamReturn {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [streamText, setStreamText] = useState<string>('');
  const [responsePayload, setResponsePayload] =
    useState<MinhKienConsultationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetStream = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setStatus('idle');
    setStreamText('');
    setResponsePayload(null);
    setErrorMessage(null);
  }, []);

  const streamTextTypewriter = useCallback(
    (data: MinhKienConsultationResponse) => {
      setStatus('streaming');
      setStreamText('');

      const fullText = data.content;
      let currentIndex = 0;
      const step = 12; // characters per tick
      const intervalMs = 15; // fast 60fps typing speed

      streamIntervalRef.current = setInterval(() => {
        currentIndex += step;
        if (currentIndex >= fullText.length) {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          setStreamText(fullText);
          setResponsePayload(data);
          if (data.safety_action === 'EMERGENCY_HOTLINE') {
            setStatus('crisis_alert');
          } else {
            setStatus('completed');
          }
        } else {
          setStreamText(fullText.slice(0, currentIndex));
        }
      }, intervalMs);
    },
    []
  );

  const startConsultation = useCallback(
    async (userQuery: string, provider: string = 'mock') => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }

      setStatus('connecting');
      setStreamText('');
      setResponsePayload(null);
      setErrorMessage(null);

      let fetchedData: MinhKienConsultationResponse | null = null;

      // On static production or HTTPS, directly use Autonomous Client Wisdom Engine (0.01s instant responsiveness)
      const isHttpsOrStatic =
        typeof window !== 'undefined' &&
        (window.location.protocol === 'https:' ||
          window.location.hostname !== 'localhost');

      if (isHttpsOrStatic) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        fetchedData = ClientWisdomEngine.generateConsultation(userQuery);
      } else {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 600);

          const res = await fetch(`${apiBaseUrl}/sessions/minh-kien`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [{ role: 'user', content: userQuery }],
              provider,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            fetchedData = await res.json();
          }
        } catch {
          // Fallback to Autonomous Client Engine
        }

        if (!fetchedData) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          fetchedData = ClientWisdomEngine.generateConsultation(userQuery);
        }
      }

      // Stream the wisdom character-by-character
      streamTextTypewriter(fetchedData);
    },
    [apiBaseUrl, streamTextTypewriter]
  );

  return {
    status,
    streamText,
    responsePayload,
    errorMessage,
    startConsultation,
    resetStream,
  };
}
