'use client';

import { useState, useCallback } from 'react';
import {
  MinhKienConsultationResponse,
  StreamStatus,
  TenPointCompassionateCandor,
} from '@/types/consultation';

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

  const resetStream = useCallback(() => {
    setStatus('idle');
    setStreamText('');
    setResponsePayload(null);
    setErrorMessage(null);
  }, []);

  const startConsultation = useCallback(
    async (userQuery: string, provider: string = 'mock') => {
      setStatus('connecting');
      setStreamText('');
      setResponsePayload(null);
      setErrorMessage(null);

      const requestBody = {
        messages: [{ role: 'user', content: userQuery }],
        provider,
      };

      try {
        const res = await fetch(`${apiBaseUrl}/sessions/minh-kien`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          const message =
            errJson.detail ||
            `Lỗi kết nối API (${res.status}): ${res.statusText}`;
          if (res.status === 402) {
            setErrorMessage(
              '⚠️ Bạn không đủ số dư Linh Điểm để thực hiện phiên tư vấn (Yêu cầu: 10 Linh Điểm).'
            );
          } else {
            setErrorMessage(message);
          }
          setStatus('error');
          return;
        }

        const data: MinhKienConsultationResponse = await res.json();
        setResponsePayload(data);
        setStreamText(data.content);

        if (data.safety_action === 'EMERGENCY_HOTLINE') {
          setStatus('crisis_alert');
        } else {
          setStatus('completed');
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi không xác định khi kết nối với Minh Sư AI.';
        setErrorMessage(msg);
        setStatus('error');
      }
    },
    [apiBaseUrl]
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
