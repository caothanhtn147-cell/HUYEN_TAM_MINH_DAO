'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TextToSpeechVoiceSynthProps {
  textToRead: string;
}

export const TextToSpeechVoiceSynth: React.FC<TextToSpeechVoiceSynthProps> = ({
  textToRead,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSupported] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  });
  const { language } = useLanguage();

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any existing speech
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language === 'en' ? 'en-US' : 'vi-VN';
      utterance.rate = 0.95; // Slightly calmer pace

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggleSpeech}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
        isSpeaking
          ? 'border-rose-500/40 bg-rose-500/10 text-rose-300 animate-pulse'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20'
      }`}
    >
      <span>{isSpeaking ? '🔊' : '🔈'}</span>
      <span>
        {isSpeaking
          ? language === 'en'
            ? 'Stop Voice'
            : 'Tắt Giọng Đọc'
          : language === 'en'
          ? 'Read Aloud AI Voice'
          : 'Đọc Lời Khuyên (AI Voice)'}
      </span>
    </button>
  );
};
