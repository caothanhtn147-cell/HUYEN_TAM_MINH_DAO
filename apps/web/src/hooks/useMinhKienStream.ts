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
      const step = 8; // characters per tick
      const intervalMs = 20;

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

      // Attempt remote API first if on localhost or configured, with quick timeout
      let fetchedData: MinhKienConsultationResponse | null = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

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
        // Network unavailable or mixed content blocked -> Smoothly fallback to Autonomous Client Engine
      }

      // If remote API is unavailable or returned error, engage autonomous client wisdom engine
      if (!fetchedData) {
        // Short pause to emulate thoughtful AI contemplation
        await new Promise((resolve) => setTimeout(resolve, 350));
        fetchedData = ClientWisdomEngine.generateConsultation(userQuery);
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
